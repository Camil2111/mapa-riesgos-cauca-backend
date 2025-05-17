// backend/routes/evento.routes.js

import express from 'express'
import Evento from '../models/evento.model.js'

const router = express.Router()

// 👉 Obtener todos los eventos (ordenados por fecha descendente)
router.get('/', async (req, res) => {
    try {
        const { departamento, municipio } = req.query
        const query = {}

        if (departamento) {
            query.departamento = new RegExp(`^${departamento}$`, 'i') // busca sin importar mayúsculas
        }

        if (municipio) {
            query.municipio = new RegExp(`^${municipio}$`, 'i')
        }

        const eventos = await Evento.find(query).sort({ fecha: -1 }).limit(100)
        res.json(eventos)
    } catch (error) {
        console.error('❌ Error obteniendo eventos:', error)
        res.status(500).json({ message: 'Error al obtener eventos' })
    }
})


// 👉 Agregar un nuevo evento
router.post('/', async (req, res) => {
    try {
        const nuevoEvento = new Evento(req.body)
        const eventoGuardado = await nuevoEvento.save()
        res.status(201).json(eventoGuardado)
    } catch (error) {
        console.error('❌ Error creando evento:', error)
        res.status(400).json({ message: 'Datos inválidos para crear evento', details: error.message })
    }
})

export default router

