import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import riesgoRoutes from './routes/riesgo.routes.js';
import eventoRoutes from './routes/evento.routes.js';
import estadisticasRoutes from './routes/estadisticas.js';
import './cron/scraperCron.js'

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/riesgos'; // 👈 corregido aquí

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/riesgos', riesgoRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/estadisticas', estadisticasRoutes);

// Conexión a MongoDB y arranque del servidor
await mongoose.connect(MONGO_URI) // 👈 corregido aquí
    .then(() => {
        console.log('✅ Conectado a MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Error conectando a MongoDB:', err);
    });
