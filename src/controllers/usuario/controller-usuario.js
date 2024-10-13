const db = require('../../DB/db');

const TABLA = 'usuario';


module.exports = function (dbInyectada){
    let db = dbInyectada;

    if(!db){
        db = require('../../DB/db');
    }

    function todos (){
        return db.todos(TABLA);
    }
    
    function uno (id){
        return db.uno(TABLA,id);
    }
    
    function agregar (body){
        return db.agregar(TABLA, body);
    }
    
    function eliminar (body){
        return db.eliminar(TABLA, body);
    }

    return {
        
        todos,
        uno,
        agregar,
        eliminar,
    }
}

