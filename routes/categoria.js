//importando express
const express = require("express")

//tonando express executável
const app = express()

//configurando express para trabalhar com json
app.use(express.json());

//importando router para utilização de rotas em arquivos separados
const router = express.Router()

//importando models
const categoria = require('../models/categorias')
const orcamento = require('../models/orcamentos')

//rota com função de listar renda disponível para criação de categoria
router.post('/disponivelCat', async (req, res) => {
    try {
        let usuarioId = req.body.usuarioId


        await orcamento.findOne({ where: { usuarioId } }).then((renda) => {

            categoria.findAll({ where: { orcamentoId: renda.id } }).then((categorias) => {
                if (categorias == '' || !categorias) {
                    let response = renda.valor

                    res.send(JSON.stringify(response))
                    console.log(response)
                }
                else {
                    categoria.sum('valorCompleto', { where: { orcamentoId: renda.id } }).then((somaCats)=>{
                         let response = renda.valor - somaCats

                         console.log(response)
                         res.send(JSON.stringify(response))
                    })

                }

            })
        })
    } catch {
        res.send(JSON.stringify('error'))
    }
})


//rota com função de adicionar categoria
router.post('/adicionar', async (req, res) => {

    try {

        //armazena o valor disponível para a criação de categorias
        let rendaDisponivel = req.body.rendaDisponivel

        // verificar se o valor da categoria ultrapassa o orçamento e a renda disponível
        let erros = []

        if (rendaDisponivel < req.body.valor) {
            erros.push("O valor da categoria deve ser menor que o valor disponível")
        }

        if (!req.body.valor || req.body.valor == null || !req.body.nome || req.body.nome == null
            || !req.body.descricao || req.body.descricao == null) {
            erros.push("Preencha todos os campos")
        }

        if (erros.length > 0) {
            res.send({ erros: erros })
        } else {
            //caso não ultrapasse, criar categoria
            await categoria.create({
                orcamentoId: req.body.usuarioId,
                nome: req.body.nome,
                descricao: req.body.descricao,
                valorCompleto: req.body.valor,
                valorDisponivel: req.body.valor
            })
            res.send(JSON.stringify("success"))
        }
    } catch {
        res.send(JSON.stringify('error'))
    }
})

//rota com função de listar todas as categorias pertencentes a um usuário
router.get('/listar', async (req, res) => {

    let id = req.body.id

    await categoria.findAll({ where: { orcamentoId: id } }).then((response) => {
        res.send(response)
    })

})

//rota com função de listar dados da categoria no form de edição
router.get('/editar/:id', async (req, res) => {
    try {
        let response = await categoria.findByPk(req.params.id)
        res.send(response)
    } catch {
        res.send(JSON.stringify('error'))
    }
})

// rota com função de editar a categoria
router.post('/editar', async (req, res) => {

    //armazena o valor disponível 
    let rendaDisponivel = req.body.rendaDisponivel

    //armazena o valor atual da categoria
    let cat = await categoria.findByPk(req.body.categoriaId)

    //em caso de aumento de valor, verificar se a diferença é maior que o valor disponível
    let erros = []

    if (rendaDisponivel < req.body.valor - cat.valorCompleto || !req.body.valor || req.body.valor == null) {
        erros.push({ texto: "Valor inválido" })
    }

    if (erros.length > 0) {
        res.send({ erros: erros })
    }
    else {

        //alterar o valor disponível dependendo da condição
        let valorDisponivel = cat.valorDisponivel

        if (cat.valorCompleto > req.body.valor) {

            let result = cat.valorCompleto - req.body.valor
            valorDisponivel = Number(cat.valorDisponivel) - result
        }

        if (cat.valorCompleto < req.body.valor) {

            let result = req.body.valor - cat.valorCompleto
            valorDisponivel = Number(cat.valorDisponivel) + result
        }
        let id = req.body.categoriaId;
        let nome = req.body.nome;
        let descricao = req.body.descricao;
        let valorCompleto = req.body.valor;

        //editando categoria
        await categoria.update(
            { nome, descricao, valorCompleto, valorDisponivel },
            { where: { id } }
        ).then(() => {
            res.send("success");
        }).catch((error) => {
            console.error(error);
            res.status(500).send("error");
        });
    }
});

//rota com função de excluir categoria
router.post('/deletar/:id', async (req, res) => {
    await categoria.destroy({ where: { id: req.params.id } })
    res.send('categoria deletada')
})

module.exports = router