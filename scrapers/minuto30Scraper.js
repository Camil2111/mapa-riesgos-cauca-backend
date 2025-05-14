import axios from 'axios'
import * as cheerio from 'cheerio'
import { insertarEvento } from './utils/insertEvento.js'

const URL = 'https://www.minuto30.com/seccion/judicial/'

const runScraperMinuto30 = async () => {
    const eventos = []
    const { data } = await axios.get(URL, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
        }
    })

    const $ = cheerio.load(data)

    $('article').each((_, elem) => {
        const title = $(elem).find('h3 a').text().trim()
        const link = $(elem).find('h3 a').attr('href')

        const texto = title.toLowerCase()
        const palabrasClave = ['conflicto', 'violencia', 'disidencia', 'bloqueo', 'enfrentamiento', 'gao', 'armado']
        const tags = palabrasClave.filter(k => texto.includes(k))

        if (tags.length > 0 && link) {
            insertarEvento({
                municipio: 'No especificado',
                departamento: 'ANTIOQUIA',
                nivel_riesgo: 'Moderado',
                fecha: new Date(),
                descripcion: title,
                tipo: 'Noticia web',
                fuente: 'Minuto30 Judicial',
                vereda: 'No especificado',
                tags,
                lat: 6.25,
                lng: -75.56,
                link
            }).then(evento => {
                if (evento) eventos.push(evento)
            })
        }
    })

    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                fuente: 'Minuto30 Judicial',
                insertados: eventos.length,
                detalles: eventos.map(e => e.descripcion)
            })
        }, 3000) // espera breve para que termine el .then()
    })
}

export default runScraperMinuto30


