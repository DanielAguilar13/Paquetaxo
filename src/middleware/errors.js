function error (message, code){
    let e = new Error(message);

    if(code){
        e.status.code = code;
    }

    return e;
}

module.exports = error;