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
        const insertarNodo = (node, padre) => {
            const tag = node.tagName?.toLowerCase();
            if (!tag) return;
    
            let clon;
            clon = node.cloneNode(false); // clon superficial
            node.childNodes.forEach(child => {
                if (child.nodeType === Node.ELEMENT_NODE) {
                    insertarNodo(child, clon);
                } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== "") {
                    clon.appendChild(document.createTextNode(child.textContent));
                }
            });

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

    // Lee el archivo KML usando FileReader
    #leerArchivoKML(archivo) {
        if (!archivo) return;

        const lector = new FileReader();
        lector.onload = (evento) => {
            const contenido = evento.target.result;

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(contenido, "application/xml");

            // Extraer todos los LineString del KML
            const lineStrings = xmlDoc.getElementsByTagName("LineString");
            const tramos = [];

            for (let i = 0; i < lineStrings.length; i++) {
                const coordNode = lineStrings[i].getElementsByTagName("coordinates")[0];
                if (!coordNode) continue;

                const texto = coordNode.textContent.trim();
                const puntos = texto.split(/\s+/).map(coord => {
                    const [lng, lat, alt] = coord.split(",").map(Number);
                    return { lat, lng, alt };
                });
                tramos.push(puntos);
            }

            if (tramos.length === 0) return;

            this.insertarCapaKML(tramos);
        };

        lector.readAsText(archivo, "UTF-8");
    }

    // Inserta la información del KML en el mapa dinámico
    insertarCapaKML(tramos) {
        if (!mapaDinamicoGoogle.mapa) return;

        // Colocar marcador en el punto origen
        const origen = tramos[0][0];
        new google.maps.Marker({
            position: { lat: origen.lat, lng: origen.lng },
            map: mapaDinamicoGoogle.mapa,
            title: "Inicio del circuito"
        });

        // Dibujar cada tramo como polyline
        tramos.forEach(tramo => {
            const path = tramo.map(p => ({ lat: p.lat, lng: p.lng }));
            new google.maps.Polyline({
                path,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 3,
                map: mapaDinamicoGoogle.mapa
            });
        });

        // Centrar el mapa en el origen
        mapaDinamicoGoogle.mapa.setCenter({ lat: origen.lat, lng: origen.lng });
        mapaDinamicoGoogle.mapa.setZoom(15);
    }
}

var mapaDinamicoGoogle = new Object();

function initMap(){
    var portimao = { lat: 37.2323871, lng: -8.6309250 };
    mapaDinamicoGoogle.mapa = new google.maps.Map(document.querySelector("main > div"), { zoom: 13, center: portimao });
}

mapaDinamicoGoogle.initMap = initMap;



