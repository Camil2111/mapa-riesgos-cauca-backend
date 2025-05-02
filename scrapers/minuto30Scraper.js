import axios from 'axios'
import * as cheerio from 'cheerio'
import Evento from '../models/evento.model.js'

const runScraperMinuto30 = async () => {
    const url = 'https://www.minuto30.com/seccion/judicial/'
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

    for (let noticia of noticias.slice(0, 5)) {
        const existe = await Evento.findOne({ descripcion: noticia.titulo })
        if (!existe) {
            await Evento.create({
                municipio: 'MEDELLÍN',
                departamento: 'ANTIOQUIA',
                nivel_riesgo: 'Alto',
                fecha: new Date(),
                descripcion: noticia.titulo,
                vereda: 'No especificado',
                tipo: 'Noticia',
                lat: 6.2442,
                lng: -75.5812
            })
        }
    }

    console.log(`✅ Minuto30 Antioquia: revisadas ${noticias.length} noticias.`)
}

export default runScraperMinuto30
