class Circuito {
    constructor() {
        this.#comprobarApiFile();
    }

    #comprobarApiFile() {
        // Comprobar si el navegador soporta el uso de la API File
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            //  Si no la soporta -> mostramos mensaje en circuito.html
            document.body.appendChild(document.createElement("p"))
                .innerText = "Este navegador NO soporta la API File. Algunas funciones pueden no estar disponibles.";
        }
    }

    leerArchivoHTML() {
        // 
    }
}