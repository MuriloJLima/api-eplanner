//importando express
const express = require("express")

//tonando express executável
const app = express()

//configurando express para trabalhar com json
app.use(express.json());

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//importando router para utilização de rotas em arquivos separados
const router = express.Router()

//importando models
const categoria = require('../models/categorias')
const orcamento = require('../models/orcamentos')
const gastoRealizado = require('../models/gastosRealizados');

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
                    categoria.sum('valor', { where: { orcamentoId: renda.id } }).then((somaCats) => {
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
                valor: req.body.valor,
            })
            res.send(JSON.stringify("success"))
        }
    } catch {
        res.send(JSON.stringify('error'))
    }
})

//rota com função de listar todas as categorias pertencentes a um usuário, 
//juntamente com o total de gastos naquele mês
router.post('/listar', async (req, res) => {

    const usuarioId = req.body.usuarioId;

    const mes = req.body.mes;
    const ano = req.body.ano;

    await categoria.findAll({
        where: { orcamentoId: usuarioId },
        include: [{
            model: gastoRealizado,
            attributes: [],
            where: {
                createdAt: {
                    [Op.gte]: new Date(ano, mes - 1, 1),
                    [Op.lt]: new Date(ano, mes, 1),
                }
            },
            required: false // permite incluir categorias sem gastos
        }],
        attributes: [
            'id',
            'nome',
            'valor',
            'descricao',
            'orcamentoId',
            [Sequelize.literal(`(
            SELECT SUM(valor)
            FROM gastosrealizados
            WHERE categoriaId = categorias.id
              AND MONTH(createdAt) = ${mes}
              AND YEAR(createdAt) = ${ano}
          )`), 'valorTotalGastos']
        ]
    }).then((response) => {
        console.log(response);
        res.send(response);
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

    let id = req.body.categoriaId;
    let nome = req.body.nome;
    let descricao = req.body.descricao;
    let valor = req.body.valor;

    //editando categoria
    await categoria.update(
        { nome, descricao, valor },
        { where: { id } }
    ).then(() => {
        res.send("success");
    }).catch((error) => {
        console.error(error);
        res.status(500).send("error");
    });

});

//rota com função de excluir categoria
router.post('/deletar/:id', async (req, res) => {
    await categoria.destroy({ where: { id: req.params.id } })
    res.send('categoria deletada')
})

module.exports = router