class Cronometro {
    constructor() {
        this.tiempo = 0;
    }

    arrancar() {
        // No arrancar si ya está arrancado
        if (this.arrancado) {
            return;
        }

        // Guardar el tiempo de inicio
        try {
            this.inicio = Temporal.now();
        } catch (error) {
            this.inicio = new Date();
        }     

        // Marcar como arrancado y comenzar la actualización periódica
        this.arrancado = true;
        this.corriendo = setInterval(actualizar(), 100);
    }

    actualizar() {
        // Calcular el tiempo transcurrido desde el inicio
        var ahora = null;
        try {
            ahora = Temporal.now();
            this.tiempo += ahora.since(this.inicio).total('seconds');
        } catch (error) {
            ahora = new Date();
            this.tiempo += (ahora - this.inicio) / 1000;
        }

        // Actualizar la visualización
        this.mostrar();
        // Programar la siguiente actualización
        this.timeoutID = window.setTimeout(this.actualizar.bind(this), 100);
    }

    mostrar() {
        // Calcular minutos, segundos y décimas
        var minutos = Math.floor(this.tiempo / 60);
        var segundos = Math.floor(this.tiempo % 60);
        var decimas = Math.floor((this.tiempo - Math.floor(this.tiempo)) * 10);

        const main = document.querySelector("main");

        const parrafo = document.querySelector("main p");
        parrafo.textContent = parseInt(minutos).toString().padStart(2, '0') + ":" +
                              parseInt(segundos).toString().padStart(2, '0') + "." +
                              parseInt(decimas).toString().padStart(1, '0');
    }

    parar() {
        clearInterval(this.corriendo);
        this.arrancado = false;
    }

    reniniciar() {
        clearInterval(this.corriendo);
        this.tiempo = 0;
        this.mostrar();
    }
}