import cron from 'node-cron'

import runScraperProclama from '../scrapers/rcnScraper.js'
import runScraperBluRadio from '../scrapers/bluRadioScraper.js'
import runScraperAlertas from '../scrapers/alertasHumanitariasScraper.js'
import runScraperPaisValle from '../scrapers/paisValleScraper.js'
import runScraperMinuto30 from '../scrapers/minuto30Scraper.js'
import runScraperDiarioSur from '../scrapers/diarioSurScraper.js'

// Ejecutar scraping cada 30 minutos
cron.schedule('*/30 * * * *', async () => {
    console.log('🕒 Ejecutando scraping programado...')

    try {
        await runScraperProclama()
        await runScraperBluRadio()
        await runScraperAlertas()
        await runScraperPaisValle()
        await runScraperMinuto30()
        await runScraperDiarioSur()

        console.log('✅ [CRON] Todos los scrapers ejecutados con éxito.')
    } catch (err) {
        console.error('❌ [CRON] Error ejecutando scrapers:', err)
    }
})
