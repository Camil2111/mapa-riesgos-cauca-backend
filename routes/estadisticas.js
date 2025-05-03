import express from 'express'
import Estadistica from '../models/estadistica.model.js'
import Evento from '../models/evento.model.js' // IMPORTACIÓN CORRECTA

const router = express.Router()

// GET: estadísticas básicas (las almacenadas manualmente o por carga)
router.get('/', async (req, res) => {
    try {
        const datos = await Estadistica.find().limit(100)
        res.json(datos)
    } catch (error) {
        console.error('❌ Error al obtener estadísticas básicas:', error)
        res.status(500).json({ error: 'Error al obtener estadísticas' })
    }
})

// POST: para recibir estadísticas nuevas (desde JSON o script)
router.post('/', async (req, res) => {
    try {
        const nueva = await Estadistica.create(req.body)
        res.status(201).json(nueva)
    } catch (error) {
        console.error('❌ Error al crear estadística:', error)
        res.status(500).json({ error: 'Error al guardar estadística' })
    }
})

// GET /api/estadisticas/dinamicas: generar estadísticas agrupadas desde eventos
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

