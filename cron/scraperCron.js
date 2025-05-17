// scrapers/cron.js
import cron from 'node-cron'
import runGoogleNewsScraper from '../scrapers/googleNewsScraper.js';


// Ejecutar bot inteligente cada 6 horas (ejemplo)
cron.schedule('0 */6 * * *', async () => {
    console.log('🤖 [CRON] Ejecutando bot de noticias...')

    try {
        const result = await runGoogleNewsScraper()
        console.log(`✅ [CRON] Insertadas ${result.insertados} noticias`)
    } catch (err) {
        console.error('❌ [CRON] Error ejecutando bot:', err.message)
    }
})
