import express from 'express';
import Evento from '../models/evento.model.js';
import runGoogleNewsScraper from '../scrapers/googleNewsScraper.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// 👉 Ejecutar el bot manualmente
router.post('/ejecutar', auth, async (req, res) => {
    try {
        const resultado = await runGoogleNewsScraper();
        res.json(resultado);
    } catch (err) {
        console.error('❌ Error ejecutando bot:', err.message);
        res.status(500).json({ message: 'Error ejecutando el bot' });
    }
});

// 👉 Últimas 10 noticias insertadas por el bot
router.get('/ultimas', auth, async (req, res) => {
    try {
        const eventos = await Evento.find({ tipo: 'Noticia Google News' })
            .sort({ fecha: -1 })
            .limit(10);
        res.json(eventos);
    } catch (err) {
        console.error('❌ Error obteniendo últimas noticias:', err.message);
        res.status(500).json({ message: 'Error consultando noticias' });
    }
});

// 👉 Cantidad de noticias por día (últimos 7 días)
router.get('/estadisticas', auth, async (req, res) => {
    try {
        const hace7 = new Date();
        hace7.setDate(hace7.getDate() - 7);

        const resultados = await Evento.aggregate([
            {
                $match: {
                    tipo: 'Noticia Google News',
                    fecha: { $gte: hace7 }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$fecha' }
                    },
                    total: { $sum: 1 }
                }
            },
            { $sort: { _id: -1 } }
        ]);

        res.json(resultados.map(r => ({
            fecha: r._id,
            total: r.total
        })));
    } catch (err) {
        console.error('❌ Error en estadística de bot:', err.message);
        res.status(500).json({ message: 'Error generando estadística' });
    }
});

export default router;
