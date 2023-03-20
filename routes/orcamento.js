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
const usuario = models.Usuario
const orcamento = models.Orcamento

//rota com função de adicionar orçamento
router.post('/adicionar', async (req, res) => {

    // await orcamento.create({

    //     id: 1,
    //     usuarioId: req.body.usuarioId,
    //     valor: req.body.valor
    // })

    //validação dos orçamentos
    // let erros = []

    // if (req.body.valor < 500 || req.body.valor > 12000 || typeof req.body.valor == undefined ||
    //     req.body.valor == null || !req.body.valor) {
    //     erros.push({ texto: "Valor inválido" })
    // }

    // if (erros.length > 0) {
    //     res.send({ erros: erros })
    // } else {

    //verificando se o usuário ja possui orçamento
    let id = req.body.usuarioId

    await usuario.findByPk(id, { include: [{ all: true }] }).then((response) => {

        if (response.Orcamento) {
            res.send(JSON.stringify('Usuário ja possui orçamento'))
        } else {
            orcamento.create({

                id: 1,
                usuarioId: req.body.usuarioId,
                valor: req.body.valor
            })

            res.send(JSON.stringify('success'))
        }
    }).catch((error) => {
        res.send(JSON.stringify('error'))
        console.log(error)
    })

    // }
})

//rota com função de listar orçamento, que está relaionado ao usuario, 
router.get('/listar', async (req, res) => {

    let id = req.body.usuarioId

    await usuario.findByPk(id, { include: [{ all: true }] }).then((response) => {
        res.send(response.Orcamento)
    }).catch((error) => {                        //<= tratamento de erro para evitar que a aplicação caia
        res.send(JSON.stringify('error'))
        console.log(error)
    })
})

//rota com função de listar orçamento a ser editado
router.get('/editar', async (req, res) => {

    let id = req.body.usuarioId

    await usuario.findByPk(id, { include: [{ all: true }] }).then((response) => {
        res.send(response.Orcamento)
    }).catch((error) => {
        res.send(JSON.stringify('error'))
        console.log(error)
    })

})

//rota com função de editar orçamento
router.post('/editar', async (req, res) => {

    let id = req.body.usuarioId
    let valor = req.body.valor

    await orcamento.update(
        { valor },
        { where: { id } }
    ).then(() => {
        res.send(JSON.stringify('success'))
    }).catch((error) => {
        res.send(JSON.stringify('error'))
        console.log(error)
    })
})

//rota com função de deletar orçamento
router.get('/deletar/:id', async (req, res) => {
    orcamento.destroy({ where: { id: req.params.id } })
    res.send('renda deletada')
})

module.exports = router