import express from 'express'
import RiesgoAdicional from '../models/riesgoAdicional.model.js'
import auth from './auth.middleware.js'

const router = express.Router()

// Obtener todos los riesgos
router.get('/riesgos-adicionales', async (req, res) => {
    const riesgos = await RiesgoAdicional.find()
    res.json(datos)
})

// Reemplazar todos los riesgos (requiere auth)
router.post('/riesgos-adicionales', auth, async (req, res) => {
    const { data } = req.body
    if (!Array.isArray(data)) {
        return res.status(400).json({ error: 'Formato inválido' })
    }
    await RiesgoAdicional.deleteMany({})
    const insertados = await RiesgoAdicional.insertMany(data)
    res.json({ ok: true, insertados: insertados.length })
})

export default router
