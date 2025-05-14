import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

// Rutas
import scrapingRoutes from './routes/scraping.routes.js'
import estadisticasRoutes from './routes/estadisticas.js'
import adminRoutes from './routes/admin.routes.js'
import publicRoutes from './routes/public.routes.js'
import riesgosAdicionalesRoutes from './routes/riesgosAdicionales.routes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => console.error('❌ Error conectando a MongoDB:', err))

// Rutas públicas y admin
app.use('/api', publicRoutes)
app.use('/api', adminRoutes)
app.use('/api', scrapingRoutes)
app.use('/api', estadisticasRoutes)
app.use('/api', riesgosAdicionalesRoutes)

// Ruta de prueba base
app.get('/', (req, res) => {
    res.send('🚀 Backend Mapa Riesgos activo')
})

// Escucha del servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
})
