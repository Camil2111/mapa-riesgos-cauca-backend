import cron from 'node-cron'
import { scrapeProclama } from '../scrapers/proclamaScraper.js'

// Ejecutar scraping cada 30 minutos
cron.schedule('*/30 * * * *', async () => {
    console.log('🕒 Ejecutando scraping programado...')
    await scrapeProclama()
})
