<!DOCTYPE HTML>

<html lang="es">
<head>
    <meta charset="UTF-8"/>
    <meta name="author" content="Olga Alonso Grela"/>
    <meta name="description" content="página de las clasificaciones"/>
    <meta name="keywords" content="Clasificaciones, MotoGP, piloto, Raúl Fernández, resultados, estadísticas"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link rel="stylesheet" href="estilo/estilo.css"/>
    <link rel="stylesheet" href="estilo/layout.css"/>
    <link rel="icon" href="multimedia/img/motogp.ico"/> <!-- HTML2: Ejercicio 3: favicon -->
    <script src="js/menuMoviles.js"></script>
    <title>MotoGP-Clasificaciones</title>
</head>

<body>
    <?php
        class Clasificacion {
            private $documento;
            public $ganador;
            public $tiempoGanador;
            public $tresPrimeros;

            public function __construct() {
                $this->documento = "xml/circuitoEsquema.xml";
                $this->ganador = "Sin definir";
                $this->tiempoGanador = "00:00:00";
                $this->tresPrimeros = [];
            }

            public function consultar() {
                $this->tresPrimeros = [];

                $datos = file_get_contents($this->documento);
                if ($datos == null) {
                    echo "<h3>Error en el archivo XML recibido";
                }

                $xml = new SimpleXMLElement($datos);

                // Nombre ganador de la carrera y su tiempo
                $this->ganador = (string)$xml->vencedor->piloto;
                $tiempo = (string)$xml->vencedor->tiempo; // PT0H40M52S

                preg_match('/PT(\d+)H(\d+)M(\d+)S/', $tiempo, $matches);
                $horas = (int)$matches[1];
                $minutos = (int)$matches[2];
                $segundos = (int)$matches[3];

                // Convertimos todo a segundos
                $totalSegundos = $horas * 3600 + $minutos * 60 + $segundos;

                // Formateamos a mm:ss.s
                $min = floor($totalSegundos / 60);
                $seg = $totalSegundos % 60;
                $this->tiempoGanador = sprintf("%02d:%04.1f", $min, $seg);

                // Nombres tres primeros clasificados
                foreach ($xml->clasificacionMundial->piloto as $piloto) {
                    $this->tresPrimeros[] = (string)$piloto;         
                }
            }
        }
    ?>

    <!-- HTML2: Ejercicio 7: elemento header: elementos comunes a todos los documentos -->
    <header>
        <!-- HTML2 : ejercicio 8: h1 es un enlace a la página principal -->
        <h1><a href="index.html">MotoGP Desktop</a></h1>

        <!-- Botón hamburguesa -->
        <button>&#9776;</button>

        <nav>
            <a href="index.html" title="Página de inicio">Inicio</a>
            <a href="piloto.html" title="Información del piloto">Piloto</a>
            <a href="circuito.html" title="Información del circuito">Circuito</a>
            <a href="meteorologia.html" title="Información de la meteorología en la próxima semana">Meteorologia</a>
            <a href="clasificaciones.php" title="Ganador de la carrera y clasificación mundial" class="active">Clasificaciones</a>
            <a href="juegos.html" title="Página de juegos">Juegos</a>
            <a href="ayuda.html" title="Información de ayuda sobre la página">Ayuda</a>
        </nav>
    </header>

    <!-- HTML2: ejercicio 8: migas -->
    <p>Estás en: <a href="index.html">Inicio</a> | <strong>Clasificaciones</strong></p>

    <main>
        <h2>Clasificación</h2>

        <?php
            session_start();

            if (!isset($_SESSION['clasificacion'])) {
                $_SESSION['clasificacion'] = new Clasificacion();
            }
            $clasificacion = $_SESSION['clasificacion'];

            $clasificacion->consultar();

            echo "
                <ul>
                    <li>Ganador: {$clasificacion->ganador} </li>
                    <li>Tiempo: {$clasificacion->tiempoGanador}</li>
                </ul>
            ";

            echo "
                <h3>Clasificación Mundial</h3>
                <ol>
                    <li>{$clasificacion->tresPrimeros[0]}</li>
                    <li>{$clasificacion->tresPrimeros[1]}</li>
                    <li>{$clasificacion->tresPrimeros[2]}</li>
                </ol>
            ";
        ?>
    </main>

    
</body>
</html>
