// backend/routes/riesgo.routes.js
import express from 'express'
import Riesgo from '../models/riesgo.model.js'

const router = express.Router()

// Ruta para obtener todos los riesgos
router.get('/', async (req, res) => {
    try {
        const riesgos = await Riesgo.find()
        res.json(riesgos)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los datos' })
    }
})

// Ruta para filtrar por municipio
router.get('/:municipio', async (req, res) => {
    try {
        const { municipio } = req.params
        const riesgos = await Riesgo.find({ municipio: { $regex: new RegExp(municipio, 'i') } })
        res.json(riesgos)
    } catch (err) {
        res.status(500).json({ message: 'Error al filtrar los datos' })
    }
})

export default router
