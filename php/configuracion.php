<!DOCTYPE HTML>

<html lang="es">
<head>
    <meta charset="UTF-8"/>
    <meta name="author" content="Olga Alonso Grela"/>
    <meta name="description" content="Configuración de las pruebas de usabilidad"/>
    <meta name="keywords" content=""/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link rel="stylesheet" href="../estilo/estilo.css"/>
    <link rel="stylesheet" href="../estilo/layout.css"/>
    <link rel="icon" href="multimedia/img/motogp.ico"/> <!-- HTML2: Ejercicio 3: favicon -->
    <title>MotoGP</title>
</head>

<body>
    <?php
    class Configuracion {
        private $mysqli;
        private const SCRIPT = "uo288066_DB.sql";

        function __construct() {
            $this->mysqli = new mysqli("localhost", "DBUSER2025", "DBPSWD2025", "uo288066_DB");
            if ($this->mysqli->connect_errno) {
                echo "<p>Error al conectar a la base de datos: " . $this->mysqli->connect_error . "</p>";
                exit();
            }
        }

        /* Runnear el script */
        function initBD() {
            if (!$this->mysqli || $this->mysqli->connect_errno) {
                return "<p>Error: conexión no disponible</p>";
            }

            $this->eliminarBD();

            if (!file_exists(self::SCRIPT)) {
                return "<p>Error: no se encontró el archivo " . self::SCRIPT . "</p>";
            }

            $sql = file_get_contents(self::SCRIPT);
            if ($sql === false) {
                return "<p>Error leyendo el archivo " . self::SCRIPT . "</p>";
            }

            // Ejecutar todas las consultas separadas por ';'
            $queries = array_filter(array_map('trim', explode(';', $sql)));
            foreach ($queries as $query) {
                if (!empty($query) && !$this->mysqli->query($query)) {
                    return "<p>Error ejecutando consulta: " . $this->mysqli->error . "</p>";
                }
            }

            return "<p>Base de datos inicializada correctamente usando " . self::SCRIPT . ".</p>";
        }

        /* Reiniciar BD (borrar contenido de las tablas) */
        function reiniciarBD() {
            if (!$this->mysqli || $this->mysqli->connect_errno) {
                return "<p>Error: conexión no disponible</p>";
            }

            $resultado = $this->mysqli->query("SHOW TABLES");
            if (!$resultado || $resultado->num_rows === 0) {
                return "<p>No hay tablas en la base de datos para reiniciar.</p>";
            }

            $tablas = ['observaciones', 'resultados', 'usuarios'];

            foreach ($tablas as $tabla) {
                $stmt = $this->mysqli->prepare("DELETE FROM $tabla");
                if (!$stmt || !$stmt->execute()) {
                    return "<p>Error eliminando datos de $tabla: " . $this->mysqli->error . "</p>";
                }
                $stmt->close();
            }

            return "<p>Base de datos reiniciada correctamente.</p>";
        }

        /* Borrar toda la BD (tablas incluidas) */
        function eliminarBD() {
            if (!$this->mysqli || $this->mysqli->connect_errno) {
                return "<p>Error: conexión no disponible</p>";
            }

            $tablas = ['observaciones', 'resultados', 'usuarios', 'dispositivos'];

            foreach ($tablas as $tabla) {
                $stmt = $this->mysqli->prepare("DROP TABLE IF EXISTS $tabla");
                if (!$stmt || !$stmt->execute()) {
                    return "<p>Error eliminando tabla $tabla: " . $this->mysqli->error . "</p>";
                }
                $stmt->close();
            }

            return "<p>Base de datos eliminada correctamente.</p>";
        }

        /* Exportar datos a CSV */
        function exportarCSV() {
            if (!$this->mysqli || $this->mysqli->connect_errno) {
                return "<p>Error: conexión no disponible</p>";
            }

            $resultado = $this->mysqli->query("SHOW TABLES");
            if (!$resultado || $resultado->num_rows === 0) {
                return "<p>No hay tablas en la base de datos para reiniciar.</p>";
            }
        
            $fichero = fopen("uo288066_db.csv", "w");
            if (!$fichero) {
                return "<p>Error creando el archivo CSV.</p>";
            }
        
            // 1. Dispositivos
            fputcsv($fichero, ["id_dispositivo","nombre_dispositivo"]);
            $resultado = $this->mysqli->query("SELECT id_dispositivo, nombre_dispositivo FROM Dispositivos");
            while ($fila = $resultado->fetch_assoc()) {
                fputcsv($fichero, $fila);
            }
        
            // 2. Observaciones
            fputcsv($fichero, ["id_observacion","id_resultado","comentarios_facilitador"]);
            $resultado = $this->mysqli->query("SELECT id_observacion, id_resultado, comentarios_facilitador FROM Observaciones");
            while ($fila = $resultado->fetch_assoc()) {
                fputcsv($fichero, $fila);
            }
        
            // 3. Resultados
            fputcsv($fichero, ["id_resultado","id_usuario","id_dispositivo","tiempo_completado","tarea_completada","comentarios_usuario","propuestas_mejora","valoracion"]);
            $resultado = $this->mysqli->query("SELECT id_resultado, id_usuario, id_dispositivo, tiempo_completado, tarea_completada, comentarios_usuario, propuestas_mejora, valoracion FROM Resultados");
            while ($fila = $resultado->fetch_assoc()) {
                fputcsv($fichero, $fila);
            }
        
            // 4. Usuarios
            fputcsv($fichero, ["id_usuario","profesion","edad","genero","pericia_informatica"]);
            $resultado = $this->mysqli->query("SELECT id_usuario, profesion, edad, genero, pericia_informatica FROM Usuarios");
            while ($fila = $resultado->fetch_assoc()) {
                fputcsv($fichero, $fila);
            }
        
            fclose($fichero);
        
            return "<p>Datos exportados correctamente a uo288066_db.csv.</p>";
        }
    }
    ?>

    <header>
        <h1><a href="index.html">MotoGP Desktop</a></h1>
    </header>

    <main>
        <h2>Configuración de la base de datos</h2>

        <?php
        $config = new Configuracion();
        $msg = "";

        if (isset($_POST["init"])) {
            $msg .= $config->initBD();
        }

        if (isset($_POST["reset"])) {
            $msg .= $config->reiniciarBD();
        }
        
        if (isset($_POST["borrar"])) {
            $msg .= $config->eliminarBD();
        }
        
        if (isset($_POST["exportar"])) {
            $msg .= $config->exportarCSV();
        }

        echo "
            <h3>Pulse un botón</h3>
            <form action='#' method='post' name='botones'>
                <input type='submit' name='init' value='init'/>
                <input type='submit' name='reset' value='reset'/>
                <input type='submit' name='borrar' value='borrar'/>
                <input type='submit' name='exportar' value='exportar'/>
            </form>
        ";

        echo $msg;
        ?>
    </main>
    
</body>

</html>