import axios from 'axios'
import * as cheerio from 'cheerio'
import Evento from '../models/evento.model.js'

const ciudadesAntioquia = [
    { ciudad: 'MEDELLÍN', lat: 6.2442, lng: -75.5812 },
    { ciudad: 'BELLO', lat: 6.3373, lng: -75.5584 },
    { ciudad: 'ITAGÜÍ', lat: 6.1719, lng: -75.611 },
    { ciudad: 'ENVIGADO', lat: 6.1709, lng: -75.5917 },
    { ciudad: 'APARTADÓ', lat: 7.8848, lng: -76.6422 },
    { ciudad: 'TURBO', lat: 8.0955, lng: -76.7283 },
    { ciudad: 'CAUCASIA', lat: 7.9862, lng: -75.1985 },
    { ciudad: 'RIONEGRO', lat: 6.1538, lng: -75.3747 },
    { ciudad: 'URABÁ', lat: 8.2447, lng: -76.5533 },
    { ciudad: 'BAJO CAUCA', lat: 7.9749, lng: -75.1916 },
    { ciudad: 'ORIENTE ANTIOQUEÑO', lat: 6.1167, lng: -75.4167 }
]

const runScraperMinuto30 = async () => {
    const url = 'https://www.minuto30.com/seccion/judicial/'

    try {
        const { data } = await axios.get(url)
        const $ = cheerio.load(data)
        const noticias = []

        $('div.masonry-item h3 a').each((i, el) => {
            const titulo = $(el).text().trim()
            const link = $(el).attr('href')
            if (titulo && link) {
                noticias.push({ titulo, link })
            }
        })

        for (let noticia of noticias.slice(0, 10)) {
            for (let ciudad of ciudadesAntioquia) {
                if (noticia.titulo.toUpperCase().includes(ciudad.ciudad)) {
                    const existe = await Evento.findOne({ descripcion: noticia.titulo })
                    if (!existe) {
                        await Evento.create({
                            municipio: ciudad.ciudad,
                            departamento: 'ANTIOQUIA',
                            nivel_riesgo: 'Alto',
                            fecha: new Date(),
                            descripcion: noticia.titulo,
                            vereda: 'No especificado',
                            tipo: 'Noticia',
                            lat: ciudad.lat,
                            lng: ciudad.lng
                        })
                        console.log(`✅ Noticia registrada para ${ciudad.ciudad}: ${noticia.titulo}`)
                    } else {
                        console.log(`ℹ️ Ya existe: ${noticia.titulo}`)
                    }
                }
            }
        }

        console.log('✅ Scraper Minuto30 Antioquia finalizado.')
    } catch (error) {
        console.error('❌ Error scraping Minuto30 Antioquia:', error.message)
    }
}

export default runScraperMinuto30

