exports.success = function (req ,res, mensaje = '', status = 200) {
    res.status(statusCode).send({
        error: false,
        status: statusCode,
        body: mensaje
    });
}

exports.error = function (req ,res, mensaje = 'Error Interno', status = 500){
    res.status(statusCode).send({
        error: true,
        status: statusCode,
        body: mensaje
    });
}