import express from 'express'
import mongoose from 'mongoose'

console.log('📥 CARGADA testRiesgos.routes.js ✅')

const router = express.Router()

const RiesgoAdicional = mongoose.model(
    'RiesgoAdicional',
    new mongoose.Schema({}, { strict: false }),
    'riesgoadicionals'
)

router.get('/riesgos-prueba', async (req, res) => {
    console.log('📡 GET /api/riesgos-prueba ejecutado ✅')
    const riesgos = await RiesgoAdicional.find().limit(3)
    res.json(riesgos)
})

export default router
