class Circuito {
    constructor() {
        this.#comprobarApiFile();

        document.querySelector('input[type="file"]').addEventListener("change", (evento) => {
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
        if (!archivo) return;

        const lector = new FileReader();

        lector.onload = (evento) => {
            const contenido = evento.target.result;

            // Convertir texto HTML a documento DOM e insertar en el DOM principal
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
    
        // Recorrer todos los hijos directos del body
        docHTML.body.childNodes.forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                insertarNodo(child, document.body);
            }
        });
    }
    
}