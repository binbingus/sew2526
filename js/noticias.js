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
        const endpoint = `https://api.thenewsapi.com/v1/news/all?locale=us&language=en&api_token=${this.#url}&search=${encodeURIComponent(this.#busqueda)}`;

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

        this.#noticias.forEach(noticia => {
            const article = $('<article></article>');
            const h2 = $('<h3></h3>').text(noticia.title);
            const p = $('<p></p>').text(noticia.description);
            const img = noticia.image_url ? $('<img>').attr('src', noticia.image_url).attr('alt', noticia.title) : null;
            const enlace = $('<a></a>')
                .attr('href', noticia.url)
                .attr('target', '_blank')
                .text('Leer más');
            const fuente = $('<p></p>').text(`Fuente: ${noticia.source}`);

            article.append(h2, p, img, enlace, fuente);
            seccion.append(article);
        });

        $('body').append(seccion);
    }
}
