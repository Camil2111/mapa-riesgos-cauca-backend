// backend/routes/scraping.routes.js
const express = require('express');
const router = express.Router();
const runScraperProclama = require('../scrapers/proclamaScraper');

router.get('/scrap/proclama', async (req, res) => {
    try {
        await runScraperProclama();
        res.json({ ok: true, message: 'Scraping ejecutado correctamente' });
    } catch (err) {
        console.error('❌ Error al ejecutar scraper:', err);
        res.status(500).json({ ok: false, error: 'Error ejecutando el scraper' });
    }
});

module.exports = router;
