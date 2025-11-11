class Ciudad {
    #nombreCiudad;
    #pais;
    #gentilicio;
    #poblacion;
    #longitud;
    #latitud;
    #fechaCarrera;
    #jsonCarrera;

    constructor(nombreCiudad, pais, gentilicio) {
        this.#nombreCiudad = nombreCiudad;   // Portimão
        this.#pais = pais;                   // Portugal
        this.#gentilicio = gentilicio;       // Portimonense

        this.#fechaCarrera = '2025-11-09';
    }

    rellenarAttrib() {
        this.#poblacion = 59867; 
        this.#latitud = 37.13;
        this.#longitud = -8.53;
    }

    // Nombre de la ciudad en formato de texto
    nombreTexto() {
        return this.#nombreCiudad;
    }

    // Nombre del país en formato de texto
    nombrePais() {
        return this.#pais;
    }

    // Gentilicio y población en una lista no ordenada dentro de una cadena
    infoSecundaria() {
        return "<li>Gentilicio: " + this.#gentilicio + "</li>"+
                "<li>Población: " + this.#poblacion + " habitantes</li>";
    }

    // Escribir en el documento las coordenadas usando document.write()
    coordenadas() {
        const mensaje = document.createElement("p");
        mensaje.textContent = "Longitud: " + this.#longitud + " - Latitud: " + this.#latitud;
        document.body.appendChild(mensaje);
    }

    // METEOROLOGIA
    getMeteorologiaCarrera() {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.#latitud}&longitude=${this.#longitud}&hourly=temperature_2m,apparent_temperature,precipitation,relativehumidity_2m,windspeed_10m,winddirection_10m&daily=sunrise,sunset&start_date=${this.#fechaCarrera}&end_date=${this.#fechaCarrera}&timezone=auto`;

        console.log("URL generada:", url);

        $.ajax({
            url: url,
            method: "GET",
            dataType: "json"
        }).done(data => {
            this.#jsonCarrera = data;
            this.#procesarJSONCarrera();
        }).fail(error => {
            console.error("Error al obtener la meteorología:", error);
        });
    }

    #procesarJSONCarrera() {
        if (!this.#jsonCarrera) return;

        // Datos diarios
        const diarios = {
            salidaSol: this.#jsonCarrera.daily.sunrise[0],
            puestaSol: this.#jsonCarrera.daily.sunset[0]
        };

        // Datos horarios
        const horarios = this.#jsonCarrera.hourly.time.map((hora, i) => ({
            hora: hora,
            temperatura: this.#jsonCarrera.hourly.temperature_2m[i],
            sensacionTermica: this.#jsonCarrera.hourly.apparent_temperature[i],
            lluvia: this.#jsonCarrera.hourly.precipitation[i],
            humedad: this.#jsonCarrera.hourly.relativehumidity_2m[i],
            vientoVelocidad: this.#jsonCarrera.hourly.windspeed_10m[i],
            vientoDireccion: this.#jsonCarrera.hourly.winddirection_10m[i]
        }));

        // Guardamos procesado
        this.#jsonCarrera = { diarios, horarios };

        // Mostrar en HTML
        this.#mostrarMeteorologia();
    }

    #mostrarMeteorologia() {
        if (!this.#jsonCarrera) return;

        // Título h3 
        const h3 = document.createElement("h3");
        h3.textContent = "Datos meteorológicos horarios del día de la carrera";
        document.body.appendChild(h3);

        // Datos diarios
        const pDiarios = document.createElement("p");
        pDiarios.textContent = `Salida del sol: ${this.#jsonCarrera.diarios.salidaSol.split("T")[1]}, Puesta del sol: ${this.#jsonCarrera.diarios.puestaSol.split("T")[1]}`;
        document.body.appendChild(pDiarios);

        // Crear tabla accesible
        const tabla = document.createElement("table");

        // Caption
        const caption = document.createElement("caption");
        caption.textContent = `Tabla de meteorología de ${this.#nombreCiudad} para ${this.#fechaCarrera}`;
        tabla.appendChild(caption);

        // Encabezado
        const thead = document.createElement("thead");
        const cabecera = document.createElement("tr");
        ["Hora","Temp","Sensación","Lluvia","Humedad","Viento","Dir. Viento"].forEach(texto => {
            const th = document.createElement("th");
            th.scope = "col"; // accesible
            th.textContent = texto;
            cabecera.appendChild(th);
        });
        thead.appendChild(cabecera);
        tabla.appendChild(thead);

        // Cuerpo
        const tbody = document.createElement("tbody");
        this.#jsonCarrera.horarios.forEach(h => {
            const fila = document.createElement("tr");

            // Formateamos solo la hora
            const horaTd = document.createElement("td");
            horaTd.textContent = h.hora.split("T")[1];
            fila.appendChild(horaTd);

            // Resto de datos
            [h.temperatura + "°C",
            h.sensacionTermica + "°C",
            h.lluvia + " mm",
            h.humedad + "%",
            h.vientoVelocidad + " km/h",
            h.vientoDireccion + "°"].forEach(valor => {
                const td = document.createElement("td");
                td.textContent = valor;
                fila.appendChild(td);
            });

            tbody.appendChild(fila);
        });
        tabla.appendChild(tbody);

        document.body.appendChild(tabla);
    }

} 