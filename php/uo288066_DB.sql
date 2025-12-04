CREATE TABLE Usuarios (
    id_usuario            INT PRIMARY KEY AUTO_INCREMENT,
    profesion             VARCHAR(100) NOT NULL,
    edad                  INT NOT NULL,
    genero                VARCHAR(20) NOT NULL
);

CREATE TABLE Dispositivos (
    id_dispositivo     INT PRIMARY KEY,
    nombre_dispositivo VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO Dispositivos VALUES
(1, 'ordenador'),
(2, 'tableta'),
(3, 'telefono');

CREATE TABLE Prueba (
    id_prueba           INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario          INT NOT NULL,
    id_dispositivo      INT NOT NULL,
    tiempo              INT NOT NULL,     
    valoracion          INT CHECK (valoracion BETWEEN 0 AND 10),

    FOREIGN KEY (id_usuario)     REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_dispositivo) REFERENCES Dispositivos(id_dispositivo)
);

CREATE TABLE Observaciones (
    id_observacion          INT PRIMARY KEY AUTO_INCREMENT,
    id_prueba               INT NOT NULL,
    comentarios             TEXT NOT NULL,

    FOREIGN KEY (id_prueba) REFERENCES Prueba(id_prueba)
);

CREATE TABLE Respuesta (
    id_respuesta INT PRIMARY KEY AUTO_INCREMENT,
    id_prueba    INT NOT NULL,
    pregunta     TEXT NOT NULL,
    respuesta    TEXT NOT NULL,
    FOREIGN KEY (id_prueba) REFERENCES Prueba(id_prueba) ON DELETE CASCADE
);
