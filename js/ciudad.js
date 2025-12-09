class Ciudad {
    #nombreCiudad;
    #pais;
    #gentilicio;
    #poblacion;
    #longitud;
    #latitud;
    #fechaCarrera;
    #jsonCarrera;
    #jsonEntrenos;

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

    // Escribir en el documento las coordenadas
    coordenadas() {
        const mensaje = document.createElement("p");
        mensaje.textContent = "Longitud: " + this.#longitud + " - Latitud: " + this.#latitud;

        const main = $("main");
        main.append(mensaje);
    }

    // ========================================================================
    // METEOROLOGIA DIA DE LA CARRERA
    getMeteorologiaCarrera() {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.#latitud}&longitude=${this.#longitud}&hourly=temperature_2m,apparent_temperature,precipitation,relativehumidity_2m,windspeed_10m,winddirection_10m&daily=sunrise,sunset&start_date=${this.#fechaCarrera}&end_date=${this.#fechaCarrera}&timezone=auto`;

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

        const tabla = document.createElement("table");

        // Caption
        const caption = document.createElement("caption");
        caption.textContent = `Meteorología de ${this.#nombreCiudad} para ${this.#fechaCarrera}`;
        tabla.appendChild(caption);

        const thead = document.createElement("thead");

        // Fila con salida y puesta del sol antes de los headers
        const filaSol = document.createElement("tr");
        const tdSol = document.createElement("td");
        tdSol.colSpan = 6;
        tdSol.style.fontWeight = "bold";
        tdSol.textContent = `Salida del sol: ${this.#jsonCarrera.diarios.salidaSol.split("T")[1]}, Puesta del sol: ${this.#jsonCarrera.diarios.puestaSol.split("T")[1]}`;
        filaSol.appendChild(tdSol);
        thead.appendChild(filaSol);

        // Headers
        const filaCabecera = document.createElement("tr");
        ["Hora","Temp","Sens. Térmica","Lluvia","Humedad","Viento"].forEach(texto => {
            const th = document.createElement("th");
            th.scope = "col";
            th.textContent = texto;
            filaCabecera.appendChild(th);
        });
        thead.appendChild(filaCabecera);
        tabla.appendChild(thead);

        // datos
        const tbody = document.createElement("tbody");
        this.#jsonCarrera.horarios.forEach(h => {
            const fila = document.createElement("tr");

            const tdHora = document.createElement("td");
            tdHora.textContent = h.hora.split("T")[1];
            fila.appendChild(tdHora);

            [h.temperatura + "°C",
            h.sensacionTermica + "°C",
            h.lluvia + " mm",
            h.humedad + "%",
            h.vientoVelocidad + " km/h - " + h.vientoDireccion + "°"
            ].forEach(valor => {
                const td = document.createElement("td");
                td.textContent = valor;
                fila.appendChild(td);
            });

            tbody.appendChild(fila);
        });
        tabla.appendChild(tbody);

        const main = document.querySelector("main");
        main.appendChild(tabla);

    }


    // ========================================================================
    // METEOROLOGIA DIAS DE ENTRENAMIENTOS

    getMeteorologiaEntrenos() {
        const fechaCarrera = new Date(this.#fechaCarrera);
        const startDate = new Date(fechaCarrera);
        startDate.setDate(fechaCarrera.getDate() - 3); // 3 días antes

        const startStr = startDate.toISOString().split('T')[0]; 
        const endStr = new Date(fechaCarrera.getTime() - 24*60*60*1000).toISOString().split('T')[0]; // día antes de la carrera

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.#latitud}&longitude=${this.#longitud}&hourly=temperature_2m,precipitation,relativehumidity_2m,windspeed_10m&start_date=${startStr}&end_date=${endStr}&timezone=auto`;

        $.ajax({
            url: url,
            method: "GET",
            dataType: "json"
        }).done(data => {
            this.#jsonEntrenos = data;
            this.#procesarJSONEntrenos(); 
        }).fail(error => {
            console.error("Error al obtener la meteorología de entrenamientos:", error);
        });
    }

    #procesarJSONEntrenos() {
        if (!this.#jsonEntrenos) return;

        const horarios = this.#jsonEntrenos.hourly.time;
        const temp = this.#jsonEntrenos.hourly.temperature_2m;
        const lluvia = this.#jsonEntrenos.hourly.precipitation;
        const humedad = this.#jsonEntrenos.hourly.relativehumidity_2m;
        const viento = this.#jsonEntrenos.hourly.windspeed_10m;

        const datosPorDia = {};

        horarios.forEach((hora, i) => {
            const fecha = hora.split("T")[0]; 
            if (!datosPorDia[fecha]) {
                datosPorDia[fecha] = {
                    temperatura: [],
                    lluvia: [],
                    humedad: [],
                    viento: []
                };
            }
            datosPorDia[fecha].temperatura.push(temp[i]);
            datosPorDia[fecha].lluvia.push(lluvia[i]);
            datosPorDia[fecha].humedad.push(humedad[i]);
            datosPorDia[fecha].viento.push(viento[i]);
        });

        const medias = {};
        for (const dia in datosPorDia) {
            const d = datosPorDia[dia];
            medias[dia] = {
                temperatura: (d.temperatura.reduce((a,b)=>a+b,0)/d.temperatura.length).toFixed(2),
                lluvia: (d.lluvia.reduce((a,b)=>a+b,0)/d.lluvia.length).toFixed(2),
                humedad: (d.humedad.reduce((a,b)=>a+b,0)/d.humedad.length).toFixed(2),
                viento: (d.viento.reduce((a,b)=>a+b,0)/d.viento.length).toFixed(2)
            };
        }

        this.#jsonEntrenos = medias;

        this.#mostrarEntrenos();
    }

    #mostrarEntrenos() {
        if (!this.#jsonEntrenos) return;

        const tabla = document.createElement("table");

        // Caption
        const caption = document.createElement("caption");
        caption.textContent = `Medias del tiempo en ${this.#nombreCiudad} para los días de entrenamientos previos a la carrera`;
        tabla.appendChild(caption);

        const thead = document.createElement("thead");
        const filaCabeza = document.createElement("tr");
        ["Día", "Temp (°C)", "Lluvia (mm)", "Humedad (%)", "Viento (km/h)"].forEach(texto => {
            const th = document.createElement("th");
            th.scope = "col";
            th.textContent = texto;
            filaCabeza.appendChild(th);
        });
        thead.appendChild(filaCabeza);
        tabla.appendChild(thead);

        // datos
        const tbody = document.createElement("tbody");
        for (const dia in this.#jsonEntrenos) {
            const fila = document.createElement("tr");

            const tdDia = document.createElement("td");
            tdDia.textContent = dia;
            fila.appendChild(tdDia);

            ["temperatura","lluvia","humedad","viento"].forEach(clave => {
                const td = document.createElement("td");
                td.textContent = this.#jsonEntrenos[dia][clave];
                fila.appendChild(td);
            });

            tbody.appendChild(fila);
        }
        tabla.appendChild(tbody);

        const main = document.querySelector("main");
        main.appendChild(tabla);
    }

} 