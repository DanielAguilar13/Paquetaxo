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

    // Verifica que los datos están llegando correctamente
    console.log(`Concepto: ${concepto}, Categoría: ${id_categoria}, Fecha: ${fecha}`);

    // Imprimir el objeto controlador para verificar la función
    console.log(controlador);  // Esto te ayudará a ver si la función 'agregar' existe

    // Crear un objeto 'data' con los datos a insertar
    const data = { concepto, id_categoria, fecha };

    // Llamar al controlador con el objeto 'data'
    controlador.agregar(data)  // Asegúrate de que agregar reciba un objeto 'data'
        .then(() => res.send('Recordatorio agregado correctamente'))
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error al agregar recordatorio');
        });
});

//rutas
app.use('/api/tarjetas',require('./controllers/tarjetas/tarjetas.js'));
app.use('/api/recordatorios', require('./controllers/recordatorios/recordatorios.js'));
app.use(error);

module.exports = app;