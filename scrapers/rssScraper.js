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
    let totalProcesados = 0
    let descartados = 0

    for (const depto of DEPARTAMENTOS) {
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(depto.nombre + ' conflicto')}`
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        })

        const $ = cheerio.load(data, { xmlMode: true })
        const items = $('item')

        for (let i = 0; i < Math.min(items.length, 10); i++) {
            const item = items[i]
            const titulo = $(item).find('title').text()
            const link = $(item).find('link').text()
            const descripcion = $(item).find('description').text()
            totalProcesados++

            const textoRSS = `${titulo} ${descripcion}`.toLowerCase()

            // Si el resumen tiene potencial
            if (KEYWORDS.some(k => textoRSS.includes(k))) {
                let textoCompleto = textoRSS

                // Intentar obtener contenido completo del artículo
                try {
                    const htmlNoticia = await axios.get(link, {
                        headers: { 'User-Agent': 'Mozilla/5.0' }
                    })
                    const $noticia = cheerio.load(htmlNoticia.data)
                    const cuerpo = $noticia('p').text().toLowerCase()
                    textoCompleto += ` ${cuerpo}`
                } catch (err) {
                    console.warn(`⚠️ No se pudo acceder a: ${link}`)
                }

                // Validar de nuevo con cuerpo completo
                const tagsDetectados = KEYWORDS.filter(k => textoCompleto.includes(k))
                if (tagsDetectados.length > 0) {
                    const yaExiste = await Evento.findOne({ link })
                    if (!yaExiste) {
                        const nuevo = await Evento.create({
                            municipio: 'No especificado',
                            departamento: depto.nombre,
                            nivel_riesgo: 'Moderado',
                            fecha: new Date(),
                            descripcion: titulo,
                            tipo: 'Noticia RSS',
                            fuente: 'Google News RSS',
                            vereda: 'No especificado',
                            tags: tagsDetectados,
                            link,
                            lat: depto.lat,
                            lng: depto.lng
                        })
                        eventosInsertados.push(nuevo)
                    }
                } else {
                    descartados++
                }
            } else {
                descartados++
            }
        }
    }

    console.log(`✅ RSS BOT: ${eventosInsertados.length} insertados | ${descartados} descartados | ${totalProcesados} procesados`)
    return {
        insertados: eventosInsertados.length,
        descartados,
        procesados: totalProcesados,
        detalles: eventosInsertados.map(e => e.descripcion)
    }
}

export default runScraperRSS
