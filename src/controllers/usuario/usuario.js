const express = require('express');

const respuesta = require('../../DB/response');
const controlador = require('./index.js');

const router = express.Router();

router.post('/', agregar);
router.put('/', eliminar);


async function agregar (req, res, next) {
    try{
        const items = await controlador.agregar(req.body);
        if(req.body.id == 0){
            mensaje = 'Usuario guardado con exito';
        }else{
            mensaje = 'Usuario actualizado con exito';
        }
        respuesta.success(req, res, mensaje, 201);
    }catch(err){
        next(err);
    }
    
};

async function eliminar (req, res, next) {
    try{
        const items = await controlador.eliminar(req.body);
        respuesta.success(req, res, 'Usuario eliminado exitosamente', 200);
    }catch(err){
        next(err);
    }
    
};

module.exports = router;