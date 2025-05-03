import express from 'express'
import Estadistica from '../models/estadistica.model.js'
import Evento from '../models/evento.model.js'

const router = express.Router()

// RUTA SEGURA: /api/estadisticas → devuelve lo que ya tenías
router.get('/', async (req, res) => {
    try {
        const datos = await Estadistica.find().limit(100)
        res.json(datos)
    } catch (error) {
        console.error('❌ Error al obtener estadísticas básicas:', error)
        res.status(500).json({ error: 'Error al obtener estadísticas' })
    }
})

// RUTA NUEVA: /api/estadisticas/dinamicas → genera desde eventos
router.get('/dinamicas', async (req, res) => {
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
        console.error('❌ Error generando estadísticas dinámicas:', error)
        res.status(500).json({ error: 'Error generando estadísticas dinámicas' })
    }
})

export default router

