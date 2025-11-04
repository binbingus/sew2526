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
        this.corriendo = setInterval(this.actualizar(), 100);
    }

    actualizar() {
        // Calcular el tiempo transcurrido desde el inicio
        let ahora = null;

        try {
            ahora = Temporal.now();
            this.tiempo = ahora.since(this.inicio).total('milliseconds');
        } catch (error) {
            ahora = new Date();
            this.tiempo = ahora - this.inicio;
        }

        // Actualizar la visualización
        this.mostrar();
        // Programar la siguiente actualización
        this.timeoutID = window.setTimeout(this.actualizar.bind(this), 100);
    }

    mostrar() {
        let minutos = Math.floor(this.tiempo / 60000); // 1 minuto = 60000 ms
        let segundos = Math.floor((this.tiempo % 60000) / 1000); // Segundos restantes
        let decimas = Math.floor((this.tiempo % 1000) / 100); // Décimas de segundo     

        const parrafo = document.querySelector("main p");
        parrafo.textContent = parseInt(minutos).toString().padStart(2, '0') + ":" +
                              parseInt(segundos).toString().padStart(2, '0') + "." +
                              parseInt(decimas).toString().padStart(1, '0');
    }

    parar() {
        clearInterval(this.corriendo);
        clearTimeout(this.timeoutID);
        this.arrancado = false;
    }

    reiniciar() {
        clearInterval(this.corriendo);
        this.tiempo = 0;
        this.mostrar();
    }
}