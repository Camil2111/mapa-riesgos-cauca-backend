// backend/scrapers/index.js
import { scrapeProclama } from './proclamaScraper.js'
import { scrapeBluRadio } from './bluRadioScraper.js'
// import { scrapeOtro } from './otroScraper.js' // si agregás más

export const ejecutarScrapers = async () => {
    console.log('🚨 Ejecutando todos los scrapers...')
    await scrapeProclama()
    await scrapeBluRadio()
    console.log('✅ Todos los scrapers finalizados.')
}
