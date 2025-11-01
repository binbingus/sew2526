class Ciudad {
    constructor(nombreCiudad, pais, gentilicio) {
        this.nombreCiudad = nombreCiudad;   // Portimão
        this.pais = pais;                   // Portugal
        this.gentilicio = gentilicio;       // Portimonense
    }

    rellenarAttrib() {
        this.poblacion = 59867; 
        this.longitud = 37.13;
        this.latitud = -8.53;
    }

    // Nombre de la ciudad en formato de texto
    nombreTexto() {
        return this.nombreCiudad;
    }

    // Nombre del país en formato de texto
    nombrePais() {
        return this.pais;
    }

    // Gentilicio y población en una lista no ordenada dentro de una cadena
    infoSecundaria() {
        return "<li>Gentilicio: " + this.gentilicio + "</li>"+
                "<li>Población: " + this.poblacion + " habitantes</li>";
    }

    // Escribir en el documento las coordenadas usando document.write()
    coordenadas() {
        const mensaje = document.createElement("p");
        mensaje.textContent = "Longitud: " + this.longitud + " - Latitud: " + this.latitud;
        document.body.appendChild(mensaje);
    }

} 