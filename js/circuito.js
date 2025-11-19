class Circuito {
    constructor() {
        this.#comprobarApiFile();

        const inputFile = document.querySelector('input[accept=".html"]');
        if (!inputFile) return;

        inputFile.addEventListener("change", (evento) => {
            const archivo = evento.target.files[0];
            this.#leerArchivoHTML(archivo);
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

    #leerArchivoHTML(archivo) {
        if (!archivo) return;

        const lector = new FileReader();

        lector.onload = (evento) => {
            const contenido = evento.target.result;

            const parser = new DOMParser();
            const docHTML = parser.parseFromString(contenido, "text/html");

            this.#insertarDatosEnDOM(docHTML);
        };

        lector.readAsText(archivo, "UTF-8");
    }

    #insertarDatosEnDOM(docHTML) {
        const insertarNodo = (node, padre, dentroHeader = false) => {
            const tag = node.tagName?.toLowerCase();
            if (!tag) return;
    
            const esHeader = dentroHeader || tag === "header";
    
            // No copiamos header ni nav
            if (tag === "header" || tag === "nav") {
                node.childNodes.forEach(child => {
                    insertarNodo(child, padre, true); // marcar hijos como dentroHeader
                });
                return;
            }
    
            // Ignorar cualquier elemento dentro de header/nav
            if (esHeader) return;
    
            let clon;
            if (tag === "h1") {
                // Convertir h1 en h2, manteniendo hijos
                clon = document.createElement("h2");
                node.childNodes.forEach(child => {
                    clon.appendChild(child.cloneNode(true));
                });
            } else {
                clon = node.cloneNode(false); // clon superficial
                node.childNodes.forEach(child => {
                    if (child.nodeType === Node.ELEMENT_NODE) {
                        insertarNodo(child, clon, esHeader);
                    } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== "") {
                        clon.appendChild(document.createTextNode(child.textContent));
                    }
                });
            }
    
            padre.appendChild(clon);
        };
    
        const main = document.querySelector('main');

        // Recorrer todos los hijos directos del body
        docHTML.body.childNodes.forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                insertarNodo(child, main);
            }
        });
    }
}

class CargadorSVG {
    constructor() {
        const inputFile = document.querySelector('input[accept=".svg"]');
        if (!inputFile) return;

        inputFile.addEventListener("change", (evento) => {
            const archivo = evento.target.files[0];
            this.#leerArchivoSVG(archivo);
        });
    }

    #leerArchivoSVG(archivo) {
        if (!archivo) return;

        if (archivo.type !== "image/svg+xml") {
            alert("Por favor, seleccione un archivo SVG válido.");
            return;
        }

        const lector = new FileReader();

        lector.onload = (evento) => {
            const contenidoSVG = evento.target.result;
            this.#insertarSVG(contenidoSVG);
        };

        lector.readAsText(archivo, "UTF-8");
    }

    #insertarSVG(contenido) {
        const h2 = document.createElement("h2");
        h2.textContent = "Altimetría del circuito:";
    
        const blob = new Blob([contenido], { type: "image/svg+xml" });
        const urlSVG = URL.createObjectURL(blob);
    
        const img = document.createElement("img");
        img.src = urlSVG;
        img.alt = "Gráfico de altimetría del circuito";
    
        const main = document.querySelector('main');
        main.appendChild(h2);
        main.appendChild(img);
    }
    
}

class CargadorKML {
    constructor() {
        const inputFile = document.querySelector('input[accept=".kml"]');
        if (!inputFile) return;

        inputFile.addEventListener("change", (evento) => {
            const archivo = evento.target.files[0];
            this.#leerArchivoKML(archivo);
        });
    }

    #leerArchivoKML(archivo) {
        if (!archivo) return;

        if (archivo.type !== "application/vnd.google-earth.kml+xml" && !archivo.name.endsWith(".kml")) {
            alert("Por favor, seleccione un archivo KML válido.");
            return;
        }

        const lector = new FileReader();

        lector.onload = (evento) => {
            const contenidoKML = evento.target.result;
            this.#mostrarMapa(contenidoKML);
        };

        lector.readAsText(archivo, "UTF-8");
    }

    #mostrarMapa(kmlText) {
        const main = document.querySelector('main');
        // Crear Blob y URL temporal para el KML
        const blob = new Blob([kmlText], { type: "application/vnd.google-earth.kml+xml" });
        const urlKML = URL.createObjectURL(blob);

        // Inicializar mapa centrado en coordenadas por defecto
        const mapa = new google.maps.Map(document.getElementById("mapa"), {
            center: { lat: 37.1, lng: -8.5 }, // ejemplo: Algarve
            zoom: 10
        });

        // Añadir capa KML
        const kmlLayer = new google.maps.KmlLayer({
            url: urlKML,
            map: mapa
        });
    }
}