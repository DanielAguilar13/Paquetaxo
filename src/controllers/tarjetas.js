const express = require('express');

const respuesta = require('../DB/response');
const controlador = require('./controller-tarjetas');

const router = express.Router();

router.get('/', async function (req, res) {
    try{
        const items = await controlador.todos();
        respuesta.success(req, res, items, 200);
    }catch(err){
        respuesta.error(req, res, err, 500)
    }
    
});

router.get('/:id', async function (req, res) {
    try{
        const items = await controlador.uno(req.params.id);
        respuesta.success(req, res, items, 200);
    }catch(err){
        respuesta.error(req, res, err, 500)
    }
    
});

module.exports = router;