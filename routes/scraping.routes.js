import express from 'express'

import runScraperProclama from '../scrapers/rcnScraper.js'
import runScraperBluRadio from '../scrapers/bluRadioScraper.js'
import runScraperAlertas from '../scrapers/alertasHumanitariasScraper.js'
import runScraperPaisValle from '../scrapers/paisValleScraper.js'
import runScraperMinuto30 from '../scrapers/minuto30Scraper.js'
import runScraperDiarioSur from '../scrapers/diarioSurScraper.js'
import runScraperRSS from '../scrapers/rssScraper.js'

const router = express.Router()

router.get('/scrap/proclama', async (req, res) => {
    await runScraperProclama()
    res.json({ ok: true, fuente: 'Proclama ejecutado' })
})

router.get('/scrap/bluradio', async (req, res) => {
    await runScraperBluRadio()
    res.json({ ok: true, fuente: 'Blu Radio ejecutado (multi-departamento)' })
})

router.get('/scrap/alertas', async (req, res) => {
    await runScraperAlertas()
    res.json({ ok: true, fuente: 'Alertas Humanitarias ejecutado' })
})

router.get('/scrap/valle', async (req, res) => {
    await runScraperPaisValle()
    res.json({ ok: true, fuente: 'El País Valle ejecutado' })
})

router.get('/scrap/antioquia', async (req, res) => {
    await runScraperMinuto30()
    res.json({ ok: true, fuente: 'Minuto30 ejecutado (Antioquia)' })
})

router.get('/scrap/narino', async (req, res) => {
    await runScraperDiarioSur()
    res.json({ ok: true, fuente: 'Diario del Sur ejecutado (Nariño)' })
})

router.get('/scrap/rss', async (req, res) => {
    try {
        const resultado = await runScraperRSS()
        res.json({ ok: true, ...resultado })
    } catch (error) {
        console.error('❌ Error ejecutando RSS scraper:', error)
        res.status(500).json({ ok: false, error: error.message })
    }
})

export default router
