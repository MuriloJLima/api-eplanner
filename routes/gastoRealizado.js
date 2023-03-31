const express = require("express");

//tonando express executável
const app = express()

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//configurando express para trabalhar com json
app.use(express.json());

//importando router para utilização de rotas em arquivos separados
const router = express.Router()

//importando models
const categoria = require('../models/categorias')
const gastoRealizado = require('../models/gastosRealizados')

//rota com função de listar categorias para seleção no formulário de gasto
router.get('/adicionar/add', async (req, res) => {
    let id = req.body.usuarioid

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

            let valorDisponivel = req.body.categoria.valorDisponivel - gasto.valor
            let id = req.body.categoria.id

            categoria.update(
                { valorDisponivel },
                { where: { id } }
            )
            res.send(JSON.stringify("success"))
        }).catch((error) => {
            res.send(JSON.stringify('error'))
            console.log(error)
        })

    }

})

//rota com função de listar gastos através no mês de registro
router.get('/listar/:mes/:ano', async (req, res) => {

    let mes = req.params.mes
    let ano = req.params.ano

    await gastoRealizado.findAll({
        where: {
            createdAt: {
                [Op.gte]: new Date(ano, mes - 1, 1), // data inicial do mês
                [Op.lt]: new Date(ano, mes, 1), // data inicial do próximo mês
            }
        },
        include: [{ all: true }],
    }).then((response) => {

        if (!response || response === undefined || response == '') {
            res.send(JSON.stringify('Nenhum gasto realizado nesse período'))
        } else {
            res.send(response)
        }
    }).catch((error) => {
        res.send(JSON.stringify('error'))
        console.log(error)
    })

})


// router.post('/editar', async (req, res) => {

// })

router.post('/excluir', async (req, res) => {

})

module.exports = router