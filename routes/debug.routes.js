import express from 'express';
import Estadistica from '../models/estadistica.model.js';

const router = express.Router();

// ⚠️ Ruta de depuración: elimina TODAS las estadísticas
router.get('/borrar-estadisticas', async (req, res) => {
    try {
        const result = await Estadistica.deleteMany({});
        console.log(`🧹 ${result.deletedCount} estadísticas eliminadas.`);
        res.send('🧹 Estadísticas eliminadas.');
    } catch (error) {
        console.error('❌ Error al borrar estadísticas:', error);
        res.status(500).send('Error al borrar estadísticas.');
    }
});

export default router;
