import axios from 'axios'
import * as cheerio from 'cheerio'
import { insertarEvento } from './utils/insertEvento.js'

const URL = 'https://proclamadelcauca.com/category/judiciales/'
const KEYWORDS = ['conflicto', 'violencia', 'disidencias', 'bloqueo', 'gao', 'explosión', 'atentado', 'armado', 'enfrentamiento']

const runScraperProclama = async () => {
    const eventos = []

    try {
        const { data } = await axios.get(URL)
        const $ = cheerio.load(data)

        const noticias = $('.jeg_postblock_content')

        for (let i = 0; i < Math.min(noticias.length, 10); i++) {
            const elem = noticias[i]
            const title = $(elem).find('.jeg_post_title a').text().trim()
            const link = $(elem).find('.jeg_post_title a').attr('href')

            if (!link || !title) continue

            let contenidoCompleto = ''
            try {
                const htmlNoticia = await axios.get(link, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                    }
                })
                const $$ = cheerio.load(htmlNoticia.data)
                contenidoCompleto = $$('p').text().toLowerCase()
            } catch (err) {
                console.warn('⚠️ No se pudo leer:', link)
                continue
            }

            const textoTotal = `${title} ${contenidoCompleto}`.toLowerCase()
            const tags = KEYWORDS.filter(k => textoTotal.includes(k))

            if (tags.length > 0) {
                const evento = await insertarEvento({
                    municipio: 'No especificado',
                    departamento: 'CAUCA',
                    nivel_riesgo: 'Moderado',
                    fecha: new Date(),
                    descripcion: title,
                    tipo: 'Noticia web',
                    fuente: 'Proclama Judicial',
                    vereda: 'No especificado',
                    tags,
                    lat: 2.45,
                    lng: -76.61,
                    link
                })

                if (evento) eventos.push(evento)
            }
        }

        return {
            fuente: 'Proclama del Cauca',
            insertados: eventos.length,
            detalles: eventos.map(e => e.descripcion)
        }
    } catch (err) {
        console.error('❌ Error en proclamaScraper:', err.message)
        return {
            fuente: 'Proclama del Cauca',
            insertados: 0,
            detalles: [],
            error: err.message
        }
    }
}

export default runScraperProclama



