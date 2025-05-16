import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// __dirname en ESModules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const db = mongoose.connection.db
        const departamentos = await db.collection('riesgoadicionales').distinct('departamento')
        console.log('🌎 Departamentos únicos en la colección:')
        console.log(departamentos)
        process.exit(0)
    })
    .catch(err => {
        console.error('❌ Error conectando o consultando:', err)
        process.exit(1)
    })
