// backend/scrapers/index.js
import { scrapeProclama } from './proclamaScraper.js'
import { scrapeBluRadio } from './bluRadioScraper.js'
import { scrapeAlertas } from './alertasHumanitariasScraper.js'

export const ejecutarScrapers = async () => {
    console.log('🚨 Ejecutando todos los scrapers...')
    await scrapeProclama()
    await scrapeBluRadio()
    await scrapeAlertas()
    console.log('✅ Todos los scrapers finalizados.')
}
