import axios from 'axios'
import * as cheerio from 'cheerio'
import Evento from '../models/evento.model.js'

const runScraperPaisValle = async () => {
    const url = 'https://www.elpais.com.co/judicial'
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)
    const noticias = []

    $('a.card-noticia').each((i, el) => {
        const titulo = $(el).find('h2').text().trim()
        const link = $(el).attr('href')
        if (titulo && link && !link.includes('https')) {
            noticias.push({
                titulo,
                link: `https://www.elpais.com.co${link}`
            })
        }
    })

    for (let noticia of noticias.slice(0, 5)) {
        const existe = await Evento.findOne({ descripcion: noticia.titulo })
        if (!existe) {
            await Evento.create({
                municipio: 'CALI',
                departamento: 'VALLE DEL CAUCA',
                nivel_riesgo: 'Medio',
                fecha: new Date(),
                descripcion: noticia.titulo,
                vereda: 'No especificado',
                tipo: 'Noticia',
                lat: 3.4516,
                lng: -76.5320
            })
        }
    }

    console.log(`✅ El País Valle: revisadas ${noticias.length} noticias.`)
}

export default runScraperPaisValle
