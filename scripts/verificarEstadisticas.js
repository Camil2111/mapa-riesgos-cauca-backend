// scripts/verificarEstadisticas.js
import mongoose from 'mongoose';
import Estadistica from '../models/Estadistica.js';

mongoose.connect('mongodb://localhost:27017/riesgos')
    .then(async () => {
        const total = await Estadistica.countDocuments();
        const ejemplo = await Estadistica.find().limit(5);

        console.log(`📦 Total de registros: ${total}`);
        console.log('📝 Primeros registros:');
        console.table(ejemplo.map(e => ({
            municipio: e.municipio,
            departamento: e.departamento,
            delito: e.delito,
            fecha: e.fecha.toISOString().split('T')[0],
        })));

        process.exit();
    })
    .catch(err => {
        console.error('💥 Error consultando MongoDB:', err);
        process.exit(1);
    });
