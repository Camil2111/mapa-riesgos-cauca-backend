import axios from 'axios'
import * as cheerio from 'cheerio'
import { insertarEvento } from './utils/insertEvento.js'

const URL = 'https://www.elpais.com.co/judicial/'

const KEYWORDS = ['conflicto', 'violencia', 'disidencias', 'bloqueo', 'gao', 'explosión', 'atentado', 'armado', 'enfrentamiento']

const runScraperPaisValle = async () => {
    const eventos = []

    try {
        const { data } = await axios.get(URL)
        const $ = cheerio.load(data)

        const noticias = $('.listing__content')

        for (let i = 0; i < Math.min(noticias.length, 10); i++) {
            const elem = noticias[i]
            const title = $(elem).find('a').text().trim()
            const linkRel = $(elem).find('a').attr('href')
            if (!linkRel) continue

            const link = linkRel.startsWith('http') ? linkRel : 'https://www.elpais.com.co' + linkRel

            // Obtener contenido completo de la noticia
            let contenidoCompleto = ''
            try {
                const noticiaHtml = await axios.get(link, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                    }
                })
                const $$ = cheerio.load(noticiaHtml.data)
                contenidoCompleto = $$('p').text().toLowerCase()
            } catch (err) {
                console.warn('⚠️ No se pudo acceder a:', link)
                continue
            }

            // Detectar si contiene alguna palabra clave
            const textoTotal = `${title} ${contenidoCompleto}`.toLowerCase()
            const tags = KEYWORDS.filter(k => textoTotal.includes(k))

            if (tags.length > 0) {
                const evento = await insertarEvento({
                    municipio: 'No especificado',
                    departamento: 'VALLE DEL CAUCA',
                    nivel_riesgo: 'Moderado',
                    fecha: new Date(),
                    descripcion: title,
                    tipo: 'Noticia web',
                    fuente: 'El País Judicial',
                    vereda: 'No especificado',
                    tags,
                    lat: 3.45,
                    lng: -76.53,
                    link
                })

                if (evento) eventos.push(evento)
            }
        }

        return {
            fuente: 'El País Valle',
            insertados: eventos.length,
            detalles: eventos.map(e => e.descripcion)
        }
    } catch (err) {
        console.error('❌ Error en paisValleScraper:', err.message)
        return {
            fuente: 'El País Valle',
            insertados: 0,
            detalles: [],
            error: err.message
        }
    }
}

export default runScraperPaisValle


