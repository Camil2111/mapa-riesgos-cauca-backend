// scrapers/utils/insertEvento.js
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Evento from '../../models/evento.model.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// Conexión única a MongoDB
let conectado = false
async function conectar() {
    if (!conectado) {
        await mongoose.connect(process.env.MONGO_URI)
        conectado = true
    }
}

// Función para insertar evento
export default async function insertEvento(data) {
    await conectar()

    // Evitar duplicados
    const existe = await Evento.findOne({ idNoticia: data.idNoticia })
    if (existe) {
        console.log(`⚠️ Noticia ya existe: ${data.titulo}`)
        return null
    }

    // Validación mínima
    if (!data.municipio || !data.departamento || !data.fecha) {
        console.warn('❌ Evento inválido. Falta municipio, departamento o fecha.')
        return
    }

    // Insertar evento
    await Evento.create({
        idNoticia: data.idNoticia,
        titulo: data.titulo,
        descripcion: data.descripcion,
        tipo: data.tipo || 'sin clasificar',
        fecha: new Date(data.fecha),
        municipio: data.municipio,
        departamento: data.departamento,
        lat: data.lat,
        lng: data.lng,
        vereda: data.vereda || 'No especificado',
        tags: data.tags || [],
        fuente: data.fuente || 'desconocida',
        link: data.link || ''
    })
}
