const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.urlencoded({extended: true}));
// app.use(express.json());

// app.get('/', (req, res)=>{
//     res.send('Servidor rodando')
// })

let porta = process.env.PORT || 3000;
app.listen(porta, (req, res)=>{
    console.log('Servidor rodando');
});