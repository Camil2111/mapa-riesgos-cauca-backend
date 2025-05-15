import express from 'express'
import mongoose from 'mongoose'
import auth from '../middleware/auth.js'

console.log('📥 [Render] Ruta riesgosAdicionales.routes.js CARGADA ✅')

const router = express.Router()

const RiesgoAdicional = mongoose.model(
    'RiesgoAdicional',
    new mongoose.Schema({}, { strict: false }),
    'riesgoadicionals'
)

router.get('/riesgos-adicionales', async (req, res) => {
    console.log('📡 [Render] Alguien accedió a /api/riesgos-adicionales')
    try {
        const riesgos = await RiesgoAdicional.find().limit(5)
        res.json(riesgos)
    } catch (error) {
        console.error('❌ Error al obtener riesgos:', error.message)
        res.status(500).json({ error: 'Error en el servidor' })
    }
})

router.post('/riesgos-adicionales', auth, async (req, res) => {
    try {
        const data = req.body.data
        if (!Array.isArray(data)) return res.status(400).json({ error: 'Formato inválido' })

        await RiesgoAdicional.deleteMany({})
        await RiesgoAdicional.insertMany(data)
        res.json({ mensaje: 'Datos reemplazados correctamente' })
    } catch (error) {
        console.error('❌ Error al guardar:', error.message)
        res.status(500).json({ error: 'No se pudo guardar' })
    }
})

export default router


