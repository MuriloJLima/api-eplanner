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
const gastoRealizado = models.GastoRealizado

router.get('/adicionar/add', async (req, res) => {
    let id = req.body.id

    await categoria.findAll({ where: { orcamentoId: id } }).then((response) => {
        res.send(response)
    })
})

router.post('/adicionar', async (req, res) => {
    await gastoRealizado.create({
        descricao: req.body.descricao,
        valor: req.body.valor,
        categoriaId: req.body.categoria
    })
})

router.get('/listar', async (req, res) => {

})

router.post('/editar', async (req, res) => {

})

router.post('/excluir', async (req, res) => {

})

module.exports = router