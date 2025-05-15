import express from 'express'
import mongoose from 'mongoose'
import auth from '../middleware/auth.js'

console.log('✅ RUTA riesgosMongo.routes.js ACTIVADA')

const router = express.Router()

const RiesgoAdicional = mongoose.model(
    'RiesgoAdicional',
    new mongoose.Schema({}, { strict: false }),
    'riesgoadicionals'
)

router.get('/riesgos-adicionales', async (req, res) => {
    console.log('📡 GET /api/riesgos-adicionales ejecutado')
    const riesgos = await RiesgoAdicional.find().limit(5)
    res.json(riesgos)
})

export default router


