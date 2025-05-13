import express from 'express'
import Evento from '../models/evento.model.js'

const router = express.Router()

// Ruta para buscar riesgo por ciudad (de uso opcional)
router.get('/:ciudad', async (req, res) => {
    try {
        const ciudad = req.params.ciudad
        const resultado = await Evento.findOne({
            municipio: new RegExp(ciudad, 'i')
        })

        if (!resultado) {
            return res.status(404).json({ error: 'No hay datos para esta ciudad.' })
        }

        res.json(resultado)
    } catch (error) {
        console.error('❌ Error consultando riesgo:', error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
})

export default router

