const db = require('../../DB/db');

const TABLA = 'recordatorios';


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
    
    function agregar(data) {
        console.log('Datos recibidos en la función agregar:', data);
        return db.agregar(TABLA, data)

    }
    
    async function eliminar (data){
        const { id } = data;
        return db.eliminar(TABLA, id);
    }

    return {
        
        todos,
        uno,
        agregar,
        eliminar
    }
}

