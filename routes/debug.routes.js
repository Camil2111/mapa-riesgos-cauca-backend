import express from 'express'
import runScraperRCN from '../scrapers/rcnScraper.js'
import runScraperRSS from '../scrapers/rssScraper.js'

const router = express.Router()

// 🧪 Probar scraper de RCN Pacífico
router.get('/ejecutar-rss', async (req, res) => {
    try {
        const resultado = await runScraperRSS()
        res.json(resultado)
    } catch (err) {
        console.error('❌ Error en RSS scraper:', err)
        res.status(500).json({ error: err.message })
    }
})

// 🧪 Verificar que el sistema esté en línea
router.get('/salud', (req, res) => {
    res.json({
        mensaje: '✅ Ruta /debug activa y lista',
        hora: new Date().toLocaleString(),
    })
})

export default router


