// scripts/migrarRiesgos.js
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import RiesgoAdicional from '../models/riesgoAdicional.model.js'

dotenv.config()

const filePath = path.join(process.cwd(), 'data', 'datos_riesgos.json')

async function migrar() {
    await mongoose.connect(process.env.MONGO_URI)

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    await RiesgoAdicional.deleteMany({}) // limpio lo anterior

    const insertados = await RiesgoAdicional.insertMany(data)

    console.log(`✅ Migrados ${insertados.length} riesgos a MongoDB`)
    process.exit()
}

migrar()
