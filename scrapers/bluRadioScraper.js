import axios from 'axios';
import * as cheerio from 'cheerio';
import { guardarEvento } from '../controllers/evento.controller.js';

export const scrapeBluRadio = async () => {
    try {
        console.log('🔍 Scrapeando Blu Radio Cauca...');

        const { data } = await axios.get('https://www.bluradio.com/cauca');
        const $ = cheerio.load(data);

        $('.ArticleList_item__Zjn4L').each((i, el) => {
            const titulo = $(el).find('h3').text().trim();
            const link = 'https://www.bluradio.com' + $(el).find('a').attr('href');

            if (titulo && link) {
                guardarEvento({
                    municipio: 'Cauca',
                    vereda: titulo,
                    tipo: 'Noticia',
                    descripcion: link,
                    fecha: new Date().toLocaleDateString('es-CO'),
                    lat: 2.5,
                    lng: -76.6
                });
            }
        });

        console.log('✅ Finalizó Blu Radio');
    } catch (error) {
        console.error('❌ Error scrapeando Blu Radio:', error.message);
    }
};
