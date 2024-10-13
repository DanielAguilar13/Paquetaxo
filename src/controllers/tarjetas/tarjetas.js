const express = require('express');

const respuesta = require('../../DB/response');
const controlador = require('./index.js');

const router = express.Router();
router.get('/', todos); 
router.get('/:id', uno);
router.post('/', agregar);
router.put('/', eliminar);

async function todos (req, res) {
    try{
        const items = await controlador.todos();
        respuesta.success(req, res, items, 200);
    }catch(err){
        respuesta.error(req, res, err, 500)
    }
    
};

async function uno (req, res) {
    try{
        const items = await controlador.uno(req.params.id);
        respuesta.success(req, res, items, 200);
    }catch(err){
        respuesta.error(req, res, err, 500)
    }
    
};


async function agregar (req, res, next) {
    try{
        const items = await controlador.agregar(req.body);
        if(req.body.id == 0){
            mensaje = 'Tarjeta guardada con exito';
        }else{
            mensaje = 'Tarjeta actualizada con exito';
        }
        respuesta.success(req, res, mensaje, 201);
    }catch(err){
        next(err);
    }
    
};

async function eliminar (req, res, next) {
    try{
        const items = await controlador.eliminar(req.body);
        respuesta.success(req, res, 'Tarjeta eliminada exitosamente', 200);
    }catch(err){
        next(err);
    }
    
};

module.exports = router;