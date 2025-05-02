import axios from 'axios'
import * as cheerio from 'cheerio'
import Evento from '../models/evento.model.js'

const runScraperDiarioSur = async () => {
    const url = 'https://diariodelsur.com.co/seccion/judicial'
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)
    const noticias = []

    $('div.views-row h2 a').each((i, el) => {
        const titulo = $(el).text().trim()
        const link = $(el).attr('href')
        if (titulo && link) {
            noticias.push({
                titulo,
                link: link.startsWith('http') ? link : `https://diariodelsur.com.co${link}`
            })
        }
    })

    for (let noticia of noticias.slice(0, 5)) {
        const existe = await Evento.findOne({ descripcion: noticia.titulo })
        if (!existe) {
            await Evento.create({
                municipio: 'PASTO',
                departamento: 'NARIÑO',
                nivel_riesgo: 'Medio',
                fecha: new Date(),
                descripcion: noticia.titulo,
                vereda: 'No especificado',
                tipo: 'Noticia',
                lat: 1.2136,
                lng: -77.2811
            })
        }
    }

    console.log(`✅ Diario del Sur (Nariño): revisadas ${noticias.length} noticias.`)
}

export default runScraperDiarioSur
