// routes/riesgosAdicionales.routes.js
import express from 'express'
import RiesgoAdicional from '../models/riesgoAdicional.model.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// GET público para cargar riesgos desde MongoDB
router.get('/riesgos-adicionales', async (req, res) => {
    try {
        const riesgos = await RiesgoAdicional.find()
        res.json(riesgos)
    } catch (error) {
        console.error('❌ Error al obtener riesgos adicionales:', error.message)
        res.status(500).json({ error: 'No se pudieron cargar los datos' })
    }
})

// POST protegido para actualizar todos los riesgos
router.post('/riesgos-adicionales', auth, async (req, res) => {
    try {
        const nuevos = req.body.data

        if (!Array.isArray(nuevos)) {
            return res.status(400).json({ error: 'Formato inválido' })
        }

        await RiesgoAdicional.deleteMany({})
        await RiesgoAdicional.insertMany(nuevos)

        res.json({ ok: true, mensaje: 'Riesgos actualizados en MongoDB' })
    } catch (error) {
        console.error('❌ Error al guardar riesgos:', error.message)
        res.status(500).json({ error: 'Error al guardar riesgos' })
    }
})

export default router

