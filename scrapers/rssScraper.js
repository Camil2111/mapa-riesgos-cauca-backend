import Parser from 'rss-parser'
import Evento from '../models/evento.model.js'

const parser = new Parser()

const FEEDS = [
    {
        url: 'https://www.elespectador.com/rss/judicial/',
        departamento: 'COLOMBIA',
        lat: 4.57,
        lng: -74.29
    }
]

const KEYWORDS = ['conflicto', 'gao', 'disidencias', 'atentado', 'violencia', 'armado', 'bloqueo', 'enfrentamiento', 'explosivo']

const runScraperRSS = async () => {
    const eventosInsertados = []
    let totalProcesados = 0
    let descartados = 0

    for (const feed of FEEDS) {
        const { items } = await parser.parseURL(feed.url)

        for (const item of items.slice(0, 15)) {
            totalProcesados++

            const texto = `${item.title} ${item.contentSnippet || ''}`.toLowerCase()
            const tagsDetectados = KEYWORDS.filter(k => texto.includes(k))

            if (tagsDetectados.length > 0) {
                const yaExiste = await Evento.findOne({ link: item.link })
                if (!yaExiste) {
                    const nuevo = await Evento.create({
                        municipio: 'No especificado',
                        departamento: feed.departamento,
                        nivel_riesgo: 'Moderado',
                        fecha: new Date(item.pubDate),
                        descripcion: item.title,
                        tipo: 'Noticia RSS',
                        fuente: 'El Espectador RSS',
                        vereda: 'No especificado',
                        tags: tagsDetectados,
                        link: item.link,
                        lat: feed.lat,
                        lng: feed.lng
                    })
                    eventosInsertados.push(nuevo)
                }
            } else {
                descartados++
            }
        }
    }

    console.log(`✅ RSS DEFINITIVO: ${eventosInsertados.length} insertados | ${descartados} descartados | ${totalProcesados} procesados`)
    return {
        insertados: eventosInsertados.length,
        descartados,
        procesados: totalProcesados,
        detalles: eventosInsertados.map(e => e.descripcion)
    }
}

export default runScraperRSS
