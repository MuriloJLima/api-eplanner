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
const gastoRealizado = require('../models/gastosRealizados');

//rota com função de listar categorias para seleção no formulário de gasto
router.post('/listar/categotias', async (req, res) => {

    let id = req.body.usuarioId

    // console.log(id)
    await categoria.findAll({ where: { orcamentoId: id } }).then((response) => {
        console.log(response)
        res.send(response)
    })

})

//rota com função de adicionar gasto
router.post('/adicionar', async (req, res) => {

    let categoriaId = req.body.categoriaId

    let mes = req.body.mes
    let ano = req.body.ano

    await gastoRealizado.sum('gastosrealizados.valor', {
        include: {
            model: categoria,
            where: { id: categoriaId }
        },
        where: {
            createdAt: {
                [Op.gte]: new Date(ano, mes - 1, 1), // data inicial do mês
                [Op.lt]: new Date(ano, mes, 1), // data inicial do próximo mês
            }
        }
    }).then((soma) => {
        categoria.findByPk(categoriaId).then((categoria) => {
            let disponivelCat = categoria.valor - soma

            let erros = []

            if (disponivelCat < req.body.valor) {
                erros.push("O valor do gasto deve ser menor que o valor disponível da categoria")
            }

            if (!req.body.valor || req.body.valor == null || !req.body.descricao || req.body.descricao == null) {
                erros.push("Preencha todos os campos")
            }

            if (erros.length > 0) {
                res.send({ erros: erros })
            } else {
                //inserindo gasto
                 gastoRealizado.create({
                    descricao: req.body.descricao,
                    valor: req.body.valor,
                    categoriaId: req.body.categoriaId
                }).then(() => {
                    res.send(JSON.stringify("success"))
                })
            }
        })
    })
})

router.post('/listarCat', async (req, res) => {

    let usuarioId = req.body.usuarioId
    let categoriaId = req.body.categoriaId

    let mes = 4
    let ano = 2023

    await gastoRealizado.sum('gastosrealizados.valor', {
        include: {
            model: categoria,
            where: { orcamentoId: usuarioId, id: categoriaId }
        },
        where: {
            createdAt: {
                [Op.gte]: new Date(ano, mes - 1, 1), // data inicial do mês
                [Op.lt]: new Date(ano, mes, 1), // data inicial do próximo mês
            }
        }
    }).then((response) => {
        console.log(response)
        res.send(JSON.stringify(response))
    }).catch((error) => {
        res.send(JSON.stringify(error))                    //<= tratamento de erro para evitar que a aplicação caia
        console.log(error)
    })
})

//rota com função de listar gastos através no mês de registro e da categoria vinculada ao usuário
router.get('/listar', async (req, res) => {

    let id = req.body.usuarioId

    let mes = req.body.mes
    let ano = req.body.ano

    await gastoRealizado.findAll({
        include: {
            model: categoria,
            where: { orcamentoId: id }
        },
        where: {
            createdAt: {
                [Op.gte]: new Date(ano, mes - 1, 1), // data inicial do mês
                [Op.lt]: new Date(ano, mes, 1), // data inicial do próximo mês
            }
        }
    }).then((response) => {

        res.send(response)
    })
})


// router.post('/editar', async (req, res) => {

// })

router.post('/excluir/:id', async (req, res) => {
    await gastoRealizado.destroy({ where: { id: req.params.id } })
    res.send(JSON.stringify('success'))
})

module.exports = router