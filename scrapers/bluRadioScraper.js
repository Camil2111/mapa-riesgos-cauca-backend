import axios from 'axios'
import * as cheerio from 'cheerio'
import { guardarEvento } from '../controllers/evento.controller.js'

export const scrapeBluRadio = async () => {
    try {
        console.log('🔍 Scrapeando Blu Radio Cauca...')

        const { data } = await axios.get('https://www.bluradio.com/nacion')
        const $ = cheerio.load(data)

        $('a.V_TitleCard-title').each((i, el) => {
            const titulo = $(el).text().trim()

            if (titulo.toLowerCase().includes('cauca')) {
                guardarEvento({
                    municipio: 'Cauca',
                    vereda: 'Desconocida',
                    tipo: 'Noticia',
                    descripcion: titulo,
                    fecha: new Date().toLocaleDateString('es-CO'),
                    lat: 2.5,
                    lng: -76.6
                })
            }
        })

        console.log('📌 Finalizó scrapeo de Blu Radio')
    } catch (error) {
        console.error('❌ Error scrapeando BluRadio:', error.message)
    }
}
