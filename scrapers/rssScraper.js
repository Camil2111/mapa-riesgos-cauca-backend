import Parser from 'rss-parser'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { insertarEvento } from './utils/insertEvento.js'

const parser = new Parser()

const RSS_FEEDS = [
    {
        url: 'https://www.elespectador.com/judicial/feed/',
        fuente: 'El Espectador Judicial',
        departamento: 'COLOMBIA',
        lat: 4.57,
        lng: -74.29
    }
]

const KEYWORDS = [
    'conflicto', 'gao', 'disidencias', 'violencia',
    'bloqueo', 'atentado', 'explosión', 'enfrentamiento', 'armado'
]

const nivelPorTags = (tags) => {
    if (tags.includes('explosión') || tags.includes('atentado')) return 'Crítico'
    if (tags.includes('gao') || tags.includes('disidencias')) return 'Alto'
    if (tags.length >= 2) return 'Moderado'
    return 'Bajo'
}

const runScraperRSS = async () => {
    const eventosInsertados = []
    let procesados = 0
    let descartados = 0

    for (const feed of RSS_FEEDS) {
        const parsed = await parser.parseURL(feed.url)

        for (const item of parsed.items.slice(0, 10)) {
            procesados++

            try {
                const noticia = await axios.get(item.link, {
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                    validateStatus: status => status < 400 // ignora respuestas con error 404
                })

                if (!noticia || !noticia.data) {
                    console.warn('⚠️ Sin contenido, omitiendo:', item.link)
                    descartados++
                    continue
                }

                const html = noticia.data.toLowerCase()

                if (
                    html.includes('página no encontrada') ||
                    html.includes('error 404') ||
                    html.includes('no se encuentra en nuestro sistema')
                ) {
                    console.warn('⚠️ Página rota o vacía, omitiendo:', item.link)
                    descartados++
                    continue
                }

                const $ = cheerio.load(html)
                const contenido = $('p').text().toLowerCase()
                const texto = `${item.title} ${contenido}`
                const tags = KEYWORDS.filter(k => texto.includes(k))

                if (tags.length > 0) {
                    const evento = await insertarEvento({
                        municipio: 'No especificado',
                        departamento: feed.departamento,
                        nivel_riesgo: nivelPorTags(tags),
                        fecha: new Date(item.pubDate || Date.now()),
                        descripcion: item.title,
                        tipo: 'Noticia RSS',
                        fuente: feed.fuente,
                        vereda: 'No especificado',
                        tags,
                        lat: feed.lat,
                        lng: feed.lng,
                        link: item.link
                    })

                    if (evento) eventosInsertados.push(evento)
                } else {
                    descartados++
                }
            } catch (err) {
                console.warn('❌ Error accediendo a:', item.link, '-', err.message)
                descartados++
            }
        }
    }

    console.log(`🧠 RSS BOT IA: ${eventosInsertados.length} insertados | ${descartados} descartados | ${procesados} procesados`)

    return {
        fuente: 'RSS Bot IA',
        insertados: eventosInsertados.length,
        descartados,
        procesados,
        detalles: eventosInsertados.map(e => e.descripcion)
    }
}

export default runScraperRSS
