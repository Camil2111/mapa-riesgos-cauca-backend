import mongoose from 'mongoose'

const riesgoSchema = new mongoose.Schema({
    departamento: String, // 👈 agrega esto
    municipio: String,
    nivel_riesgo: String,
    novedades: String,
    contexto: String,
    estructuras_zona: String,
    lat: Number,
    lng: Number
})

const Riesgo = mongoose.model('riesgoadicionales', riesgoSchema)

export default Riesgo
