// routes/debug.routes.js
import express from 'express'
import Estadistica from '../models/estadistica.model.js'

const router = express.Router()

router.delete('/borrar-estadisticas', async (req, res) => {
    try {
        await Estadistica.deleteMany({})
        res.send('🧹 Estadísticas eliminadas.')
    } catch (error) {
        res.status(500).send('💥 Error eliminando estadísticas')
    }
})

export default router
