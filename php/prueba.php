<?php
    class Prueba {
        private $crono;
        private $mysqli;

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
        function iniciarPrueba() {
            $this->crono->arrancar();
            $_SESSION['prueba_iniciada'] = true;
        }

        public function pruebaIniciada() {
            return isset($_SESSION['prueba_iniciada']) && $_SESSION['prueba_iniciada'] === true;
        }

        /* Terminar prueba: detiene cronómetro y guarda respuestas + tiempo */
        public function terminarPrueba() {
            $this->crono->parar();
            $tiempo = $this->crono->getTiempoSegundos();

            // Guardar respuestas en BD
            $stmt = $this->mysqli->prepare(
                "INSERT INTO Prueba 
                (id_prueba, id_usuario, id_dispositivo, tiempo, valoracion)
                VALUES (?, ?, ?)" // dispositivo, tiempo y valoracion
            );
            $stmt->bind_param(
                "iidi", 
                $usuarioId, 
                $dispositivoId, 
                $tiempo, 
                $respuestas['valoracion']
            );
            $stmt->execute();
            $resultadoId = $stmt->insert_id;
            $stmt->close();

            // Guardar comentarios del observador si existen
            if ($comentariosFacilitador) {
                $stmt2 = $this->mysqli->prepare(
                    "INSERT INTO Observaciones (id_observacion, id_resultado, comentarios)
                    VALUES (?)" // comentarios
                );
                $stmt2->bind_param("is", $resultadoId, $comentariosFacilitador);
                $stmt2->execute();
                $stmt2->close();
            }

            $_SESSION['prueba_iniciada'] = false;
            return $resultadoId;
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
        define('CRONO_SILENT', true);
        require_once("../cronometro.php");

        $prueba = new Prueba();
        $crono = $_SESSION['crono_prueba'] ?? new Cronometro();

        // Arrancar cronómetro (por ejemplo al iniciar la prueba)
        if (isset($_POST['iniciar_prueba'])) {
            $prueba->iniciarPrueba();
            $_SESSION['prueba_iniciada'] = true;
        }

        // Parar cronómetro y guardar tiempo (por ejemplo al terminar la prueba)
        if (isset($_POST['terminar_prueba'])) {
            $prueba->terminarPrueba();
            $tiempo = $crono->getTiempoSegundos(); 
            $_SESSION['mostrar_comentarios'] = true;
            $_SESSION['prueba_iniciada'] = false;
        }

        if (isset($_POST['guardar_comentarios'])) {
            $comentarios = isset($_POST['comentario_facilitador']) ? trim($_POST['comentario_facilitador']) : '';
            $respuestas = $_SESSION['respuestas_guardadas'] ?? []; // Si guardaste respuestas antes
            $usuarioId = 1;
            $dispositivoId = 1;
            $prueba->terminarPrueba($usuarioId, $dispositivoId, $respuestas, $comentarios);

            // Limpiar sesión
            unset($_SESSION['mostrar_comentarios'], $_SESSION['respuestas_guardadas']);
            echo "<p>Comentarios guardados correctamente.</p>";
        }
        ?>

        <?php if (!$_SESSION['prueba_iniciada'] && empty($_SESSION['mostrar_comentarios'])): ?>
            <!-- Formulario inicial para iniciar prueba -->
            <form method="post">
                <label for="edad">Edad:</label>
                <input type="number" name="edad" required/><br/>
                <label>Género:</label>
                <input type="radio" name="genero" value="Femenino" required/> Femenino
                <input type="radio" name="genero" value="Masculino" required/> Masculino
                <input type="radio" name="genero" value="Otro" required/> Otro<br/>
                <label for="profesion">Profesión:</label>
                <input type="text" name="profesion" required/><br/>
                <input type="submit" name="iniciar_prueba" value="Iniciar Prueba"/>
            </form>

        <?php elseif ($_SESSION['prueba_iniciada']): ?>
            <!-- Formulario de la prueba -->
            <?php
            $preguntas = [
                "¿Qué te parece la navegación del sitio web?",
                "¿Cómo valoras la velocidad de carga?",
                "¿El diseño es atractivo visualmente?",
                "¿La información es fácil de encontrar?",
                "¿El contenido es claro y comprensible?",
                "¿Te resulta intuitivo el menú de navegación?",
                "¿Qué mejorarías en la interfaz?",
                "¿Cómo valoras la interacción con formularios?",
                "¿El sitio web es accesible en tu dispositivo?",
                "¿Recomendarías este sitio web a otros?"
            ];
            ?>
            <form method="post">
                <?php foreach($preguntas as $index => $texto): ?>
                    <label for="pregunta<?= $index+1 ?>"><?= $texto ?></label>
                    <input type="text" name="pregunta<?= $index+1 ?>" required/><br/>
                <?php endforeach; ?>

                <label for="valoracion">Valoración del Sitio Web (0-10):</label>
                <input type="number" name="valoracion" min="0" max="10" required/><br/>
                <input type="submit" name="terminar_prueba" value="Terminar Prueba"/>
            </form>

        <?php elseif ($_SESSION['mostrar_comentarios']): ?>
            <!-- Formulario para comentarios después de terminar la prueba -->
            <form method="post">
                <label for="comentario_usuario">Comentarios adicionales:</label><br/>
                <textarea name="comentario_usuario" rows="5" cols="50" required></textarea><br/>
                <input type="submit" name="guardar_comentarios" value="Guardar Comentarios"/>
            </form>
        <?php endif; ?>

    </main>

</body>
</html>