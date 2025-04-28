// routes/estadisticas.js
import express from 'express';
import Estadistica from '../models/estadistica.model.js'

const router = express.Router();

// Obtener todas las estadísticas (puedes limitar la cantidad)
router.get('/', async (req, res) => {
    try {
        const datos = await Estadistica.find().limit(100);
        res.json(datos);
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

// Obtener estadísticas filtradas por municipio
router.get('/municipio/:nombre', async (req, res) => {
    try {
        const nombre = req.params.nombre.toUpperCase();
        const datos = await Estadistica.find({ municipio: new RegExp(nombre, 'i') });
        res.json(datos);
    } catch (error) {
        console.error('Error al filtrar por municipio:', error);
        res.status(500).json({ error: 'Error al filtrar estadísticas' });
    }
});

// Obtener estadísticas por departamento
router.get('/departamento/:nombre', async (req, res) => {
    try {
        const nombre = req.params.nombre.toUpperCase();
        const datos = await Estadistica.find({ departamento: new RegExp(nombre, 'i') });
        res.json(datos);
    } catch (error) {
        console.error('Error al filtrar por departamento:', error);
        res.status(500).json({ error: 'Error al filtrar estadísticas' });
    }
});

export default router;
