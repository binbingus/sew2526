CREATE TABLE Usuarios (
    id_usuario            INT PRIMARY KEY,
    profesion             VARCHAR(100) NOT NULL,
    edad                  INT NOT NULL,
    genero                VARCHAR(20) NOT NULL,
    pericia_informatica   VARCHAR(50) NOT NULL
);

CREATE TABLE Dispositivos (
    id_dispositivo     INT PRIMARY KEY,
    nombre_dispositivo VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO Dispositivos VALUES
(1, 'ordenador'),
(2, 'tableta'),
(3, 'telefono');

CREATE TABLE Resultados (
    id_resultado        INT PRIMARY KEY,
    id_usuario          INT NOT NULL,
    id_dispositivo      INT NOT NULL,
    tiempo_completado   INT NOT NULL,        
    tarea_completada    BOOLEAN NOT NULL,
    comentarios_usuario TEXT,
    propuestas_mejora   TEXT,
    valoracion          INT CHECK (valoracion BETWEEN 0 AND 10),

    FOREIGN KEY (id_usuario)     REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_dispositivo) REFERENCES Dispositivos(id_dispositivo)
);

CREATE TABLE Observaciones (
    id_observacion          INT PRIMARY KEY,
    id_resultado            INT NOT NULL,
    comentarios_facilitador TEXT NOT NULL,

    FOREIGN KEY (id_resultado) REFERENCES Resultados(id_resultado)
);
