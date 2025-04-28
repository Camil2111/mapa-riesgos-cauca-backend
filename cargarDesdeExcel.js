import mongoose from 'mongoose'
import xlsx from 'xlsx'
import dotenv from 'dotenv'
import Riesgo from './models/riesgo.model.js'

dotenv.config()

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ Conectado a MongoDB')
    } catch (err) {
        console.error('❌ Error al conectar a MongoDB', err)
        process.exit(1)
    }
}

const cargarDatos = async () => {
    const workbook = xlsx.readFile('./Analisis_Riesgos_Cauca.xlsx')
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = xlsx.utils.sheet_to_json(sheet)

    const transformados = data.map((item) => ({
        municipio: item.MUNICIPIO || '',
        nivel_riesgo: item['NIVEL RIESGO'] || '',
        novedades: item.Seguimiento || '',
        contexto: item.Contexto || '',
        estructuras_zona: item['Estructuras de la zona'] || ''
    }))

    try {
        await Riesgo.deleteMany() // borra los existentes si quieres empezar de cero
        await Riesgo.insertMany(transformados)
        console.log('📊 Datos cargados correctamente.')
        process.exit()
    } catch (err) {
        console.error('❌ Error al cargar los datos:', err)
        process.exit(1)
    }
}

await conectarDB()
await cargarDatos()
