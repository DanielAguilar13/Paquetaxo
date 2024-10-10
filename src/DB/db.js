const mysql = require('mysql');
const config = require('../config');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
}

let conexion;

function conMysql(){
    conexion = mysql.createConnection(dbconfig);

    conexion.connect((err) => {
        if (err) {
            console.error('error connecting:', err);
            setTimeout(conMysql,200);
        }
        else{
            console.log('conectado a la base de datos');
        }
    });

    conexion.on('error', err => {
        console.error('[db err]', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            conMysql();
        }else{
            throw err;
        }
    })
}

conMysql();

function todos(tabla){
    return new Promise( (resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla}`, (err, result) => {
            return error ? reject(error) : resolve(result);
        })
    });   
}

function uno(tabla,id){
    return new Promise( (resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla} WHERE id=${id}`, (err, result) => {
            return error ? reject(error) : resolve(result);
        })
    });   

}
function nuevo(tabla, data){

}
function eliminar(tabla, id){
    return new Promise( (resolve, reject) => {
        conexion.query(`DELETE FROM ${tabla} WHERE id= ?`, (err, result) => {
            return error ? reject(error) : resolve(result);
        })
    });   
}

module.exports = {
    todos,
    uno,
    nuevo,
    eliminar,
}