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
        this.#longitud = 37.13;
        this.#latitud = -8.53;
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
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.#latitud}&longitude=${this.#longitud}&hourly=temperature_2m,apparent_temperature,precipitation,humidity_2m,windspeed_10m,winddirection_10m&daily=sunrise,sunset&start_date=${this.#fechaCarrera}&end_date=${this.#fechaCarrera}&timezone=auto`;

        $.ajax({
            url: url,
            method: "GET",
            dataType: "json"
        }).done(data => {
            // Guardamos directamente en el atributo privado
            this.#jsonCarrera = {
                diarios: {
                    salidaSol: data.daily.sunrise[0],
                    puestaSol: data.daily.sunset[0]
                },
                horarios: data.hourly.time.map((hora, i) => ({
                    hora: hora,
                    temperatura: data.hourly.temperature_2m[i],
                    sensacionTermica: data.hourly.apparent_temperature[i],
                    lluvia: data.hourly.precipitation[i],
                    humedad: data.hourly.humidity_2m[i],
                    vientoVelocidad: data.hourly.windspeed_10m[i],
                    vientoDireccion: data.hourly.winddirection_10m[i]
                }))
            };

            // Llamamos a procesar después de obtener los datos
            this.#procesarJSONCarrera();
        }).fail(error => {
            console.error("Error al obtener la meteorología:", error);
        });
    }

    #procesarJSONCarrera() {
        if (!this.#jsonCarrera) {
            console.error("No hay datos para procesar");
            return;
        }

        // Aquí podrías hacer cualquier cálculo adicional si quisieras
        // Por ahora, directamente llamamos a mostrar
        this.#mostrarMeteorologia();
    }

    #mostrarMeteorologia() {
        if (!this.#jsonCarrera) return;

        // Datos diarios
        const pDiarios = document.createElement("p");
        pDiarios.textContent = `Salida del sol: ${this.#jsonCarrera.diarios.salidaSol}, Puesta del sol: ${this.#jsonCarrera.diarios.puestaSol}`;
        document.body.appendChild(pDiarios);

        // Datos horarios
        const tabla = document.createElement("table");
        const cabecera = document.createElement("tr");
        cabecera.innerHTML = "<th>Hora</th><th>Temp</th><th>Sensación</th><th>Lluvia</th><th>Humedad</th><th>Viento</th><th>Dir. Viento</th>";
        tabla.appendChild(cabecera);

        this.#jsonCarrera.horarios.forEach(h => {
            const fila = document.createElement("tr");
            fila.innerHTML = `<td>${h.hora}</td><td>${h.temperatura}°C</td><td>${h.sensacionTermica}°C</td><td>${h.lluvia} mm</td><td>${h.humedad}%</td><td>${h.vientoVelocidad} km/h</td><td>${h.vientoDireccion}°</td>`;
            tabla.appendChild(fila);
        });

        document.body.appendChild(tabla);
    }

} 