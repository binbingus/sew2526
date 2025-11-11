class Ciudad {
    #nombreCiudad;
    #pais;
    #gentilicio;
    #poblacion;
    #longitud;
    #latitud;
    #fechaCarrera;

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
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.#latitud}&longitude=${this.#longitud}&hourly=temperature_2m,apparent_temperature,precipitation,humidity_2m,windspeed_10m,winddirection_10m&daily=sunrise,sunset&start_date=${fechaCarrera}&end_date=${fechaCarrera}&timezone=auto`;
        const fecha = this.#fechaCarrera;

        return $.ajax({
            url: url,
            method: "GET",
            dataType: "json"
        }).then(data => {
            const datosDiarios = {
                salidaSol: data.daily.sunrise[0],
                puestaSol: data.daily.sunset[0]
            };

            const horas = data.hourly.time;
            const datosHorarios = horas.map((hora, i) => ({
                hora: hora,
                temperatura: data.hourly.temperature_2m[i],
                sensacionTermica: data.hourly.apparent_temperature[i],
                lluvia: data.hourly.precipitation[i],
                humedad: data.hourly.humidity_2m[i],
                vientoVelocidad: data.hourly.windspeed_10m[i],
                vientoDireccion: data.hourly.winddirection_10m[i]
            }));

            return { datosDiarios, datosHorarios };
        }).catch(error => {
            console.error("Error al obtener la meteorología:", error);
            return null;
        });
    }

} 