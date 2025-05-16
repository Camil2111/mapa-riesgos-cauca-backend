// scripts/cargarRiesgos.js
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Riesgo from '../models/riesgo.model.js'

// Habilitar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cargar archivo .env
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Validar conexión
if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI no está definido en el archivo .env')
    process.exit(1)
}

// Leer el archivo JSON con los datos
const filePath = path.join(__dirname, '../data/riesgos_adicionales.json')
let datos = []

try {
    datos = JSON.parse(fs.readFileSync(filePath, 'utf8'))
} catch (err) {
    console.error('❌ Error leyendo riesgos_adicionales.json:', err)
    process.exit(1)
}

// Validar y limpiar los datos
const registros = datos
    .map(r => {
        const lat = parseFloat(r.lat)
        const lng = parseFloat(r.lng)
        if (isNaN(lat) || isNaN(lng)) return null

        return {
            municipio: r.municipio?.trim().toUpperCase() || 'DESCONOCIDO',
            departamento: r.departamento?.trim().toUpperCase() || 'SIN DEPARTAMENTO',
            nivel_riesgo: r.nivel_riesgo?.trim().toLowerCase() || 'bajo',
            contexto: r.contexto?.trim() || 'Sin información',
            novedades: r.novedades?.trim() || 'Sin información',
            estructuras_zona: typeof r.estructuras_zona === 'string'
                ? r.estructuras_zona.trim()
                : Array.isArray(r.estructuras_zona)
                    ? r.estructuras_zona.join(', ').trim()
                    : '',
            lat,
            lng
        }
    })
    .filter(Boolean) // quita nulos

console.log("Registros listos para insertar:");
console.log(registros.length);
console.log(registros.map(r => r.departamento).filter(dep => dep === "Chocó" || dep === "CHOCÓ"));
console.log("📋 Mostrando primeros registros a insertar:");
console.log(registros.slice(0, 3))


// Conectar y cargar a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const insertados = await Riesgo.insertMany(registros)
        console.log(`✅ ${insertados.length} riesgos cargados con éxito a MongoDB`)
        process.exit(0)
    })
    .catch(err => {
        console.error('❌ Error conectando a MongoDB o insertando:', err)
        process.exit(1)
    })

