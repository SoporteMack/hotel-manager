create database hotel_manager;
use hotel_manager
CREATE TABLE  personas(
    idPersona INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombrePersona VARCHAR(50) NOT NULL,
    apellidoPaterno VARCHAR(50)NOT NULL,
    apellidoMaterno VARCHAR(50) NOT NULL,
    telefono INT(10) NOT NULL,
    correo VARCHAR(100),
    estatus BOOLEAN NOT NULL
);
CREATE TABLE departamentos(
    numDepartamento INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    descripcion VARCHAR(20) NOT NULL,
    costo FLOAT(8,3) NOT NULL,
    estatus BOOLEAN NOT NULL
);


CREATE TABLE contratos(
    idContrato INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idPersona INT NOT NULL,
    numDepartamento INT NOT NULL,
    estatus BOOLEAN NOT NULl,
    fechaInicio DATE NOT NULL,
    fechaTermino Date NOT NULL,
    INED VARCHAR(255) NOT NULL,
    INEA VARCHAR(255) NOT NULL,
    comprobanteDeDocmicilio VARCHAR(255) NOT NULl,
    tarjetaD varchar(255) ,
    tarjetaA varchar(255),
    docContrato VARCHAR(255) NOT NULL,
    FOREIGN KEY (idPersona) REFERENCES personas(idPersona),
    FOREIGN KEY (numDepartamento) REFERENCES departamentos(numDepartamento)
);

CREATE TABLE pagos(
    folio INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    numPago INT NOT NULl,
    monto FLOAT(8,3) NOT NULL,
    fechaPago DATE NOT NULl,
    idContrato INT NOT NULL,
    FOREIGN KEY (idContrato) REFERENCES contratos(idContrato)
);

CREATE TABLE usuarios(
    usuario VARCHAR(50) NOT NULL PRIMARY KEY,
    password  VARCHAR(60) NOT NULL
);

alter table contratos add  INED VARCHAR(255) NOT NULL after fechaTermino;
alter table contratos add  INEA VARCHAR(255) NOT NULL after INED;
alter table contratos add  comprobanteDeDocmicilio VARCHAR(255) NOT NULL after INE;
alter table contratos add  tarjetaD VARCHAR(255) NOT NULL after comprobanteDeDocmicilio;
alter table contratos add  tarjetaA VARCHAR(255) NOT NULL after tarjetaD;


alter table contratos change column comprobanteDeDocmicilio comprobanteDeDomicilio varchar(255);
alter table contratos change column INE INED VARCHAR(255);
alter table contratos change column tarjeta tarjetaD VARCHAR(255)
ALTER TABLE pagos MODIFY fechaPago DATETIME NOT NULL;
