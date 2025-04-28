import mongoose from 'mongoose'

const riesgoSchema = new mongoose.Schema({
    municipio: String,
    nivel_riesgo: String,
    novedades: String,
    contexto: String,
    estructuras_zona: String
})

const Riesgo = mongoose.model('Riesgo', riesgoSchema)

export default Riesgo
