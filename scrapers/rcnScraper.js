import axios from 'axios'
import * as cheerio from 'cheerio'
import { insertarEvento } from './utils/insertEvento.js'

const URL = 'https://proclamadelcauca.com/category/judiciales/'

const runScraperProclama = async () => {
    const eventos = []
    const { data } = await axios.get(URL)
    const $ = cheerio.load(data)

    $('.jeg_postblock_content').each((_, elem) => {
        const title = $(elem).find('.jeg_post_title a').text().trim()
        const link = $(elem).find('.jeg_post_title a').attr('href')
        const texto = title.toLowerCase()
        const tags = ['conflicto', 'violencia', 'bloqueo', 'gao', 'armado'].filter(k => texto.includes(k))

        if (tags.length > 0 && link) {
            insertarEvento({
                municipio: 'No especificado',
                departamento: 'CAUCA',
                nivel_riesgo: 'Moderado',
                fecha: new Date(),
                descripcion: title,
                tipo: 'Noticia web',
                fuente: 'Proclama del Cauca',
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
                fuente: 'Proclama del Cauca',
                insertados: eventos.length,
                detalles: eventos.map(e => e.descripcion)
            })
        }, 3000)
    })
}

export default runScraperProclama


