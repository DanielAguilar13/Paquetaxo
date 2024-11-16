const mysql = require("mysql");
const config = require("../config");

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
};

let conexion;
let reconexiones = 0;
const maxReconexiones = 10;

function conMysql() {
    if (reconexiones >= maxReconexiones) {
        console.error("Demasiados intentos de reconexión. Abortando...");
        return;
    }

    conexion = mysql.createConnection(dbconfig);

    conexion.connect(err => {
        if (err) {
            console.error("[db err]", err);
            reconexiones++;
            setTimeout(conMysql, 200);
        } else {
            reconexiones = 0;
            console.log("Conectado a la base de datos");
        }
    });

    conexion.on("error", err => {
        console.error("[db err]", err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            conMysql();
        } else {
            throw err;
        }
    });
}

conMysql();

function todos(tabla) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ??`, [tabla], (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

function uno(tabla, id) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ?? WHERE id = ?`, [tabla, id], (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

function insertar(tabla, data) {
    return new Promise((resolve, reject) => {
        conexion.query(`INSERT INTO ?? SET ?`, [tabla, data], (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

function actualizar(tabla, data) {
    return new Promise((resolve, reject) => {
        const id = data.id;
        delete data.id;
        conexion.query(`UPDATE ?? SET ? WHERE id = ?`, [tabla, data, id], (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

function agregar(tabla, data) {
    if (!data || data.id === undefined || data.id === 0) {
        return insertar(tabla, data);
    } else {
        return actualizar(tabla, data);
    }
}

function eliminar(tabla, data) {
    if (!data || !data.id) {
        return Promise.reject(new Error("Falta el ID para eliminar."));
    }
    return new Promise((resolve, reject) => {
        conexion.query(`DELETE FROM ?? WHERE id = ?`, [tabla, data.id], (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

module.exports = {
    todos,
    uno,
    agregar,
    eliminar,
};