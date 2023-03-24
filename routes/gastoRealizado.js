const express = require("express");

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

//rota com função de listar categorias para seleção no formulário de gasto
router.get('/adicionar/add', async (req, res) => {
    let id = req.body.id

    await categoria.findAll({ where: { orcamentoId: id } }).then((response) => {
        res.send(response)
    })
})

//rota com função de adicionar gasto
router.post('/adicionar', async (req, res) => {

    //validações
    let erros = []

    if (req.body.categoria.valor < req.body.valor || !req.body.valor || req.body.valor == null) {
        erros.push({ texto: "Valor inválido" })
    }

    if (erros.length > 0) {
        res.send({ erros: erros })
    } else {
        //inserindo gasto e atualizando tabela de categoria
        await gastoRealizado.create({
            descricao: req.body.descricao,
            valor: req.body.valor,
            categoriaId: req.body.categoria.id
        }).then((gasto) => {

            let valor = req.body.categoria.valor - gasto.valor
            let id = req.body.categoria.id

            categoria.update(
                { valor },
                { where: { id } }
            )
            res.send(JSON.stringify("success"))
        }).catch((error) => {
            res.send(JSON.stringify('error'))
            console.log(error)
        })
        
    }

})

router.get('/listar', async (req, res) => {

})

router.post('/editar', async (req, res) => {

})

router.post('/excluir', async (req, res) => {

})

module.exports = router