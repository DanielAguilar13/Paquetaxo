const express = require('express');
const path = require('path');
const morgan = require('morgan');
const config = require('./config');

const controlador = require('./controllers/recordatorios/index.js');
const error = require('./DB/errors.js');

const app = express();


// Configuración de la carpeta estática para el frontend
app.use(express.static(path.join(__dirname, 'views')));


//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//configuracion
app.set('port', config.app.port);

// Ruta para servir el archivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'recordatorios-añadir.html'));
});

// Ruta para procesar el formulario
app.post('/submit', (req, res) => {
    const { concepto, id_categoria, fecha } = req.body;

    // Verificar si los datos llegan
    console.log('Datos recibidos:', req.body);

    if (!concepto || !id_categoria || !fecha) {
        return res.status(400).send('Faltan datos');
    }

    const data = { concepto, id_categoria, fecha };
    console.log('Datos que se enviarán al controlador:', data);

    controlador.agregar(data)
        .then(() => res.send('Recordatorio agregado correctamente'))
        .catch((error) => {
            console.error('Error al agregar el recordatorio:', error);
            res.status(500).send('Error al guardar en la base de datos');
        });
});
//rutas
app.use('/api/tarjeta',require('./controllers/tarjeta/tarjeta.js'));
app.use('/api/recordatorios', require('./controllers/recordatorios/recordatorios.js'));
app.use(error);

module.exports = app;