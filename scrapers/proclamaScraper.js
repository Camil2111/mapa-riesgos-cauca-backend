import axios from 'axios'
import * as cheerio from 'cheerio'
import Evento from '../models/evento.model.js';
import { guardarEvento } from '../controllers/evento.controller.js'

const runScraperProclama = async () => {
    const url = 'https://www.proclamadelpacifico.com/cauca/';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const noticias = [];

    $('.jeg_post_title a').each((i, el) => {
        const titulo = $(el).text().trim();
        const link = $(el).attr('href');

        if (titulo && link) {
            noticias.push({ titulo, link });
        }
    });

    for (let noticia of noticias.slice(0, 5)) {
        const existe = await Evento.findOne({ descripcion: noticia.titulo });
        if (!existe) {
            await Evento.create({
                municipio: 'CAUCA',
                departamento: 'CAUCA',
                nivel_riesgo: 'Medio',
                fecha: new Date(),
                descripcion: noticia.titulo,
                vereda: 'No especificado',
                tipo: 'Noticia',
                lat: 2.44,
                lng: -76.61
            });
        }
    }

    console.log(`✅ Se guardaron noticias de Proclama (${noticias.length})`);
};

module.exports = runScraperProclama;