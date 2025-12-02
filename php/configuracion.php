<!DOCTYPE HTML>

<html lang="es">
<head>
    <meta charset="UTF-8"/>
    <meta name="author" content="Olga Alonso Grela"/>
    <meta name="description" content="Configuración de las pruebas de usabilidad"/>
    <meta name="keywords" content=""/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link rel="stylesheet" href="estilo/estilo.css"/>
    <link rel="stylesheet" href="estilo/layout.css"/>
    <link rel="icon" href="multimedia/img/motogp.ico"/> <!-- HTML2: Ejercicio 3: favicon -->
    <title>MotoGP</title>
</head>

<body>
    <?php
    class Configuracion {
        private $mysqli;

        function __construct() {
            $this->mysqli = new mysqli("localhost", "DBUSER2025", "DBPSWD2025", "uo288066_DB");
            if ($this->mysqli->connect_errno) {
                echo "Error al conectar a la base de datos: " . $this->mysqli->connect_error;
                exit();
            }
        }

        /* Reiniciar datos sin borrar tablas */
        function reiniciarBD() {
            $tablas = ['observaciones', 'resultados', 'usuarios', 'dispositivos'];

            foreach ($tablas as $tabla) {
                $this->mysqli->query("DELETE FROM $tabla");
            }
        }

        /* Borrar toda la BD (tablas incluidas) */
        function eliminarBD() {
            $tablas = ['observaciones', 'resultados', 'usuarios', 'dispositivos'];

            foreach ($tablas as $tabla) {
                $this->mysqli->query("DROP TABLE IF EXISTS $tabla");
            }
        }

        /* Exportar datos a CSV */
        function exportarDatos() {
            $fichero = fopen("exportacion.csv", "w");

            // Exportar usuarios
            $resultado = $this->mysqli->query("SELECT * FROM usuarios");
            fputcsv($fichero, ["Tabla usuarios"]);
            while ($fila = $resultado->fetch_assoc()) {
                fputcsv($fichero, $fila);
            }

            // Exportar dispositivos
            $resultado = $this->mysqli->query("SELECT * FROM dispositivos");
            fputcsv($fichero, ["Tabla dispositivos"]);
            while ($fila = $resultado->fetch_assoc()) {
                fputcsv($fichero, $fila);
            }

            // Exportar resultados
            $resultado = $this->mysqli->query("SELECT * FROM resultados");
            fputcsv($fichero, ["Tabla resultados"]);
            while ($fila = $resultado->fetch_assoc()) {
                fputcsv($fichero, $fila);
            }

            // Exportar observaciones
            $resultado = $this->mysqli->query("SELECT * FROM observaciones");
            fputcsv($fichero, ["Tabla observaciones"]);
            while ($fila = $resultado->fetch_assoc()) {
                fputcsv($fichero, $fila);
            }

            fclose($fichero);
        }
    }
    ?>
    
</body>

</html>