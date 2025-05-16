import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const db = mongoose.connection.db

        const choco = await db.collection('riesgoadicionales').find({
            departamento: { $regex: /^choc[oó]/i }
        }).toArray()

        if (choco.length === 0) {
            console.log('❌ No se encontraron registros de Chocó en la colección riesgoadicionales.')
            process.exit(0)
        }

        const resultado = await db.collection('riesgoadicionals').insertMany(choco)
        console.log(`✅ Migrados ${resultado.insertedCount} registros de Chocó a riesgoadicionals.`)
        process.exit(0)
    })
    .catch(err => {
        console.error('❌ Error durante la migración:', err)
        process.exit(1)
    })
