class Circuito {
    constructor() {
        this.#comprobarApiFile();

        input.addEventListener("onchange", (evento) => {
            let archivo = evento.target.files[0];
            this.leerArchivoHTML(archivo);
        });
    }

    #comprobarApiFile() {
        // Comprobar si el navegador soporta el uso de la API File
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            //  Si no la soporta -> mostramos mensaje en circuito.html
            document.body.appendChild(document.createElement("p"))
                .innerText = "Este navegador NO soporta la API File. Algunas funciones pueden no estar disponibles.";
        }
    }

    leerArchivoHTML(archivo) {
        if (!archivo) {
            console.error("No se ha seleccionado ningún archivo");
            return;
        }

        let lector = new FileReader();

        lector.onload = function(evento) {
            let contenido = evento.target.result;
            console.log("Contenido cargado:", contenido);
        };

        lector.onerror = function() {
            console.error("Error al leer el archivo");
        };

        lector.readAsText(archivo, "UTF-8");
    }
}