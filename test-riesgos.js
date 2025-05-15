import mongoose from 'mongoose'
import dotenv from 'dotenv'
import RiesgoAdicional from './models/riesgoAdicional.model.js'

dotenv.config()

const ejecutar = async () => {
    await mongoose.connect(process.env.MONGO_URI)

    const riesgos = await RiesgoAdicional.find().limit(5)

    console.log('🧪 Riesgos encontrados:', riesgos.length)
    console.log(riesgos)

    process.exit()
}

ejecutar()
