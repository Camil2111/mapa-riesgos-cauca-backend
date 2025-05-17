// backend/scrapers/index.js
import runGoogleNewsScraper from './googleNewsScraper.js';

export const ejecutarScrapers = async () => {
    console.log('🚨 Ejecutando bot de Google News...');
    const resultado = await runGoogleNewsScraper();
    console.log(`✅ Bot finalizado. Noticias insertadas: ${resultado.insertados}`);
};
