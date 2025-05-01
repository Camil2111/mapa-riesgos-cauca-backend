import axios from 'axios'
import * as cheerio from 'cheerio'
import { guardarEvento } from '../controllers/evento.controller.js'

export const scrapeProclama = async () => {
    try {
        console.log('🔍 Scrapeando Proclama del Cauca...')

        const { data } = await axios.get('https://proclamadelcauca.com/seccion/noticias/')
        const $ = cheerio.load(data)

        $('.td-module-container').each((index, element) => {
            const titulo = $(element).find('.entry-title a').text().trim()
            const resumen = $(element).find('.td-excerpt').text().trim()

            if (titulo.toLowerCase().includes('cauca')) {
                guardarEvento({
                    municipio: 'Cauca',
                    vereda: titulo,
                    tipo: 'Noticia',
                    descripcion: resumen || 'Sin descripción',
                    fecha: new Date().toLocaleDateString('es-CO'),
                    lat: 2.5,
                    lng: -76.6
                })
            }
        })

        console.log('📌 Finalizó scrapeo de Proclama')
    } catch (error) {
        console.error('❌ Error scrapeando Proclama:', error.message)
    }
}
