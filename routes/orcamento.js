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
router.post('/adicionar', async (req, res)=>{
    await orcamento.create({

        // usuarioId: 1,
        usuarioId: req.body.id,
        valor: req.body.valor
    })
    res.send(JSON.stringify('success'))
})

//rota com função de listar orçamento, que está relaionado ao usuario
router.get('/listar', async (req, res)=>{

    // let id = 1
    let id = req.body.id

    await usuario.findByPk(id, {include:[{all: true}]}).then((response)=>{
        res.send(response.Orcamento)
    })
})

//rota com função de listar orçamento a ser editado
router.get('/editar', async (req, res)=>{
    
    // let id = 1
    let id = req.body.id

    await usuario.findByPk(id, {include:[{all: true}]}).then((response)=>{
        res.send(response.Orcamento)
    })
    
})

//rota com função de editar orçamento
router.post('/editar', async (req, res)=>{

    // let id = 1
    let id = req.body.id
    let valor = req.body.valor

    await orcamento.update(
        {valor},
        {where:{id}}
    ).then(()=>{
        res.send(JSON.stringify('success'))
        // res.send('alterado')
    })
})

// //rota com função de deletar orçamento
// router.get('/deletar', async (req, res)=>{
    
// })

module.exports = router