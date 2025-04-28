// backend/scraperEventos.js
import axios from 'axios'
import * as cheerio from 'cheerio'
import cron from 'node-cron'
import mongoose from 'mongoose'
import Evento from './models/evento.model.js'
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = process.env.MONGODB_URI

// Conectar a MongoDB una sola vez
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Scraper conectado a MongoDB'))
    .catch(err => console.error('❌ Error conectando MongoDB para Scraper', err))

// Esta función hará el scraping de ejemplo
const scrapEventos = async () => {
    try {
        console.log('🔎 Buscando eventos nuevos...')

        // Ejemplo de URL de noticias (¡cambiar luego por sitios reales!)
        const { data } = await axios.get('https://www.alertashumanitarias.org/noticias')
        const $ = cheerio.load(data)

        // Busca titulares de noticias
        $('.titulo-noticia').each(async (i, el) => {
            const titulo = $(el).text().trim()

            if (titulo.toLowerCase().includes('cauca') || titulo.toLowerCase().includes('atentado')) {
                // Si contiene palabras clave, registramos evento
                const nuevoEvento = new Evento({
                    municipio: 'Cauca (por determinar)', // Mejorarlo después
                    vereda: 'Zona Urbana',
                    tipo: 'Conflicto armado',
                    descripcion: titulo,
                    fecha: new Date().toLocaleDateString('es-CO'),
                    lat: 2.5,  // Coordenadas generales del Cauca
                    lng: -76.6
                })

                await nuevoEvento.save()
                console.log(`✅ Evento guardado: ${titulo}`)
            }
        })

    } catch (error) {
        console.error('❌ Error haciendo scraping:', error)
    }
}

// Configuramos cron para correr cada 30 minutos
cron.schedule('*/30 * * * *', () => {
    scrapEventos()
})

console.log('🛡️ Scraper inicializado. Buscando eventos cada 30 minutos...')
