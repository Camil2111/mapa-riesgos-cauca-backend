import axios from 'axios'
import * as cheerio from 'cheerio'
import Evento from '../models/evento.model.js'

const palabrasClave = [
    { nombre: 'CAUCA', ciudad: 'POPAYÁN', lat: 2.4419, lng: -76.6069, riesgo: 'Medio' },
    { nombre: 'VALLE DEL CAUCA', ciudad: 'CALI', lat: 3.4516, lng: -76.5320, riesgo: 'Medio' },
    { nombre: 'NARIÑO', ciudad: 'PASTO', lat: 1.2136, lng: -77.2811, riesgo: 'Medio' },
    { nombre: 'ANTIOQUIA', ciudad: 'MEDELLÍN', lat: 6.2442, lng: -75.5812, riesgo: 'Alto' },
    { nombre: 'RISARALDA', ciudad: 'PEREIRA', lat: 4.8087, lng: -75.6906, riesgo: 'Bajo' },
    { nombre: 'QUINDÍO', ciudad: 'ARMENIA', lat: 4.5339, lng: -75.6811, riesgo: 'Bajo' }
]

const runScraperBluRadio = async () => {
    const url = 'https://www.bluradio.com/nacion'
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)
    const noticias = []

    $('a.article-title').each((i, el) => {
        const titulo = $(el).text().trim()
        const link = $(el).attr('href')
        if (titulo && link) {
            noticias.push({
                titulo,
                link: link.startsWith('http') ? link : `https://www.bluradio.com${link}`
            })
        }
    })

    for (let noticia of noticias.slice(0, 10)) {
        for (let dep of palabrasClave) {
            if (noticia.titulo.toUpperCase().includes(dep.nombre) || noticia.titulo.toUpperCase().includes(dep.ciudad)) {
                const existe = await Evento.findOne({ descripcion: noticia.titulo })
                if (!existe) {
                    await Evento.create({
                        municipio: dep.ciudad,
                        departamento: dep.nombre,
                        nivel_riesgo: dep.riesgo,
                        fecha: new Date(),
                        descripcion: noticia.titulo,
                        vereda: 'No especificado',
                        tipo: 'Noticia',
                        lat: dep.lat,
                        lng: dep.lng
                    })
                    console.log(`✅ Noticia registrada para ${dep.nombre}: ${noticia.titulo}`)
                }
            }
        }
    }

    console.log('✅ Scraper BluRadio finalizado.')
}

export default runScraperBluRadio

