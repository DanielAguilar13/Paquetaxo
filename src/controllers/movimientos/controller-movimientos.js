const db = require('../../DB/db');

const TABLA = 'movimientos';


module.exports = function (dbInyectada){
    let db = dbInyectada;

    if(!db){
        db = require('../../DB/db');
    }

    async function todos (){
        return db.todos(TABLA);
    }
    
    async function uno (id){
        return db.uno(TABLA,id);
    }
    
    function agregar (body){
        return db.agregar(TABLA, body);
    }
    
    async function eliminar (body){
        return db.eliminar(TABLA, body);
    }

    return {
        
        todos,
        uno,
        agregar,
        eliminar,
    }
}