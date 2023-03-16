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

router.post('/adicionar', async (req, res) => {
    await categoria.create({
        orcamentoId: req.body.id,
        nome: req.body.nome,
        descricao: req.body.descricao,
        valor: req.body.valor,
    })  
    res.send("success")

})

router.get('/listar', async (req, res) => {

})

router.post('/editar', async (req, res) => {

})

router.post('/deletar', async (req, res) => {

})

module.exports = router