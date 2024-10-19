const db = require('../../DB/db');
const ctrl = require('./controller-movimientos');

module.exports = ctrl (db);