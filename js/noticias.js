class Noticias {
    #url;
    #busqueda;
    #datos;
    #noticias;

    constructor() {
        this.#busqueda = 'MotoGP';
        this.#url = 'HJwUgCl6sHPQ4NqfNS2gkvoYRaoyeE1cXMsF7xzM'; // Reemplaza con tu key válida
        this.#datos = null;
        this.#noticias = [];
    }

    async buscar() {
        const endpoint = `https://api.thenewsapi.com/v1/news/all?locale=es&language=es&api_token=${this.#url}&search=${encodeURIComponent(this.#busqueda)}`;

        console.log('Buscando noticias en:', endpoint);

        return fetch(endpoint)
            .then(response => {
                if (!response.ok) throw new Error(`Error en la petición: ${response.status}`);
                return response.json();
            })
            .then(json => {
                this.#datos = json;
                this.#procesarInformacion();
            })
            .catch(error => {
                console.error('Error al obtener noticias:', error);
            });
    }

    #procesarInformacion() {
        if (!this.#datos || !Array.isArray(this.#datos.data)) {
            console.warn('No hay noticias para procesar.');
            return;
        }

        this.#noticias = this.#datos.data.map(item => ({
            titulo: item.title || 'Sin título',
            entradilla: item.description || '',
            enlace: item.url || '#',
            fuente: item.source || '',
            imagen: item.image_url || ''
        }));

        this.#mostrarNoticias();
    }

    #mostrarNoticias() {
        const seccion = $('<section></section>');
        const encabezado = $('<h2></h2>').text('Noticias Recientes sobre MotoGP');
        seccion.append(encabezado);

        this.#noticias.forEach(noticia => {
            const article = $('<article></article>');
            const h2 = $('<h3></h3>').text(noticia.titulo);
            const p = $('<p></p>').text(noticia.entradilla);const img = noticia.imagen ? $('<img>').attr('src', noticia.imagen).attr('alt', noticia.titulo) : null;
            const enlace = $('<a></a>')
                .attr('href', noticia.enlace)
                .attr('target', '_blank')
                .text('Leer más');
            const fuente = $('<p></p>').text(`Fuente: ${noticia.fuente}`);

            article.append(h2, p, enlace, fuente);
            seccion.append(article);
        });

        $('body').append(seccion);
    }

}
