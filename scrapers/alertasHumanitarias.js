import axios from 'axios'
import * as cheerio from 'cheerio'
import { guardarEvento } from '../controllers/evento.controller.js'

export const scrapeAlertas = async () => {
    try {
        console.log('🔍 Scrapeando Alertas Humanitarias...')

        const { data } = await axios.get('https://www.alertashumanitarias.org/noticias')
        const $ = cheerio.load(data)

        $('.titulo-noticia').each((i, el) => {
            const titulo = $(el).text().trim()

            if (titulo.toLowerCase().includes('cauca') || titulo.toLowerCase().includes('atentado')) {
                guardarEvento({
                    municipio: 'Cauca',
                    vereda: 'No especificado',
                    tipo: 'Alerta',
                    descripcion: titulo,
                    fecha: new Date().toLocaleDateString('es-CO'),
                    lat: 2.5,
                    lng: -76.6
                })
            }
        })

        console.log('📌 Finalizó scrapeo de Alertas Humanitarias')
    } catch (error) {
        console.error('❌ Error scrapeando Alertas Humanitarias:', error.message)
    }
}
