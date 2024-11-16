const db = require('../../DB/db');

const TABLA = 'recordatorios';


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
    
    function agregar(data) {
        console.log('Datos recibidos en la función agregar:', data);
    
        return db.insertar('recordatorios', data)
            .then((result) => {
                console.log('Inserción exitosa en la base de datos:', result);
                return result;
            })
            .catch((error) => {
                console.error('Error en la función agregar:', error);
                throw error;
            });
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

