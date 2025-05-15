import express from 'express'
import mongoose from 'mongoose'
import auth from './auth.middleware.js' // Asegúrate que esta ruta esté correcta

console.log('📥 CARGADA testRiesgos.routes.js ✅')

const router = express.Router()

// Modelo RiesgoAdicional sin schema estricto
const RiesgoAdicional = mongoose.model(
    'RiesgoAdicional',
    new mongoose.Schema({}, { strict: false }),
    'riesgoadicionals'
)

// ✅ GET: Obtener todos los riesgos
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

// ✅ POST: Sobrescribir los riesgos con token
router.post('/riesgos-adicionales', auth, async (req, res) => {
    try {
        const data = req.body

        if (!Array.isArray(data)) {
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


