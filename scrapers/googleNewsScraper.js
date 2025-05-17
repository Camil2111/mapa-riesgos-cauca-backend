// scrapers/googleNewsScraper.js
import Parser from 'rss-parser';
import insertarEvento from './utils/insertEvento.js';

const parser = new Parser();
const RSS_URL = 'https://news.google.com/rss/search?q=conflicto+OR+GAO+OR+desplazamiento+OR+paro+OR+retén+ilegal&hl=es-419&gl=CO&ceid=CO:es';

const palabrasClave = [
    'conflicto', 'secuestro', 'gao', 'farc', 'asesinan', 'capturan', 'eln', 'disidencias',
    'enfrentamientos', 'zona rural', 'hostigamiento', 'grupo armado', 'desplazamiento',
    'combates', 'ataque', 'marchas', 'bloqueo', 'explosion', 'atentado', 'paro',
    'explosivo', 'presencia armada'
];

const ubicaciones = [
    'cauca', 'nariño', 'chocó', 'valle del cauca',
    'buenaventura', 'tumaco', 'popayán', 'quibdó',
    'caloto', 'argelia', 'guapi', 'toribío'
];

const runGoogleNewsScraper = async () => {
    const feed = await parser.parseURL(RSS_URL);
    let insertados = 0;
    const detalles = [];

    for (const item of feed.items) {
        const texto = `${item.title} ${item.contentSnippet}`.toLowerCase();

        const matchClave = palabrasClave.some(p => texto.includes(p));
        const matchUbicacion = ubicaciones.some(u => texto.includes(u));

        if (matchClave && matchUbicacion) {
            const evento = {
                titulo: item.title,
                descripcion: item.title,
                tipo: 'Noticia Google News',
                fuente: 'Google News RSS',
                municipio: 'No especificado',
                vereda: 'No especificado',
                nivel_riesgo: 'Moderado',
                fecha: new Date(item.pubDate),
                lat: 2.44,
                lng: -76.61,
                link: item.link,
                tags: []
            };

            const res = await insertarEvento(evento);
            if (res) {
                insertados++;
                detalles.push(evento.descripcion);
            }
        }
    }

    return {
        fuente: 'Google News RSS',
        insertados,
        detalles
    };
};

export default runGoogleNewsScraper;

