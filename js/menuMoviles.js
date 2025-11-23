class MenuMovil {
    constructor() {
        this.header = document.querySelector("header");
        if (!this.header) return;

        this.boton = this.header.querySelector("button");
        this.nav = this.header.querySelector("nav");

        if (!this.boton || !this.nav) return;

        // Estado inicial
        this.nav.setAttribute("data-visible", "false");
        this.boton.setAttribute("aria-expanded", "false");

        // Evento click en el botón hamburguesa
        this.boton.addEventListener("click", () => this.toggleMenu());

        // Cerrar menú al pulsar un enlace
        this.nav.querySelectorAll("a").forEach(a => {
            a.addEventListener("click", () => this.cerrarMenu());
        });
    }

    toggleMenu() {
        const visible = this.nav.getAttribute("data-visible") === "true";
        this.nav.setAttribute("data-visible", !visible);
        this.boton.setAttribute("aria-expanded", !visible);
    }

    cerrarMenu() {
        this.nav.setAttribute("data-visible", "false");
        this.boton.setAttribute("aria-expanded", "false");
    }
}

// Inicializar menú al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    new MenuMovil();
});