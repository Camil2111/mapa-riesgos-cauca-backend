import mongoose from 'mongoose'

const RiesgoAdicionalSchema = new mongoose.Schema({
    municipio: String,
    departamento: String,
    nivel_riesgo: String,
    contexto: String,
    novedades: String,
    estructuras_zona: String,
    lat: Number,
    lng: Number,
    tags: [String]
})

export default mongoose.model('RiesgoAdicional', RiesgoAdicionalSchema, 'riesgoadicionals')

