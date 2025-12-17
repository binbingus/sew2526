<!DOCTYPE HTML>
<?php
    session_start();

    class Cronometro {
        private $tiempo;
        private $inicio;
    
        public function __construct() {
            $this->tiempo = 0;
        }

        public function arrancar() {
            $this->tiempo = 0;
            $this->inicio = microtime(true);
        }

        public function parar() {
            $fin = microtime(true);
            $this->tiempo = $fin - $this->inicio;
        }

        public function mostrar() {
            $now = microtime(true);
            $this->tiempo = $now - $this->inicio;

            $min = floor($this->tiempo / 60);
            $seg = $this->tiempo - ($min * 60);
            $formateado = sprintf("%02d:%04.1f", $min, $seg);

            return $formateado;
        }

        public function getTiempoSegundos() {
            $min = floor($this->tiempo / 60);
            return $this->tiempo - ($min * 60);
        }
    }

    // Crear o recuperar cronómetro de sesión
    if (!isset($_SESSION['crono'])) {
        $_SESSION['crono'] = new Cronometro();
    }
    $crono = $_SESSION['crono'];

    // Detectar si se quiere mostrar la interfaz
    if (defined('CRONO_SILENT') && CRONO_SILENT === true) {
        return; // No mostrar nada, solo usar la clase
    }

    // --- Desde aquí es la interfaz para usar cronometro.php como página independiente ---
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if(isset($_POST['arrancar'])) $crono->arrancar();
        if(isset($_POST['parar'])) $crono->parar();
    }
    ?>



<html lang="es">
<head>
    <meta charset="UTF-8"/>
    <meta name="author" content="Olga Alonso Grela"/>
    <meta name="description" content="Cronómetro"/>
    <meta name="keywords" content="cronometro, juegos"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link rel="stylesheet" href="estilo/estilo.css"/>
    <link rel="stylesheet" href="estilo/layout.css"/>
    <link rel="icon" href="multimedia/img/motogp.ico"/> <!-- HTML2: Ejercicio 3: favicon -->
    <script src="js/menuMoviles.js"></script>
    <title>MotoGP-Juegos-Cronómetro</title>
</head>

<body>
    <header>
        <h1><a href="index.html">MotoGP Desktop</a></h1>

        <!-- Botón hamburguesa -->
        <button>&#9776;</button>

        <nav>
            <a href="index.html" title="Página de inicio">Inicio</a>
            <a href="piloto.html" title="Información del piloto">Piloto</a>
            <a href="circuito.html" title="Información del circuito">Circuito</a>
            <a href="meteorologia.html" title="Información de la meteorología en la próxima semana">Meteorologia</a>
            <a href="clasificaciones.php" title="Ganador de la carrera y clasificación mundial">Clasificaciones</a>
            <a href="juegos.html" title="Página de juegos" class="active">Juegos</a>
            <a href="ayuda.html" title="Información de ayuda sobre la página">Ayuda</a>
        </nav>
    </header>

    <p>Estás en: <a href="index.html">Inicio</a> | <a href="juegos.html">Juegos</a> | <strong>Cronómetro PHP</strong></p>

    <main>
        <h2>Cronómetro</h2>
        <?php
        echo "<p>Tiempo: " . $crono->mostrar() . "</p>";
        ?>
        
        <form action='#' method='post' name='botones'>
            <input type='submit' name='arrancar' value='arrancar'/>
            <input type='submit' name='parar' value='parar'/>
            <input type='submit' name='mostrar' value='mostrar'/>
        </form>
        
    </main>
</body>

