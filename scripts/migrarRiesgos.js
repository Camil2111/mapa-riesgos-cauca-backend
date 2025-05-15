import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import RiesgoAdicional from '../models/riesgoAdicional.model.js'

dotenv.config()

const filePath = path.join(process.cwd(), 'data', 'datos_riesgos.json')

async function migrar() {
    try {
        // Conexión limpia (sin repetir base)
        await mongoose.connect(process.env.MONGO_URI)

        console.log(`✅ Conectado a base: ${mongoose.connection.name}`) // 👈 imprime la base usada

        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

        console.log(`📊 Total de registros en archivo: ${data.length}`)

        await RiesgoAdicional.deleteMany({})
        const insertados = await RiesgoAdicional.insertMany(data)

        console.log(`✅ Migrados ${insertados.length} riesgos a MongoDB`)
        process.exit()
    } catch (err) {
        console.error('❌ Error durante la migración:', err.message)
        process.exit(1)
    }
}

migrar()


