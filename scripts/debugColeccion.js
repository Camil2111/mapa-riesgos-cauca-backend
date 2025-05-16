import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import Riesgo from '../models/riesgo.model.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const collectionName = Riesgo.collection.name
        console.log(`🕵️ Mongoose está insertando en la colección: ${collectionName}`)

        const count = await Riesgo.countDocuments()
        console.log(`📦 Total de documentos en esa colección: ${count}`)

        const departamentos = await Riesgo.distinct('departamento')
        console.log('🌎 Departamentos únicos:')
        console.log(departamentos)

        process.exit(0)
    })
    .catch(err => {
        console.error('❌ Error:', err)
        process.exit(1)
    })
