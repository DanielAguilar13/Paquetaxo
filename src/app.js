const express = require('express');
const morgan = require('morgan');
const config = require('./config');


const usuario = require ('./controllers/tarjetas.js')
const app = express();

//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//configuracion
app.set('port', config.app.port)

//rutas
app.use('/api/usuario',usuario)
module.exports = app;