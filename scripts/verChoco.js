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
        const resultados = await db.collection('riesgoadicionals').find({
            departamento: { $regex: /^choc[oó]/i }
        }).toArray()

        console.log(`🧾 Registros encontrados de Chocó: ${resultados.length}`)
        resultados.forEach(r => console.log(`- ${r.municipio} (${r.departamento})`))
        process.exit(0)
    })
    .catch(err => {
        console.error('❌ Error:', err)
        process.exit(1)
    })
