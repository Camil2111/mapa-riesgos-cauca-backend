// scrapers/botNoticias.js
import insertEvento from './utils/insertEvento.js'
import googleNewsScraper from './googleNewsScraper.js'


const fuentes = [
    { nombre: 'Google News RSS', ejecutar: googleNewsScraper },
]

const botNoticias = async () => {
    console.log('🤖 Iniciando bot inteligente de noticias...')
    for (const fuente of fuentes) {
        try {
            console.log(`🔍 Procesando ${fuente.nombre}...`)
            const noticias = await fuente.ejecutar()
            console.log(`🧾 ${fuente.nombre} entregó ${noticias.length} noticias`)


            for (const noticia of noticias) {
                const texto = `${noticia.titulo} ${noticia.descripcion}`.toLowerCase()

                const esRelevante = [
                    'conflicto', 'secuestro', 'gao', 'farc', 'asesinan', 'capturan', 'eln', 'disidencias', 'enfrentamientos',
                    'desplazamiento', 'combates', 'ataque', 'marchas', 'bloqueos', 'ELN', 'explosion', 'atentado', 'paro', 'explosivo', 'presencia armada'
                ].some(palabra => texto.includes(palabra))

                console.log(`🔎 Evaluando noticia: ${noticia.titulo}`)
                console.log(`➡️ Texto analizado: ${texto}`)

                if (esRelevante) {
                    await insertEvento(noticia)
                    console.log(`✅ Insertado: ${noticia.titulo}`)
                } else {
                    console.log(`⏭️ Irrelevante: ${noticia.titulo}`)
                }
            }
        } catch (err) {
            console.error(`❌ Error en ${fuente.nombre}:`, err.message)
        }
    }
    console.log('✅ Bot finalizado')
}

botNoticias()
