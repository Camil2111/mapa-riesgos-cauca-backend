import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import riesgoRoutes from './routes/riesgo.routes.js';
import eventoRoutes from './routes/evento.routes.js';
import estadisticasRoutes from './routes/estadisticas.js';
import './cron/scraperCron.js'


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/riesgos';

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/riesgos', riesgoRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/estadisticas', estadisticasRoutes);

// Conexión a MongoDB y arranque del servidor
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Conectado a MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Error conectando a MongoDB:', err);
    });
