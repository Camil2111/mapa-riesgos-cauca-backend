import axios from 'axios'
import * as cheerio from 'cheerio'
import Evento from '../models/evento.model.js'

const departamentos = [
    {
        nombre: 'CAUCA',
        url: 'https://www.bluradio.com/nacion/region/cauca',
        municipio: 'POPAYÁN',
        lat: 2.4419,
        lng: -76.6069,
        nivel_riesgo: 'Medio'
    },
    {
        nombre: 'VALLE DEL CAUCA',
        url: 'https://www.bluradio.com/nacion/region/valle-del-cauca',
        municipio: 'CALI',
        lat: 3.4516,
        lng: -76.5320,
        nivel_riesgo: 'Medio'
    },
    {
        nombre: 'NARIÑO',
        url: 'https://www.bluradio.com/nacion/region/narino',
        municipio: 'PASTO',
        lat: 1.2136,
        lng: -77.2811,
        nivel_riesgo: 'Medio'
    },
    {
        nombre: 'ANTIOQUIA',
        url: 'https://www.bluradio.com/nacion/region/antioquia',
        municipio: 'MEDELLÍN',
        lat: 6.2442,
        lng: -75.5812,
        nivel_riesgo: 'Alto'
    },
    {
        nombre: 'RISARALDA',
        url: 'https://www.bluradio.com/nacion/region/risaralda',
        municipio: 'PEREIRA',
        lat: 4.8087,
        lng: -75.6906,
        nivel_riesgo: 'Bajo'
    },
    {
        nombre: 'QUINDÍO',
        url: 'https://www.bluradio.com/nacion/region/quindio',
        municipio: 'ARMENIA',
        lat: 4.5339,
        lng: -75.6811,
        nivel_riesgo: 'Bajo'
    }
]

const runScraperBluRadio = async () => {
    for (let dep of departamentos) {
        try {
            const { data } = await axios.get(dep.url)
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

            for (let noticia of noticias.slice(0, 3)) {
                const existe = await Evento.findOne({ descripcion: noticia.titulo })
                if (!existe) {
                    await Evento.create({
                        municipio: dep.municipio,
                        departamento: dep.nombre,
                        nivel_riesgo: dep.nivel_riesgo,
                        fecha: new Date(),
                        descripcion: noticia.titulo,
                        vereda: 'No especificado',
                        tipo: 'Noticia',
                        lat: dep.lat,
                        lng: dep.lng
                    })
                }
            }

            console.log(`✅ BluRadio ${dep.nombre}: revisadas ${noticias.length} noticias.`)
        } catch (err) {
            console.error(`❌ Error scraping BluRadio ${dep.nombre}:`, err.message)
        }
    }
}

export default runScraperBluRadio
