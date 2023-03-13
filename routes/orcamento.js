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
        usuarioId: 1,
        valor: req.body.valor
    })
    res.send(JSON.stringfy('success'))
})

//rota com função de listar orçamentos
router.get('/listar', async (req, res)=>{
    
})

//rota com função de listar orçamento a ser editado
router.get('/editar', async (req, res)=>{
    
})

//rota com função de editar orçamento
router.post('/editar', async (req, res)=>{
    
})

//rota com função de deletar orçamento
router.get('/deletar', async (req, res)=>{
    
})

module.exports = router