// backend/models/estadistica.model.js
import mongoose from 'mongoose'

const estadisticaSchema = new mongoose.Schema({
    municipio: { type: String, required: true },
    tipo: { type: String, required: true },
    cantidad: { type: Number, required: true }
})

export default mongoose.model('Estadistica', estadisticaSchema)
