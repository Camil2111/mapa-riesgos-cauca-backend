import Evento from '../models/evento.model.js'

export const guardarEvento = async (eventoData) => {
    try {
        const nuevoEvento = new Evento(eventoData)
        await nuevoEvento.save()
        console.log('✅ Evento guardado:', nuevoEvento.vereda || nuevoEvento.municipio)
    } catch (error) {
        console.error('❌ Error guardando evento:', error.message)
    }
}
