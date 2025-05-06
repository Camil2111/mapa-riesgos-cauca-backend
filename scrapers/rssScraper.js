// scrapers/rssScraper.js
import axios from 'axios'
import * as cheerio from 'cheerio'
import Evento from '../models/evento.model.js'

const DEPARTAMENTOS = [
    { nombre: 'CAUCA', lat: 2.45, lng: -76.61 },
    { nombre: 'VALLE DEL CAUCA', lat: 3.45, lng: -76.53 },
    { nombre: 'NARIÑO', lat: 1.23, lng: -77.28 },
    { nombre: 'ANTIOQUIA', lat: 6.25, lng: -75.56 },
    { nombre: 'CHOCO', lat: 5.27, lng: -76.67 },
]

const KEYWORDS = ['conflicto', 'gao', 'disidencias', 'atentado', 'violencia', 'armado', 'bloqueo', 'enfrentamiento', 'explosivo']

const runScraperRSS = async () => {
    const eventosInsertados = []

    for (let depto of DEPARTAMENTOS) {
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(depto.nombre + ' conflicto')}`
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        })

        const $ = cheerio.load(data, { xmlMode: true })
        const items = $('item')

        for (let i = 0; i < Math.min(items.length, 8); i++) {
            const item = items[i]
            const titulo = $(item).find('title').text()
            const link = $(item).find('link').text()

            if (KEYWORDS.some(k => titulo.toLowerCase().includes(k))) {
                const existe = await Evento.findOne({ descripcion: titulo })
                if (!existe) {
                    const nuevo = await Evento.create({
                        municipio: depto.nombre,
                        departamento: depto.nombre,
                        nivel_riesgo: 'Moderado',
                        fecha: new Date(),
                        descripcion: titulo,
                        vereda: 'No especificado',
                        tipo: 'Noticia',
                        lat: depto.lat,
                        lng: depto.lng
                    })
                    eventosInsertados.push(nuevo)
                }
            }
        }
    }

    console.log(`✅ RSS: Insertados ${eventosInsertados.length} eventos`)
    return {
        departamentos: DEPARTAMENTOS.length,
        insertados: eventosInsertados.length,
        detalles: eventosInsertados.map(e => e.descripcion)
    }
}

export default runScraperRSS
