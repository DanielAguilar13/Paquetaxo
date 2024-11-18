const express = require('express');
const path = require('path');
const morgan = require('morgan');
const config = require('./config');

const usuario = require('./controllers/usuario/index.js');
const tarjeta = require('./controllers/tarjeta/index.js');
const ahorro = require('./controllers/ahorro/index.js');
const movimiento = require('./controllers/movimientos/index.js');
const recordatorio = require('./controllers/recordatorios/index.js');
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
    res.sendFile(path.join(__dirname, 'views','index.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views','homepage.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views','login.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views','recordatorios.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views','tarjetas-añadir.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views','ahorro.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views','ahorro-añadir.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views','movimientos-añadir.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'recordatorios-añadir.html'));
});

// Ruta para procesar el formulario
app.post('/usuario/submit', (req, res) => {
    const {nombre, id_imagen} = req.body;
        // Verificar si los datos llegan
        console.log('Datos recibidos:', req.body);

        if (!nombre || !id_imagen) {
            return res.status(400).send('Faltan datos');
        }
    
        const data = { nombre, id_imagen };
        console.log('Datos que se enviarán al controlador:', data);
    
        usuario.agregar(data)
    });

app.post('/tarjeta/submit', (req, res) => {
    const { nombre, ultimos_digitos, limite_credito, fecha_corte, saldo, fecha_vencimiento } = req.body;

    // Verificar si los datos llegan
    console.log('Datos recibidos:', req.body);

    if (!nombre || !ultimos_digitos || !limite_credito || !fecha_corte || !saldo || !fecha_vencimiento) {
        return res.status(400).send('Faltan datos');
    }

    const data = { nombre, ultimos_digitos, limite_credito, fecha_corte, saldo, fecha_vencimiento };
    console.log('Datos que se enviarán al controlador:', data);

    tarjeta.agregar(data)
});

app.post('/movimientos/submit', (req, res) => {
    const { concepto, cantidad, id_categoria, id_tipo, id_tarjeta, fecha } = req.body;

    // Verificar si los datos llegan
    console.log('Datos recibidos:', req.body);

    if (!concepto || !cantidad || !id_categoria || !id_tipo || !id_tarjeta || !fecha) {
        return res.status(400).send('Faltan datos');
    }

    const data = { concepto, cantidad, id_categoria, id_tipo, id_tarjeta, fecha };
    console.log('Datos que se enviarán al controlador:', data);

    movimiento.agregar(data)
});

app.post('/ahorro/submit', (req, res) => {
    const { cantidad, concepto, id_tarjeta, fecha } = req.body;

    // Verificar si los datos llegan
    console.log('Datos recibidos:', req.body);

    if ( !cantidad || !concepto || !id_tarjeta || !fecha) {
        return res.status(400).send('Faltan datos');
    }

    const data = { cantidad, concepto, id_tarjeta, fecha };
    console.log('Datos que se enviarán al controlador:', data);

    ahorro.agregar(data)
});

app.post('/recordatorios/submit', (req, res) => {
    const { concepto, id_categoria, fecha } = req.body;

    // Verificar si los datos llegan
    console.log('Datos recibidos:', req.body);

    if (!concepto || !id_categoria || !fecha) {
        return res.status(400).send('Faltan datos');
    }

    const data = { concepto, id_categoria, fecha };
    console.log('Datos que se enviarán al controlador:', data);

    recordatorio.agregar(data)
});
//rutas
app.use('/api/usuario',require('./controllers/usuario/usuario.js'));
app.use('/api/tarjeta',require('./controllers/tarjeta/tarjeta.js'));
app.use('/api/ahorro',require('./controllers/ahorro/ahorro.js'));
app.use('/api/movimientos',require('./controllers/movimientos/movimientos.js'));
app.use('/api/recordatorios', require('./controllers/recordatorios/recordatorios.js'));

app.use(error);

module.exports = app;