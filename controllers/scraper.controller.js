// scraper.controller.js
import runGoogleNewsScraper from '../scrapers/googleNewsScraper.js';

export const scrapEventos = async (req, res) => {
    try {
        console.log('🚨 Ejecutando scraping manual desde /api/scrap...');

        const resultado = await runGoogleNewsScraper();

        res.json({
            mensaje: `✅ Bot ejecutado: ${resultado.insertados} noticias insertadas.`,
            detalles: resultado.detalles
        });
    } catch (err) {
        console.error('❌ Error ejecutando scraping:', err.message);
        res.status(500).json({ error: 'Error durante el scraping' });
    }
};
