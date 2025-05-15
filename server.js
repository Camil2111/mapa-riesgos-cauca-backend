import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

// Rutas
import scrapingRoutes from './routes/scraping.routes.js'
import estadisticasRoutes from './routes/estadisticas.js'
import adminRoutes from './routes/admin.routes.js'
import publicRoutes from './routes/public.routes.js'
import riesgosMongoRoutes from './routes/riesgosMongo.routes.js'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

// Rutas API
app.use('/api', publicRoutes)
app.use('/api', adminRoutes)
app.use('/api', scrapingRoutes)
app.use('/api', estadisticasRoutes)
app.use('/api', riesgosMongoRoutes)

app.get('/api/prueba-riesgos', async (req, res) => {
    try {
        const mongoose = await import('mongoose')
        const RiesgoAdicional = mongoose.default.model('RiesgoAdicional', new mongoose.default.Schema({}, { strict: false }), 'riesgoadicionals')
        const riesgos = await RiesgoAdicional.find().limit(5)
        res.json(riesgos)
    } catch (error) {
        console.error('❌ Error en prueba directa:', error.message)
        res.status(500).json({ error: 'Error consultando riesgos directo' })
    }
})


// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`🚀 Servidor backend listo en puerto ${process.env.PORT || 3000}`)
        })
    })
    .catch(err => console.error('❌ Error conectando a MongoDB:', err.message))

// Ruta de prueba base
app.get('/', (req, res) => {
    res.send('🚀 Backend Mapa Riesgos activo')
})
