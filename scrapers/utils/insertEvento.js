import Evento from '../../models/evento.model.js'

export const insertarEvento = async ({ link, ...evento }) => {
    const yaExiste = await Evento.findOne({ link })
    if (yaExiste) return null

    const nuevo = await Evento.create({ link, ...evento })
    return nuevo
}
