// backend/routes/scraping.routes.js
import express from 'express';
import { scrapEventos } from '../controllers/scraper.controller.js';

const router = express.Router();

// Permite activar el scraping manualmente desde GET o POST
router.get('/scrap', scrapEventos);
router.post('/scrap', scrapEventos);

export default router;
