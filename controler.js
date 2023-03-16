//importando express
const express = require('express');
//importando cors
const cors = require('cors');

//importando rotas
const routerUsuario = require('./routes/usuario')
const routerOrcamento = require('./routes/orcamento')
const routerCategoria = require('./routes/categoria')

//config
const app = express();
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// app.get('/', (req, res)=>{
//     res.send('Servidor rodando')
// })

//colocando rotas em uso 
app.use('/usuario', routerUsuario)
app.use('/orcamento', routerOrcamento)
app.use('/categoria', routerCategoria)

//porta
let porta = process.env.PORT || 3000;
app.listen(porta, (req, res)=>{
    console.log('Servidor rodando');
});