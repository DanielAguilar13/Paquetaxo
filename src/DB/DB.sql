CREATE TABLE usuario (  --Crear Tabla usuario
usu_id INTEGER PRIMARY KEY, -- Definimos la columna usu_id la clave primaria como entero
 usu_nombre VARCHAR(80), -- Definimos la columna usu_nombre como una cadena de caracteres  
imagen_id_fk INTEGER, -- Definimos la columna imagen_id_fk de tipo entero como una clave foranea que hace referencia a la tabla de imagenes 
);

CREATE TABLE imagen ( --Crear Tabla imagen
    imagen_id INTEGER PRIMARY KEY, -- Definimos la columna imagen_id y la clave primaria como entero
    imagen_img  VARCHAR(255) -- Definimos la columna imagen_img como una cadena de caracteres  
);                           -- Esta columna almacenará la representación de la imagen 

CREATE TABLE movimientos ( -- Crear Tabla movimientos
    mov_id INTEGER PRIMARY KEY, -- Definimos la columna mov_id y la clave primaria como entero
    mov_concepto VARCHAR(100), -- Definimos la columna mov_concepto como una cadena de caracteres 
    mov_cantidad INTEGER, -- Definimos la columna mov_cantidad de tipo entero
    mov_categoria_id_fk INTEGER, -- Definimos la columna de tipo entero que referencia la tabla categorias 
    mov_tipo_de_pago_id_fk INTEGER, -- Definimos la columna de tipo entero que referencia la tabla tipo de pago
    mov_tarjeta_pago INTEGER, -- Definimos la columna de tipo entero que referencia la tabla tarjetas.  
    FOREIGN KEY (mov_categoria_id_fk) REFERENCES categorias(cat_id), -- Aquí se define la llave foránea que establece relación con la tabla categorias 
    FOREIGN KEY (mov_tipo_de_pago_id_fk) REFERENCES tipo_de_pago(tipo_pago_id), -- Aquí se define la llave foránea que establece la relación con la tabla  tipo de pago
    FOREIGN KEY (mov_tarjeta_pago) REFERENCES tarjetas(tarjeta_id) -- Aquí se define la llave foránea que establece relación con la tabla tarjetas 
);

CREATE TABLE categorias ( -- Crear Tabla categorias
    categoria_id INTEGER PRIMARY KEY, --Definimos la columna de tipo entero y la llave primaria  
    categoria_nombre VARCHAR(30) -- Definimos la columna como una cadena de caracteres donde almacenará el nombre de la categoría
);

CREATE TABLE tipo_de_pago ( -- Crear Tabla tipo de pago 
    tipo_pago_id INTEGER PRIMARY KEY, --Definimos la columna de tipo entero y la llave primaria
    tipo_pago_nombre VARCHAR(80) -- Esta columna almacenará el nombre del tipo de pago("Efectivo", "Tarjeta de Credito / .... Debito")
);

CREATE TABLE ahorro ( -- Crear Tabla ingresos
    ahorro_id INTEGER PRIMARY KEY, -- Definimos la columna de tipo entero y la llave primaria
    ahorro_cantidad INTEGER, -- Definimos la columna de tipo entero en la que almacenará la cantidad de ahorro asociada con cada ingreso
    ahorro_concepto INTEGER, -- Definimos la columna de tipo entero en la que almacenará un concepto relacionado con el ahorro 
    ahorro_tarjeta_id_fk INTEGER, -- Definimos la columna como un entero y se usara como llave foranea para hacer referancia a la tabla tarjeta
    FOREIGN KEY (ahorro_tarjeta_id_fk) REFERENCES tarjeta(tarjeta_id) -- Aquí definimos la llave foranea que establece una relación con la tabla tarjeta 
);

CREATE TABLE tarjeta ( -- Crear Tabla tarjeta
    tarjeta_id INTEGER PRIMARY KEY, --Definimos la columna de tipo entero que será la llave primaria
    tarjeta_nombre VARCHAR(80), -- Definimos la columna como una cadena de caracteres donde almacenará el nombre de la tarjeta
    tarjeta_ultimos_digitos VARCHAR(4), -- Definimos la columna como una cadena de caracteres que almacenara los últimos 4 digitos de numero de la tarjeta
    tarjeta_limite_credito FLOAT, -- Definimos esta columna de tipo flotante donde almacenara el límite de credito total de la tarjeta
    tarjeta_saldo FLOAT, -- Definimos esta columna de tipo flotante dondel almacenara el saldo actual de la tarjeta 
    tarjeta_fecha_vencimiento DATE -- Definimos la columna de tipo fecha donde almacenará la fecha de vencimiento de la tarjeta 
    
);

CREATE TABLE recordatorios ( -- Crear Tabla recordatorios
    recor_id INTEGER PRIMARY KEY, --Definimos la columna de tipo entero y la llave primaria
    recor_concepto VARCHAR(200), -- Definimos la columna como una cadena de caracteres donde almacenara el concepto o descripcion del recordatorio
    recor_fecha DATE -- Esta columna almacenara la fecha en el que el recordatorio estará programado
);






