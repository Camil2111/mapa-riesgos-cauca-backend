import express from 'express'
import mongoose from 'mongoose'
import auth from './auth.middleware.js' // ⚠️ Ajustá si tu middleware está en otra ruta

console.log('📥 CARGADA testRiesgos.routes.js ✅')

const router = express.Router()

const RiesgoAdicional = mongoose.model(
    'RiesgoAdicional',
    new mongoose.Schema({}, { strict: false }),
    'riesgoadicionals'
)

// ✅ GET: Obtener riesgos
router.get('/riesgos-adicionales', async (req, res) => {
    console.log('📡 GET /api/riesgos-adicionales ejecutado ✅')
    try {
        const riesgos = await RiesgoAdicional.find()
        res.json(riesgos)
    } catch (error) {
        console.error('❌ Error al consultar:', error.message)
        res.status(500).json({ error: 'Error al consultar riesgos' })
    }
})

// ✅ POST: Guardar riesgos
router.post('/riesgos-adicionales', auth, async (req, res) => {
    console.log('📨 POST /api/riesgos-adicionales ejecutado')
    console.log('🛡️ Token recibido:', req.headers.authorization)
    console.log('📦 Tipo de datos recibidos:', typeof req.body, '| Array:', Array.isArray(req.body))

    try {
        const data = req.body

        if (!Array.isArray(data)) {
            console.warn('❌ No se recibió un array válido')
            return res.status(400).json({ error: '❌ Formato inválido. Se esperaba un array.' })
        }

        await RiesgoAdicional.deleteMany({})
        await RiesgoAdicional.insertMany(data)

        console.log(`✅ Guardados ${data.length} riesgos en MongoDB`)
        res.json({ mensaje: '✅ Datos actualizados correctamente' })
    } catch (error) {
        console.error('❌ Error al guardar riesgos:', error.message)
        res.status(500).json({ error: 'Error guardando riesgos' })
    }
})

export default router


