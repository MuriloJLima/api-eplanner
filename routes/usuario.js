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
    let adicionar = await usuario.create({
        nome: 'padrão',
        email: 'pad@gmail',
        senha: '12345'
    })
    res.send('Usuário adicionado!')
})

module.exports = router