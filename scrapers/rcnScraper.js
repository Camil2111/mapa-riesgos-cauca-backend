import axios from 'axios'
import * as cheerio from 'cheerio'
import Evento from '../models/evento.model.js'

const runScraperRCN = async () => {
    const url = 'https://www.rcnradio.com/colombia/pacifico'
    const { data } = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    })

    const $ = cheerio.load(data)
    const noticias = []

    $('.article-title a').each((i, el) => {
        const titulo = $(el).text().trim()
        const link = $(el).attr('href')
        if (titulo.toLowerCase().includes('cauca') && titulo && link) {
            noticias.push({ titulo, link })
        }
    })

    const guardados = []

    for (let noticia of noticias.slice(0, 5)) {
        const existe = await Evento.findOne({ descripcion: noticia.titulo })
        if (!existe) {
            const nuevo = await Evento.create({
                municipio: 'CAUCA',
                departamento: 'CAUCA',
                nivel_riesgo: 'Moderado',
                fecha: new Date(),
                descripcion: noticia.titulo,
                vereda: 'No especificado',
                tipo: 'Noticia',
                lat: 2.45,
                lng: -76.61
            })
            guardados.push(nuevo)
        }
    }

    console.log(`✅ RCN: revisadas ${noticias.length}, insertadas ${guardados.length}`)

    return {
        totalEncontradas: noticias.length,
        nuevasInsertadas: guardados.length,
        detalles: guardados.map(e => e.descripcion)
    }
}

export default runScraperRCN

