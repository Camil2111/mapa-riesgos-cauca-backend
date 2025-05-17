import mongoose from 'mongoose'

const eventoSchema = new mongoose.Schema({
    titulo: { type: String },
    municipio: { type: String, required: true },
    vereda: { type: String },
    tipo: { type: String },
    descripcion: { type: String },
    fecha: { type: String },
    lat: { type: Number },
    lng: { type: Number }
})

const Evento = mongoose.model('Evento', eventoSchema)

export default Evento
