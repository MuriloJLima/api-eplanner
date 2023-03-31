//importando express
const express = require("express")

//tonando express executável
const app = express()

//configurando express para trabalhar com json
app.use(express.json());

//importando router para utilização de rotas em arquivos separados
const router = express.Router()

//importando models
const usuario = require('../models/usuarios')
const orcamento = require('../models/orcamentos')

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

//rota com função de listar orçamento, que está relaionado ao usuario, 
router.post('/listar', async (req, res) => {

    let id = req.body.usuarioId

    await usuario.findByPk(id, { include: [{ all: true }] }).then((response) => {
        res.send(response.orcamento)
    }).catch((error) => {                        //<= tratamento de erro para evitar que a aplicação caia
        res.send(JSON.stringify('error'))
        console.log(error)
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
// router.get('/deletar/:id', async (req, res) => {
//     orcamento.destroy({ where: { id: req.params.id } })
//     res.send('renda deletada')
// })

module.exports = router