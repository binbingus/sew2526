class Ciudad {
    constructor(nombreCiudad, pais, gentilicio) {
        this.nombreCiudad = nombreCiudad;   // Portimão
        this.pais = pais;                   // Portugal
        this.gentilicio = gentilicio;       // Portimonense
    }

    rellenarAttrib() {
        poblacion = 59867; 
        longitud = 37.13;
        latitud = -8.53;
    }

    // Nombre de la ciudad en formato de texto
    nombreTexto() {
        const ciudad = document.createElement("p");
        ciudad.textContent(this.nombreCiudad);
    }

    // Nombre del país en formato de texto
    nombrePais() {
        const pais = document.createElement("p");
        pais.textContent(this.pais);
    }

    // Gentilicio y población en una lista no ordenada dentro de una cadena
    infoSecundaria() {
        const lista = document.createElement("ul");
        const gent = lista.createElement("li");
        gent.textContent("Gentilicio: " + this.gentilicio);

        const pob = lista.createElement("li");
        pob.textContent("Población: " + this.poblacion + " habitantes");
    }

    // Escribir en el documento las coordenadas usando document.write()
    coordenadas() {
        document.write("<p> Longitud: " + this.longitud + " - Latitud: " + this.latitud + "</p>");
    }

} 