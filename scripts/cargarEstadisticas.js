// scripts/cargarEstadisticas.js
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Estadistica from '../models/estadistica.model.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI no está definido en el .env')
    process.exit(1)
}

const filePath = path.join(__dirname, '../data/estadistica.json')
let datos = []

try {
    datos = JSON.parse(fs.readFileSync(filePath, 'utf8'))
} catch (err) {
    console.error('❌ Error leyendo archivo:', err)
    process.exit(1)
}

const registros = datos.map(d => ({
    municipio: d.municipio?.toUpperCase() || 'DESCONOCIDO',
    departamento: d.departamento?.toUpperCase() || 'SIN DEPTO',
    tipo: d.tipo?.toLowerCase() || 'otro',
    mes: d.mes || null,
    cantidad: Number(d.cantidad) || 1
}))

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const insertados = await Estadistica.insertMany(registros)
        console.log(`✅ ${insertados.length} registros cargados con éxito a Estadisticas`)
        process.exit(0)
    })
    .catch(err => {
        console.error('❌ Error conectando a MongoDB:', err)
        process.exit(1)
    })
