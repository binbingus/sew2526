class Carrusel {
    #busqueda;
    #actual;
    #maximo;
    #jsonFotografias;
    #imagenes;

    constructor() {
        this.#busqueda = "AutodromoDoAlgarve";
        this.#actual = 0;
        this.#maximo = 4;
    }

    #getFotografias() {
        var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
        $.getJSON(flickrAPI, {
            tags: this.#busqueda,
            tagmode: "any",
            format: "json"
        })
        .done((data) => {
            this.#jsonFotografias = data;
            this.#procesarJSONFotografias();
        })
        .fail((jqxhr, textStatus, error) => {
            console.error("Error al obtener las imágenes: ", textStatus, error);
        });
    }

    #procesarJSONFotografias() {
        this.#imagenes = [];
        for (let i = 0; i <= this.#maximo; i++) {
            let foto = this.#jsonFotografias.items[i];
            let imgTag = `<img src="${foto.media.m.replace("_m", "_z")}" alt="${foto.title}" title="${foto.title}">`;
            this.#imagenes.push(imgTag);
        }
    }

    mostrarFotografias() {
        // Mostrar primeras 5 fotos obtenidas 
        this.#getFotografias();

        let fotoActual = this.#imagenes[this.#actual];

        // Foto se muestra en un article con un h2 con el texto “Imágenes del circuito de Autodromo Do Algarve”
        const article = $('<article></article>');
        const h2 = $('<h2>Imágenes del circuito Autódromo do Algarve</h2>');
        article.append(h2);
        article.append(fotoActual);

        // Insertar el article antes del footer
        $('body').append(article);
    }
}
