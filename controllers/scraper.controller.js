import { scrapeProclama } from '../scrapers/proclamaScraper.js';
import { scrapeBluRadio } from '../scrapers/bluRadioScraper.js';
import { scrapeAlertasHumanitarias } from '../scrapers/alertasHumanitariasScraper.js';
// Agrega más scrapers si tienes otros

export const scrapEventos = async (req, res) => {
    try {
        console.log('🚨 Ejecutando scraping manual desde /api/scrap...');

        await scrapeProclama();
        await scrapeBluRadio();
        await scrapeAlertasHumanitarias();

        res.json({ mensaje: '✅ Scraping ejecutado correctamente' });
    } catch (err) {
        console.error('❌ Error ejecutando scraping:', err.message);
        res.status(500).json({ error: 'Error durante el scraping' });
    }
};
