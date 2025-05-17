// scrapers/botNoticias.js
import runGoogleNewsScraper from './googleNewsScraper.js';

const main = async () => {
    console.log('🤖 Iniciando bot inteligente de noticias...');

    try {
        console.log('🔍 Procesando Google News RSS...');
        const result = await runGoogleNewsScraper();

        if (result.insertados > 0) {
            console.log(`🧾 Google News RSS entregó ${result.insertados} noticias relevantes`);
            result.detalles.forEach((titulo, i) => {
                console.log(`  ${i + 1}. ${titulo}`);
            });
        } else {
            console.log('🧾 Google News RSS entregó 0 noticias relevantes');
        }
    } catch (err) {
        console.error('❌ Error en Google News RSS:', err.message);
    }

    console.log('✅ Bot finalizado');
};

main();

