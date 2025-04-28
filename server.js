import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
const estadisticasRoutes = require('./routes/estadisticas');
app.use('/api/estadisticas', estadisticasRoutes);

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

// Esquema de riesgo
const RiesgoSchema = new mongoose.Schema({
    ciudad: String,
    nivel: String,
    recomendacion: String
})

const Riesgo = mongoose.model("Riesgo", RiesgoSchema)

// Ruta para consultar riesgo
app.get('/api/riesgo/:ciudad', async (req, res) => {
    const ciudad = req.params.ciudad
    const resultado = await Riesgo.findOne({ ciudad: new RegExp(ciudad, "i") })
    if (!resultado) {
        return res.status(404).json({ error: "No hay datos para esta ciudad." })
    }
    res.json(resultado)
})

// Conectar a MongoDB y arrancar el server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Servidor escuchando en puerto ${process.env.PORT}`)
        })
    })
    .catch(err => console.log(err))
