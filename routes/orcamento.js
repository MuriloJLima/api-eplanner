//importando express
const express = require("express")
const { JSON } = require("sequelize")

//importando router
const router = express.Router()

//importando models
const models = require('../models')

//armazenando model de orçamento em uma constante
const orcamento = models.Orcamento

//rota com função de adicionar orçamento
router.post('/adicionar', async (req, res)=>{
    await orcamento.create({
        usuarioId: req.body.usuarioId,
        valor: req.body.valor
    })
    res.send(JSON.stringfy('success'))
})

//rota com função de listar orçamentos
router.get('/listar', async (req, res)=>{
    await orcamento.findByPk(id).then((response)=>{
        res.send(response)
    })
})

//rota com função de listar orçamento a ser editado
router.get('/editar/:id', async (req, res)=>{

    let id = req.params.id

    await orcamento.findByPk(id).then((response)=>{
            res.send(response)
        })
    
})

//rota com função de editar orçamento
router.post('/editar', async (req, res)=>{

    let id = req.body.id
    let valor = req.body.valor

    await orcamento.update(
        {valor},
        {where:{id}}
    ).then(()=>{
        res.send(JSON.stringfy('success'))
    })
})

// //rota com função de deletar orçamento
// router.get('/deletar', async (req, res)=>{
    
// })

module.exports = router