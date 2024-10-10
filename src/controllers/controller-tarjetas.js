const db = require('../DB/db');

const TABLA = 'clientes';

function todos (){
    return db.todos(TABLA);
}
function uno (id){
    return db.uno(TABLA,id);
}
function eliminar (body){
    return db.uno(TABLA,body);
}
module.exports = {
    todos,
    uno,
    
    eliminar,
}