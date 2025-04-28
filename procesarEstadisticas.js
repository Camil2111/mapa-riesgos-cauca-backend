// backend/procesarEstadisticas.js
import mongoose from 'mongoose'
import xlsx from 'xlsx'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import Estadistica from './models/estadistica.model.js'

dotenv.config()

const MONGO_URI = process.env.MONGODB_URI

const procesarArchivos = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log('✅ Conectado a MongoDB')

        const carpeta = './uploads'
        const archivos = fs.readdirSync(carpeta).filter(f => f.endsWith('.xlsx'))

        const acumulado = {}

        archivos.forEach(archivo => {
            const ruta = path.join(carpeta, archivo)
            const workbook = xlsx.readFile(ruta)
            const hoja = workbook.Sheets[workbook.SheetNames[0]]
            const datos = xlsx.utils.sheet_to_json(hoja)

            datos.forEach(row => {
                const municipio = row.Municipio || row.MUNICIPIO || ''
                const tipo = row.Delito || row.Tipo || row.Categoria || 'No definido'
                const key = `${municipio}_${tipo}`

                if (!acumulado[key]) {
                    acumulado[key] = { municipio, tipo, cantidad: 1 }
                } else {
                    acumulado[key].cantidad += 1
                }
            })
        })

        // Limpia y actualiza
        await Estadistica.deleteMany()
        await Estadistica.insertMany(Object.values(acumulado))
        console.log('📊 Estadísticas actualizadas correctamente.')
        process.exit()
    } catch (err) {
        console.error('❌ Error procesando archivos:', err)
        process.exit(1)
    }
}

procesarArchivos()
