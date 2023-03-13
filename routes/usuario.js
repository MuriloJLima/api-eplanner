//importando express
const express = require("express")

//importando router
const router = express.Router()

//importando models
const models = require('../models')

//armazenando model de orçamento em uma constante
const usuario = models.Usuario

//rota com função de adicionar usuario
router.get('/adicionar', async (req, res)=>{
    await usuario.create({
        nome: 'padrão',
        email: 'pad@gmail',
        senha: '12345'
    })
    res.send('Usuário adicionado!')
})

router.get('/listar', async (req, res)=>{

    let id = req.body.id
    
    await usuario.findByPk(id).then((response)=>{
        res.send(response)
    })
})

module.exports = router