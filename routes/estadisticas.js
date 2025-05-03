import express from 'express'
import Evento from '../models/evento.model.js'

const router = express.Router()

// GET /api/estadisticas?municipio=Popayán&departamento=Cauca&desde=2024-01-01&hasta=2025-01-01
router.get('/', async (req, res) => {
    try {
        const { municipio, departamento, desde, hasta } = req.query

        const filtro = {}

        if (municipio) filtro.municipio = new RegExp(municipio, 'i')
        if (departamento) filtro.departamento = new RegExp(departamento, 'i')
        if (desde || hasta) {
            filtro.fecha = {}
            if (desde) filtro.fecha.$gte = new Date(desde)
            if (hasta) filtro.fecha.$lte = new Date(hasta)
        }

        const resultados = await Evento.aggregate([
            { $match: filtro },
            {
                $project: {
                    municipio: 1,
                    tipo: 1,
                    fecha: 1,
                    mes: { $dateToString: { format: "%Y-%m", date: "$fecha" } }
                }
            },
            {
                $group: {
                    _id: {
                        municipio: "$municipio",
                        tipo: "$tipo",
                        mes: "$mes"
                    },
                    cantidad: { $sum: 1 }
                }
            },
            {
                $project: {
                    municipio: "$_id.municipio",
                    tipo: "$_id.tipo",
                    mes: "$_id.mes",
                    cantidad: 1,
                    _id: 0
                }
            }
        ])

        res.json(resultados)
    } catch (error) {
        console.error('❌ Error generando estadísticas:', error)
        res.status(500).json({ error: 'Error generando estadísticas' })
    }
})

export default router
