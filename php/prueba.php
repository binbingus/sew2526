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
    <link rel="icon" href="multimedia/img/motogp.ico"/> <!-- HTML2: Ejercicio 3: favicon -->
    <title>MotoGP</title>
</head>

<body>
    <?php
    session_start
    require_once("../cronometro.php");

    class Prueba {
        private $crono;
        private $mysqli;

        function __construct() {
            $this->mysqli = new mysqli("localhost", "DBUSER2025", "DBPSWD2025", "uo288066_DB");
            if ($this->mysqli->connect_errno) {
                echo "<p>Error al conectar a la base de datos: " . $this->mysqli->connect_error . "</p>";
                exit();
            }

            $this->init();
        }

        /* Resetear cosas */
        function init() {
            if (!isset($_SESSION)) session_start();
            $_SESSION['inicio_prueba'] = null;
        }

        /* Iniciar prueba: inciar crono */
        function iniciarPrueba() {

        }

        /* Terminar prueba: guardar resouestas en BD, guardar tiempo total, dar la opcion de añadir comentarios */
        function terminarPrueba() {
            // todas las preguntas deben estar respondidas
        }
    }
    ?>

    <header>
        <h1>MotoGP Desktop</h1>
    </header>

    <main>
        <h2>Prueba de usabilidad</h2>

        <?php
        $errores = [];
        $respuestas = [];

        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $campos = [
                "edad", "genero", "profesion", "valoracion",
                "pregunta5", "pregunta6", "pregunta7", "pregunta8",
                "pregunta9", "pregunta10"
            ];

            foreach ($campos as $campo) {
                if (empty($_POST[$campo])) {
                    $errores[] = "Debes responder el campo $campo.";
                } else {
                    $respuestas[$campo] = trim($_POST[$campo]);
                }
            }

            if (empty($errores)) {
                echo "<p>¡Formulario completado correctamente! Tus respuestas:</p><ul>";
                foreach ($respuestas as $campo => $valor) {
                    echo "<li><strong>$campo:</strong> " . htmlspecialchars($valor) . "</li>";
                }
                echo "</ul>";
                // Aquí se pueden guardar las respuestas en la base de datos
            } else {
                echo "<ul style='color:red;'>";
                foreach ($errores as $error) {
                    echo "<li>$error</li>";
                }
                echo "</ul>";
            }
        }
        ?>

            <form action="#" method="post">
                <label for="edad">Edad:</label>
                <input type="number" name="edad" id="edad" min="1" max="120"
                    value="<?= isset($respuestas['edad']) ? htmlspecialchars($respuestas['edad']) : "" ?>" required/>
                
                
                <label>Género:</label><br/>
                <input type="radio" name="genero" value="Femenino" <?= (isset($respuestas['genero']) && $respuestas['genero']=="Femenino") ? "checked" : "" ?> required/> Femenino
                <input type="radio" name="genero" value="Masculino" <?= (isset($respuestas['genero']) && $respuestas['genero']=="Masculino") ? "checked" : "" ?> required/> Masculino
                <input type="radio" name="genero" value="Otro" <?= (isset($respuestas['genero']) && $respuestas['genero']=="Otro") ? "checked" : "" ?> required/> Otro
                
                
                <label for="profesion">Profesión:</label>
                <input type="text" name="profesion" id="profesion"
                    value="<?= isset($respuestas['profesion']) ? htmlspecialchars($respuestas['profesion']) : "" ?>" required/>
                
                
                <label for="valoracion">Valoración de la aplicación (0-10):</label>
                <input type="number" name="valoracion" id="valoracion" min="0" max="10"
                    value="<?= isset($respuestas['valoracion']) ? htmlspecialchars($respuestas['valoracion']) : "" ?>" required/>
                
            <?php
            for ($i = 5; $i <= 10; $i++) {
                $valor = isset($respuestas["pregunta$i"]) ? htmlspecialchars($respuestas["pregunta$i"]) : "";
                echo "
                    <label for='pregunta$i'>Pregunta $i:</label>
                    <input type='text' name='pregunta$i' id='pregunta$i' value='$valor' required/>
                    ";
            }
            ?>
            <input type="submit" value="Enviar respuestas"/>
        </form>
    </main>

</body>
</html>