//importando express
const express = require("express")

//importando router
const router = express.Router()

//importando models
const usuario = require('../models/usuarios')

//rota com função de adicionar usuario
router.get('/adicionar', async (req, res)=>{
    await usuario.create({
        nome: 'padrão',
        email: 'pad@gmail',
        senha: '12345'
    })
    res.send('Usuário adicionado!')
})

//rota com função de validar usuário
router.post('/login', async (req, res)=>{
    await usuario.findOne({
        where: {email: req.body.email, senha: req.body.senha}
    }).then((response)=>{
        if(response === null){
            res.send(JSON.stringify('error'))
        }else{
            res.send(response)
        }
    }).catch((error) => {
        res.send(JSON.stringify('error'))  //<= tratamento de erro para evitar que a aplicação caia
        console.log(error)
    })
})

//rota com função de listar usuário
router.get('/listar', async (req, res)=>{

    let id = req.body.id
    
    await usuario.findByPk(id).then((response)=>{
        res.send(response)
    }).catch((error) => {
        res.send(JSON.stringify('error'))
        console.log(error)
    })
})

module.exports = router