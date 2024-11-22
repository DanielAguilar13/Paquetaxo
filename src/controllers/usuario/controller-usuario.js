const db = require('../../DB/db');

const TABLA = 'usuario';


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
    
    async function agregar (body){
        return db.agregar(TABLA, body);
    }
    
    async function eliminar (data){
        const { id } = data;
        return db.eliminar(TABLA, id);
    }

    return {
        
        todos,
        uno,
        agregar,
        eliminar,
    }
}

