const express = require('express');

const respuesta = require('../../DB/response.js');
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


async function agregar(req, res, next) {
    try {
        console.log('Datos recibidos en agregar:', req.body); // Ver los datos que llegan al backend

        const items = await controlador.agregar(req.body);
        let mensaje;

        if (req.body.id == 0) {
            mensaje = 'Recordatorio guardado con éxito';
        } else {
            mensaje = 'Recordatorio actualizado con éxito';
        }

        console.log('Resultado de la base de datos:', items); // Ver respuesta de la base de datos
        respuesta.success(req, res, mensaje, 201); // Enviar la respuesta de éxito
    } catch (err) {
        console.error('Error en agregar:', err); // Ver errores en consola
        next(err);
    }
}

async function eliminar (req, res, next) {
    try{
        const items = await controlador.eliminar(req.body);
        respuesta.success(req, res, 'Tarjeta eliminada exitosamente', 200);
    }catch(err){
        next(err);
    }
    
};

module.exports = router;