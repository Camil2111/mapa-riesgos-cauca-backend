import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import riesgoRoutes from './routes/riesgo.routes.js';
import eventoRoutes from './routes/evento.routes.js';
import estadisticasRoutes from './routes/estadisticas.js';
import scrapingRoutes from './routes/scraping.routes.js';

import './cron/scraperCron.js'; // Ejecuta scrapers periódicamente

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ MONGO_URI no está definido en las variables de entorno.');
    process.exit(1);
}

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/riesgos', riesgoRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/estadisticas', estadisticasRoutes);
app.use('/api', scrapingRoutes);

// Conexión y arranque del servidor
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('✅ Conectado a MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Error conectando a MongoDB:', err);
        process.exit(1);
    });

// Ruta raíz (solo para ver que el backend está vivo)
app.get('/', (req, res) => {
    res.send('🛡️ Backend API de Monitoreo de Riesgos en línea. Usa /api/eventos, /api/riesgos o /api/scrap');
});

