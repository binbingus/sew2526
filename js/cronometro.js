class Cronometro {
    #tiempo = 0;
    #inicio = null;
    #corriendo = null;
    #arrancado = false;

    constructor() {
        const botones = document.querySelectorAll("main button");

        botones[0].addEventListener("click", () => this.arrancar());
        botones[1].addEventListener("click", () => this.parar());
        botones[2].addEventListener("click", () => this.reiniciar());
    }

    arrancar() {
        if (this.#arrancado) return;

        try { 
            this.#inicio = Temporal.now() - this.#tiempo;
        } catch (error) { 
            this.#inicio = new Date() - this.#tiempo;
        }
        this.#arrancado = true;

        this.#corriendo = setInterval(() => this.#actualizar(), 100);
    }

    #actualizar() {
        this.#tiempo = new Date() - this.#inicio;
        this.#mostrar();
    }

    #mostrar() {
        const parrafo = document.querySelector("main p");
        let minutos = Math.floor(this.#tiempo / 60000);
        let segundos = Math.floor((this.#tiempo % 60000) / 1000);
        let decimas = Math.floor((this.#tiempo % 1000) / 100);

        parrafo.textContent =
            String(minutos).padStart(2, '0') + ":" +
            String(segundos).padStart(2, '0') + "." +
            String(decimas);
    }

    parar() {
        clearInterval(this.#corriendo);
        this.#arrancado = false;
    }

    reiniciar() {
        clearInterval(this.#corriendo);
        this.#tiempo = 0;
        this.#arrancado = false;
        this.#mostrar();
    }
}

new Cronometro();
