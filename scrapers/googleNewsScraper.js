// scrapers/googleNewsScraper.js
import Parser from 'rss-parser'

const parser = new Parser()

const departamentos = [
    { nombre: 'CAUCA', lat: 2.44, lng: -76.61 },
    { nombre: 'VALLE DEL CAUCA', lat: 3.45, lng: -76.53 },
    { nombre: 'NARIÑO', lat: 1.23, lng: -77.28 },
    { nombre: 'CHOCÓ', lat: 5.68, lng: -76.64 }
]

const keywords = [
    'conflicto',
    'GAO',
    'disidencias',
    'desplazamiento',
    'presencia armada',
    'paro',
    'paro armado',
    'convocatoria',
    'protesta',
    'marcha',
    'bloqueo',
    'ELN',
    'FARC',
    'combates',
    'secuestro',
    'extorsion',
    'atentado',
    'explosivo',
]

const googleNewsScraper = async () => {
    const eventos = []
    const hoy = new Date()
    const hace7dias = new Date(hoy)
    hace7dias.setDate(hoy.getDate() - 7)

    for (const dpto of departamentos) {
        const query = keywords.map(k => encodeURIComponent(k)).join('+OR+')
        const rssUrl = `https://news.google.com/rss/search?q=(${query})+${encodeURIComponent(dpto.nombre)}&hl=es-419&gl=CO&ceid=CO:es`

        try {
            const feed = await parser.parseURL(rssUrl)
            feed.items.forEach(item => {
                const fechaNoticia = new Date(item.pubDate)
                if (fechaNoticia < hace7dias) return

                eventos.push({
                    idNoticia: item.link,
                    titulo: item.title,
                    descripcion: item.contentSnippet || item.title,
                    tipo: 'Noticia Google News',
                    fecha: fechaNoticia.toISOString(),
                    municipio: 'No especificado',
                    departamento: dpto.nombre,
                    vereda: 'No especificado',
                    tags: keywords.filter(k => item.title.toLowerCase().includes(k.toLowerCase())),
                    fuente: 'Google News RSS',
                    lat: dpto.lat,
                    lng: dpto.lng,
                    link: item.link
                })
            })
        } catch (err) {
            console.warn(`❌ Error leyendo RSS para ${dpto.nombre}:`, err.message)
        }
    }

    return eventos
}

export default googleNewsScraper
