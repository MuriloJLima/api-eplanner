//importando express
const express = require("express")

//tonando express executável
const app = express()

//configurando express para trabalhar com json
app.use(express.json());

//importando router para utilização de rotas em arquivos separados
const router = express.Router()

//importando models
const models = require('../models')

//armazenando models em constantes
const categoria = models.Categoria
const orcamento = models.Orcamento

//rota com função de listar renda disponível para criação de categoria
router.get('/disponivelCat', async (req, res) => {
    try {
        let id = req.body.id

        let response = await orcamento.findByPk(id)

        let soma = await categoria.sum('valor', { where: { orcamentoId: id } })
        let rendaDisponivel =  response.valor - soma

        res.send(JSON.stringify(rendaDisponivel))
    } catch {
        res.send(JSON.stringify('error'))
    }
})


//rota com função de adicionar orçamento
router.post('/adicionar', async (req, res) => {

    try {
        //capturar o orçamento pelo id
        let id = req.body.id

        //listar o orçamento para capturar valor
        let response = await orcamento.findByPk(id,
            {
                // include: [{
                //     all: true
                //     // model: categoria,
                //     // required: true
                // }]
            }
        )

        //capturando a soma dos valores das categorias
        let soma = await categoria.sum('valor', { where: { orcamentoId: id } })

        //subtraindo o valor do orçamento com os valores das categorias para verificar a renda disponível
        let rendaDisponivel = response.valor - soma

        // verificar se o valor da categoria ultrapassa o orçamento e a renda disponível
        let erros = []

        if (rendaDisponivel < req.body.valor || response.valor < req.body.valor || !req.body.valor || req.body.valor == null) {
            erros.push({ texto: "Valor inválido" })
        }

        if (erros.length > 0) {
            res.send({ erros: erros })
        } else {
            //caso não ultrapasse, criar categoria
            await categoria.create({
                orcamentoId: req.body.id,
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

router.get('/listar', async (req, res) => {
    await categoria.findAll().then((response) => {
        res.send(response)
    })


})

router.post('/editar', async (req, res) => {

})

router.post('/deletar', async (req, res) => {

})

module.exports = router