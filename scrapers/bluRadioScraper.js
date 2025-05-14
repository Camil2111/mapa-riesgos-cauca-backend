import axios from 'axios'
import * as cheerio from 'cheerio'
import { insertarEvento } from './utils/insertEvento.js'

const URL = 'https://www.bluradio.com/seccion/judicial'

const runScraperBluRadio = async () => {
    const eventos = []
    const { data } = await axios.get(URL)
    const $ = cheerio.load(data)

    $('article').each((_, elem) => {
        const title = $(elem).find('a').text().trim()
        const link = 'https://www.bluradio.com' + $(elem).find('a').attr('href')
        const texto = title.toLowerCase()
        const tags = ['conflicto', 'violencia', 'bloqueo', 'gao'].filter(k => texto.includes(k))

        if (tags.length > 0 && link) {
            insertarEvento({
                municipio: 'No especificado',
                departamento: 'CAUCA',
                nivel_riesgo: 'Moderado',
                fecha: new Date(),
                descripcion: title,
                tipo: 'Noticia web',
                fuente: 'Blu Radio Judicial',
                vereda: 'No especificado',
                tags,
                lat: 2.45,
                lng: -76.61,
                link
            }).then(evento => {
                if (evento) eventos.push(evento)
            })
        }
    })

    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                fuente: 'Blu Radio',
                insertados: eventos.length,
                detalles: eventos.map(e => e.descripcion)
            })
        }, 3000)
    })
}

export default runScraperBluRadio

