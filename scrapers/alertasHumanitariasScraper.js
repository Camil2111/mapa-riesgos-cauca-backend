import axios from 'axios'
import Evento from '../models/evento.model.js'

const runScraperAlertas = async () => {
    const url = 'https://www.humanitarianresponse.info/es/operations/colombia/alerts'
    const { data } = await axios.get(url)

    // Esto depende del HTML real, aquí es un placeholder básico
    // Puedes ajustarlo con cheerio si el HTML lo permite

    const fechaHoy = new Date().toISOString().slice(0, 10)
    const titulo = `Alerta humanitaria emitida - ${fechaHoy}`

    const existe = await Evento.findOne({ descripcion: titulo })
    if (!existe) {
        await Evento.create({
            municipio: 'CAUCA',
            departamento: 'CAUCA',
            nivel_riesgo: 'Alto',
            fecha: new Date(),
            descripcion: titulo,
            vereda: 'No especificado',
            tipo: 'Alerta Humanitaria',
            lat: 2.44,
            lng: -76.61
        })
        console.log(`✅ Alerta humanitaria registrada (${fechaHoy})`)
    } else {
        console.log(`ℹ️ Ya existe alerta para hoy (${fechaHoy})`)
    }
}

export default runScraperAlertas


