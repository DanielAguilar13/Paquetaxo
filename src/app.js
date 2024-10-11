const express = require('express');
const morgan = require('morgan');
const config = require('./config');


const tarjetas = require ('./controllers/tarjetas.js')
const app = express();

//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//configuracion
app.set('port', config.app.port)

//rutas
app.use('/api/tarjeta',tarjeta)
module.exports = app;