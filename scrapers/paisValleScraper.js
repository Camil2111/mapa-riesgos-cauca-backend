import axios from 'axios'
import * as cheerio from 'cheerio'
import { insertarEvento } from './utils/insertEvento.js'

const URL = 'https://www.elpais.com.co/judicial/'

const runScraperPaisValle = async () => {
    const eventos = []
    const { data } = await axios.get(URL)
    const $ = cheerio.load(data)

    $('.listing__content').each((_, elem) => {
        const title = $(elem).find('a').text().trim()
        const link = 'https://www.elpais.com.co' + $(elem).find('a').attr('href')
        const texto = title.toLowerCase()
        const tags = ['conflicto', 'violencia', 'bloqueo', 'gao'].filter(k => texto.includes(k))

        if (tags.length > 0 && link) {
            insertarEvento({
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
            }).then(evento => {
                if (evento) eventos.push(evento)
            })
        }
    })

    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                fuente: 'El País Valle',
                insertados: eventos.length,
                detalles: eventos.map(e => e.descripcion)
            })
        }, 3000)
    })
}

export default runScraperPaisValle

