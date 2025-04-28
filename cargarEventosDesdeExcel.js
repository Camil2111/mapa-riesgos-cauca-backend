// backend/cargarEventosDesdeExcel.js
import mongoose from 'mongoose'
import xlsx from 'xlsx'
import dotenv from 'dotenv'
import Evento from './models/evento.model.js'
import path from 'path'
import fs from 'fs'

dotenv.config()

const MONGO_URI = process.env.MONGODB_URI

const cargarEventos = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log('✅ Conectado a MongoDB')

        const carpeta = './uploads/eventos'
        const archivos = fs.readdirSync(carpeta).filter(file => file.endsWith('.xlsx'))

        if (archivos.length === 0) {
            console.log('⚠️ No hay archivos Excel en /uploads/eventos')
            process.exit(0)
        }

        for (const archivo of archivos) {
            const rutaCompleta = path.join(carpeta, archivo)
            const workbook = xlsx.readFile(rutaCompleta)
            const hoja = workbook.Sheets[workbook.SheetNames[0]]
            const datos = xlsx.utils.sheet_to_json(hoja)

            for (const row of datos) {
                const nuevoEvento = new Evento({
                    municipio: row.Municipio || '',
                    vereda: row.Vereda || '',
                    tipo: row.Tipo || '',
                    descripcion: row.Descripcion || '',
                    fecha: row.Fecha || '',
                    lat: parseFloat(row.Latitud),
                    lng: parseFloat(row.Longitud)
                })

                await nuevoEvento.save()
            }

            console.log(`✔️ Archivo procesado: ${archivo}`)
        }

        console.log('✅ Todos los eventos se cargaron exitosamente')
        process.exit(0)
    } catch (err) {
        console.error('❌ Error cargando eventos:', err)
        process.exit(1)
    }
}

cargarEventos()
