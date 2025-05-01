// backend/routes/scraping.routes.js
import express from 'express'
import { ejecutarScrapers } from '../scrapers/index.js'

const router = express.Router()

router.get('/scrap', async (req, res) => {
    try {
        console.log('🚨 Ejecutando scrapers manualmente desde /api/scrap...')
        await ejecutarScrapers()
        res.status(200).json({ mensaje: '✅ Scraping ejecutado correctamente.' })
    } catch (error) {
        console.error('❌ Error en scraping:', error)
        res.status(500).json({ error: 'Error ejecutando scraping' })
    }
})

export default router
