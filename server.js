import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import scrapingRoutes from './routes/scraping.routes.js'
import estadisticasRoutes from './routes/estadisticas.js'
import riesgoRoutes from './routes/riesgo.routes.js'
import riesgosAdicionalesRoutes from './routes/riesgosAdicionales.routes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Middleware de monitoreo (opcional)
app.use((req, res, next) => {
    console.log(`📩 ${req.method} ${req.path}`)
    next()
})

// Rutas
app.use('/api/scrapers', scrapingRoutes)
app.use('/api/estadisticas', estadisticasRoutes)
app.use('/api/riesgo', riesgoRoutes)
app.use('/api', riesgosAdicionalesRoutes)


// Conexión a Mongo y arranque
const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor escuchando en puerto ${PORT}`)
        })
    })
    .catch(err => console.error('❌ Error conectando a Mongo:', err))

