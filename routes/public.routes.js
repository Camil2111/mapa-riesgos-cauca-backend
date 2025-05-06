// routes/public.routes.js
import express from 'express'
import fs from 'fs'
import path from 'path'

const router = express.Router()

router.get('/public/datos-riesgos', (req, res) => {
    const filePath = path.join(process.cwd(), 'data', 'datos_riesgos.json')

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Archivo no encontrado' })
    }

    try {
        const data = fs.readFileSync(filePath, 'utf-8')
        res.json(JSON.parse(data))
    } catch (err) {
        console.error('❌ Error leyendo datos_riesgos.json:', err)
        res.status(500).json({ error: 'No se pudo leer el archivo de riesgos' })
    }
})

export default router

