import axios from 'axios';
import * as cheerio from 'cheerio';
import { guardarEvento } from '../controllers/evento.controller.js';

export const scrapeAlertasHumanitarias = async () => {
    try {
        console.log('🔍 Scrapeando Alertas Humanitarias...');

        const { data } = await axios.get('https://www.alertashumanitarias.org/noticias');
        const $ = cheerio.load(data);

        $('.titulo-noticia').each(async (i, el) => {
            const titulo = $(el).text().trim();

            if (titulo.toLowerCase().includes('cauca') || titulo.toLowerCase().includes('atentado')) {
                await guardarEvento({
                    municipio: 'Cauca (por confirmar)',
                    vereda: 'Zona Urbana',
                    tipo: 'Conflicto armado',
                    descripcion: titulo,
                    fecha: new Date().toLocaleDateString('es-CO'),
                    lat: 2.5,
                    lng: -76.6
                });
                console.log(`✅ Guardado: ${titulo}`);
            }
        });

        console.log('✅ Finalizó Alertas Humanitarias');
    } catch (err) {
        console.error('❌ Error scrapeando Alertas Humanitarias:', err.message);
    }
};
