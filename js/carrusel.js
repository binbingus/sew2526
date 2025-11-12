class Carrusel {
    #busqueda;
    #actual;
    #maximo;
    #jsonFotografias;
    #imagenes;
    #intervalo;

    constructor() {
        this.#busqueda = "AutodromoDoAlgarve";
        this.#actual = 0;
        this.#maximo = 4;
    }

    getFotografias() {
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

        this.#mostrarFotografias();
    }

    #mostrarFotografias() {
        // Mostrar primeras 5 fotos obtenidas 
        let fotoActual = this.#imagenes[this.#actual];

        // Foto se muestra en un article con un h2 con el texto “Imágenes del circuito de Autodromo Do Algarve”
        const main = $('main');
        const article = $('<article></article>');
        const h2 = $('<h2>Imágenes del circuito Autódromo do Algarve</h2>');
        article.append(h2);
        article.append(fotoActual);
        $('body').append(article);

        this.#intervalo = setInterval(this.#cambiarFotografia.bind(this), 3000);
        main.append(article);
    }

    #cambiarFotografia() {
         this.#actual++;

        if (this.#actual > this.#maximo) {
            this.#actual = 0;
        }
 
        const nuevaFoto = this.#imagenes[this.#actual];
        $('article img').replaceWith(nuevaFoto);
    }
}
