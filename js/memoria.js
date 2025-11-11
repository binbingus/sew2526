class Memoria {
    #tablero_bloqueado;
    #primera_carta;
    #segunda_carta;
    #cronometro;

    constructor() {
        this.#tablero_bloqueado = true;
        this.#primera_carta = null;
        this.#segunda_carta = null;

        this.#barajarCartas();

        this.#cronometro = new Cronometro(); 
        this.#cronometro.arrancar();

        // Asignar evento de clic a cada carta
        const cartas = document.querySelectorAll("main article");
        cartas.forEach(carta => {
            carta.addEventListener("click", (event) => {
                this.voltearCarta(event.currentTarget);
            });
        });
    }

    #barajarCartas() {
        const main = document.querySelector("main");
        const cartas = Array.from(main.querySelectorAll("article"));

        for (let i = cartas.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
        }

        cartas.forEach(carta => main.appendChild(carta));
        this.#tablero_bloqueado = false;
    }

    #reiniciarAtributos() {
        this.#tablero_bloqueado = false;
        this.#primera_carta = null;
        this.#segunda_carta = null;
    }

    #deshabilitarCartas() {
        this.#primera_carta.dataset.estado = "revelada";
        this.#segunda_carta.dataset.estado = "revelada";

        this.#comprobarJuego();
        this.#reiniciarAtributos();
    }

    #comprobarJuego() {
        const main = document.querySelector("main");
        const cartas_reveladas = main.querySelectorAll("article[data-estado=revelada]");

        if (cartas_reveladas.length === main.querySelectorAll("article").length) {
            this.#cronometro.parar();
            return true;
        } else {
            return false;
        }
    }

    // LÓGICA DEL JUEGO
    voltearCarta(carta) {
        if (carta.dataset.estado === "revelada" || this.#tablero_bloqueado) {
            return;
        }

        if (!this.#primera_carta) {
            this.#primera_carta = carta;
            carta.dataset.estado = "volteada";
            return;
        } else if (this.#primera_carta && !this.#segunda_carta) {
            this.#segunda_carta = carta;
            carta.dataset.estado = "volteada";
            this.#comprobarPareja();
            return;
        }        
    }

    #cubrirCartas() {
        // Pone boca abajo las dos cartas volteadas si no son iguales tras un retardo de 1.5 segundos
        setTimeout(() => {
            this.#primera_carta.dataset.estado = "null";
            this.#segunda_carta.dataset.estado = "null"; 
            this.#reiniciarAtributos();
        }, 500);
    }

    #comprobarPareja() {
        var valor_primera = this.#primera_carta.querySelector("img").getAttribute("alt");
        var valor_segunda = this.#segunda_carta.querySelector("img").getAttribute("alt");

        if (valor_primera === valor_segunda) {
            this.#deshabilitarCartas();
        } else {
            this.#cubrirCartas();
        }
    }



}