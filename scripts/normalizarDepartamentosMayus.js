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
    const coleccion = db.collection('riesgoadicionals')

    const todos = await coleccion.find({}).toArray()
    let actualizados = 0

    for (const doc of todos) {
      if (doc.departamento && doc.departamento !== doc.departamento.toUpperCase()) {
        await coleccion.updateOne(
          { _id: doc._id },
          { $set: { departamento: doc.departamento.toUpperCase() } }
        )
        actualizados++
      }
    }

    console.log(`✅ Departamentos actualizados a MAYÚSCULAS: ${actualizados}`)
    process.exit(0)
  })
  .catch(err => {
    console.error('❌ Error durante la normalización:', err)
    process.exit(1)
  })
