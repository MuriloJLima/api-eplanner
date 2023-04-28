//importando express
const express = require("express")

//tonando express executável
const app = express()

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//configurando express para trabalhar com json
app.use(express.json());

//importando router para utilização de rotas em arquivos separados
const router = express.Router()

//importando models
const usuario = require('../models/usuarios')
const orcamento = require('../models/orcamentos')
const gastoRealizado = require('../models/gastosRealizados')
const gastoAgendado = require('../models/gastosAgendados')
const categoria = require('../models/categorias');

//rota com função de adicionar orçamento
router.post('/adicionar', async (req, res) => {

    let id = req.body.usuarioId

    await usuario.findByPk(id, { include: [{ all: true }] }).then((response) => {

        if (response.orcamentos) {
            res.send(JSON.stringify('Usuário ja possui orçamento'))
        } else {
            orcamento.create({
                usuarioId: req.body.usuarioId,
                valor: req.body.valor
            })

            res.send(JSON.stringify('success'))
        }
    }).catch((error) => {
        res.send(JSON.stringify('error'))
        console.log(error)
    })


})

//rota com função de listar orçamento, juntamente com a soma dos valores dos gastos do mês
router.post('/listar', async (req, res) => {

    let id = req.body.usuarioId

    await usuario.findByPk(id, { include: { model: orcamento } }).then((usuario) => {

        let orcamento = usuario.orcamento
        console.log(orcamento)

        // res.send(orcamento)

        let mes = req.body.mes
        let ano = req.body.ano

        console.log(mes, ano)

        gastoRealizado.sum('gastosrealizados.valor', {
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
        }).then((gastosRealizados) => {

            gastoAgendado.sum('gastosagendados.valor', {
                include: {
                    model: categoria,
                    where: { orcamentoId: id }
                },
                where: {
                    dataGasto: {
                        [Op.gte]: new Date(ano, mes - 1, 1), // data inicial do mês
                        [Op.lt]: new Date(ano, mes, 1), // data inicial do próximo mês
                    }
                }
            }).then((gastosAgendados) => {

                    let gastos = gastosRealizados + gastosAgendados
                    let response = { orcamento, gastos }
                    res.send(JSON.stringify(response))
                    console.log(JSON.stringify(response))
                }).catch((error) => {
                    res.send(JSON.stringify(error))                    //<= tratamento de erro para evitar que a aplicação caia
                    console.log(error)
                })
        })
    })

})

//rota com função de listar orçamento a ser editado
router.get('/editar', async (req, res) => {

    let id = req.body.usuarioId


    await usuario.findByPk(id, { include: [{ all: true }] }).then((response) => {
        res.send(response.orcamentos)
    }).catch((error) => {
        res.send(JSON.stringify('error'))
        console.log(error)
    })

})

//rota com função de editar orçamento
router.post('/editar', async (req, res) => {

    let id = req.body.usuarioId
    let valor = req.body.valor

    categoria.sum('valor', { where: { orcamentoId: id } }).then((somaCats) => {

        let erros = []

        if (valor < somaCats) {
            erros.push("o valor de suas categorias ultrapassa a renda selecionada!")
        }

        if (erros.length > 0) {
            res.send({ erros: erros })
        } else {

            orcamento.update(
                { valor },
                { where: { id } }
            ).then(() => {
                res.send(JSON.stringify('success'))
            }).catch((error) => {
                res.send(JSON.stringify('error'))
                console.log(error)
            })
        }
    })



})

//rota com função de deletar orçamento
// router.get('/deletar/:id', async (req, res) => {
//     orcamento.destroy({ where: { id: req.params.id } })
//     res.send('renda deletada')
// })

module.exports = router