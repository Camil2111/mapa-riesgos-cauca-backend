import express from 'express'
import mongoose from 'mongoose'

console.log('📥 CARGADA testRiesgos.routes.js ✅')

const router = express.Router()

const RiesgoAdicional = mongoose.model(
    'RiesgoAdicional',
    new mongoose.Schema({}, { strict: false }),
    'riesgoadicionals'
)

router.get('/riesgos-adicionales', async (req, res) => {
    console.log('📡 GET /api/riesgos-adicionales ejecutado ✅')
    try {
        const riesgos = await RiesgoAdicional.find().limit(5)
        res.json(riesgos)
    } catch (error) {
        console.error('❌ Error:', error.message)
        res.status(500).json({ error: 'Error al consultar riesgos' })
    }
})

export default router

