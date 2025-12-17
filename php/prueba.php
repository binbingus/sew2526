<?php
    class Prueba {
        public $crono;
        private $mysqli;

        public $idp;

        function __construct() {
            $this->mysqli = new mysqli("localhost", "DBUSER2025", "DBPSWD2025", "uo288066_DB");
            if ($this->mysqli->connect_errno) {
                die("Error al conectar a la base de datos: " . $this->mysqli->connect_error);
            }

            if (!isset($_SESSION)) session_start();
            if (!isset($_SESSION['crono_prueba'])) {
                $_SESSION['crono_prueba'] = new Cronometro();
            }
            $this->crono = $_SESSION['crono_prueba'];
        }

        /* Iniciar prueba: Inicia el crono y marca que la prueba ha empezado */
        function iniciarPrueba($edad, $genero, $profesion) {
            $this->crono->arrancar();

            $stmt = $this->mysqli->prepare(
                "INSERT INTO Usuarios (profesion, edad, genero)
                VALUES (?, ?, ?)"
            );
            $stmt->bind_param("sis", $profesion, $edad, $genero);
            $stmt->execute();

            $idu = $this->mysqli->insert_id;

            $stmt->close();

            return $idu;
        }

        /* Terminar prueba: detiene cronómetro y guarda respuestas + tiempo */
        public function terminarPrueba($idu, $idd, $tiempo, $valoracion) {
            $this->crono->parar();
            $tiempo = $this->crono->getTiempoSegundos();

            // Guardar respuestas en BD
            $stmt = $this->mysqli->prepare(
                "INSERT INTO Prueba 
                (id_usuario, id_dispositivo, tiempo, valoracion)
                VALUES (?, ?, ?, ?)" // dispositivo, tiempo y valoracion
            );
            $stmt->bind_param( "iidd", $idu, $idd, $tiempo, $valoracion );
            $stmt->execute();

            $idp = $this->mysqli->insert_id;

            $stmt->close();

            return $idp;
        }

        public function guardarRespuestas($idp, $preguntas, $respuesstas) {
            foreach ($preguntas as $index => $pregunta) {
                $respuesta = $respuesstas[$index] ?? '';

                $stmt1 = $this->mysqli->prepare(
                    "INSERT INTO Respuesta (id_prueba, pregunta, respuesta)
                    VALUES (?, ?, ?)" // prueba, pregunta, respuesta
                );
                $stmt1->bind_param("iss", $idp, $pregunta, $respuesta);
                $stmt1->execute();
                $stmt1->close();
            }
        }

        public function guardarComentarios($idp, $comentarios) {
            if ($comentarios) {
                $stmt2 = $this->mysqli->prepare(
                    "INSERT INTO Observaciones (id_prueba, comentarios)
                    VALUES (?, ?)" // prueba, comentarios
                );
                $stmt2->bind_param("is", $idp, $comentarios);
                $stmt2->execute();
                $stmt2->close();

            }

            $_SESSION['guardar_comentarios'] = false;
            session_destroy();
        }
    }
    ?>

<!DOCTYPE HTML>

<html lang="es">
<head>
    <meta charset="UTF-8"/>
    <meta name="author" content="Olga Alonso Grela"/>
    <meta name="description" content="Formulario de pruebas de usabilidad"/>
    <meta name="keywords" content=""/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link rel="stylesheet" href="../estilo/estilo.css"/>
    <link rel="stylesheet" href="../estilo/layout.css"/>
    <link rel="icon" href="../multimedia/img/motogp.ico"/> <!-- HTML2: Ejercicio 3: favicon -->
    <title>MotoGP</title>
</head>

<body>
    <header>
        <h1><a href="../index.html">MotoGP Desktop</a></h1>
    </header>

    <main>
        <h2>Prueba de usabilidad</h2>

        <?php
        $preguntas = [
                "¿Cuánto pesa el piloto?",
                "¿Cuántos puntos ha conseguido el piloto?",
                "¿Qué es un paddock?",
                "¿Va a llover en los días previos a la carrera?",
                "¿Cuánto tiempo hizo el ganador de la carrera?",
                "¿Está el ganador de la carrera entre los tres primeros en la clasificación mundial?",
                "Busca una noticia sobre Moto GP y escribe su titular.",
                "¿En qué localidad se encuentra el circuito?",
                "¿Cuántos habitantes tiene dicha localidad?",
                "Escribe alguna de las marcas que aparecen en el juego de memoria."
            ];  

        define('CRONO_SILENT', true);
        require_once("../cronometro.php");

        $prueba = new Prueba();
        $prueba->crono = $_SESSION['crono_prueba'] ?? new Cronometro();

        if (!isset($_SESSION['estado_prueba'])) {
            $_SESSION['estado_prueba'] = 'inicio';
        }

        // Iniciar prueba
        if (isset($_POST['iniciar_prueba'])) {
            $edad = $_POST['edad'];
            $genero = $_POST['genero'];
            $profesion = $_POST['profesion'];

            $dispositivo = $_POST['dispositivo'];
            $_SESSION['dispositivo'] = $dispositivo;    

            $idu = $prueba->iniciarPrueba($edad, $genero, $profesion);
            $_SESSION['idu'] = $idu;

            $_SESSION['estado_prueba'] = 'ejecucion';
        }

        // Terminar prueba
        if (isset($_POST['terminar_prueba'])) {
            $tiempo = $crono->getTiempoSegundos(); 

            $idu = $_SESSION['idu'];
            $dispositivo = $_SESSION['dispositivo'] ?? 1;
            $valoracion = $_POST['valoracion'];

            $idp = $prueba->terminarPrueba($idu, $dispositivo, $tiempo, $valoracion);
            $_SESSION['idp'] = $idp;

            $respuestas = [];
            foreach ($preguntas as $index => $texto) {
                $nombre = 'pregunta'.($index+1);
                $respuestas[$index] = $_POST[$nombre] ?? '';
            }
            $prueba->guardarRespuestas($idp, $preguntas, $respuestas);

            $_SESSION['idp'] = $idp;
            $_SESSION['estado_prueba'] = 'comentarios';
        }

        // Guardar comentarios despues de la prueba
        if (isset($_POST['guardar_comentarios'])) {
            $comentarios = isset($_POST['comentario']) ? trim($_POST['comentario']) : '';

            $idp = $_SESSION['idp'];
            $prueba->guardarComentarios($idp, $_POST['comentario']);

            $_SESSION = [];
            $_SESSION['estado_prueba'] = 'inicio';
        }
        ?>

        <?php if ($_SESSION['estado_prueba'] == 'inicio'): ?>
            <!-- Formulario inicial para iniciar prueba -->
            <form method="post" autocomplete="off">
                <label>
                    Edad: 
                    <input type="number" name="edad" required/>
                </label>

                <fieldset>
                    <legend>Género</legend>

                    <label>
                        Femenino
                        <input type="radio" name="genero" value="Femenino" required>
                    </label>

                    <label>
                        Masculino
                        <input type="radio" name="genero" value="Masculino">
                    </label>

                    <label>
                        Otro
                        <input type="radio" name="genero" value="Otro">
                    </label>
                </fieldset>

                <label>
                    Profesión: 
                    <input type="text" name="profesion" required/>
                </label>

                <label>Dispositivo:</label>
                <fieldset>
                    <legend>Dispositivo</legend>

                    <label>
                        Ordenador
                        <input type="radio" name="dispositivo" value="1" required>
                    </label>

                    <label>
                        Tablet
                        <input type="radio" name="dispositivo" value="2">
                    </label>

                    <label>
                        Móvil
                        <input type="radio" name="dispositivo" value="3">
                    </label>
                </fieldset>

                <input type="submit" name="iniciar_prueba" value="Iniciar Prueba"/>
            </form>

        <?php elseif ($_SESSION['estado_prueba'] == 'ejecucion'): ?>
            <form method="post" autocomplete="off">
                <?php foreach($preguntas as $index => $texto): ?>
                    <label for="pregunta<?= $index+1 ?>"><?= $texto ?></label>
                    <input type="text" name="pregunta<?= $index+1 ?>" required/>
                <?php endforeach; ?>

                <label>
                    Valoración del Sitio Web (0-10): 
                    <input type="number" name="valoracion" min="0" max="10" required/>
                </label>

                <input type="submit" name="terminar_prueba" value="Terminar Prueba"/>
            </form>

        <?php elseif ($_SESSION['estado_prueba'] == 'comentarios'): ?>
            <!-- Formulario para comentarios después de terminar la prueba -->
            <form method="post" autocomplete="off">
                <label>
                    Comentarios adicionales: 
                    <textarea name="comentario" rows="5" cols="50" required></textarea>
                </label>
                <input type="submit" name="guardar_comentarios" value="Guardar Comentarios"/>
            </form>
        <?php endif; ?>
        
    </main>

</body>
</html>