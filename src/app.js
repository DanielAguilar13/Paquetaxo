const express = require('express');
const config = require('./config');


const usuario = require ('./controllers/usuario.js')
const app = express();

//configuracion
app.set('port', config.app.port)

//rutas
app.use('/api/usuario',usuario)
module.exports = app;