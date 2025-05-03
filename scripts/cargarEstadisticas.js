// cargarEstadisticas.js
import axios from 'axios'
import fs from 'fs'

const datos = JSON.parse(fs.readFileSync('./estadisticas.json', 'utf-8'))
const API_URL = 'https://backend-mapa-riesgos-cauca.onrender.com/api/estadisticas'

const cargar = async () => {
    for (const item of datos) {
        try {
            const res = await axios.post(API_URL, item)
            console.log(`✅ Subido: ${item.municipio} - ${item.tipo} (${item.cantidad})`)
        } catch (err) {
            console.error(`❌ Error en ${item.municipio} - ${item.tipo}:`, err.response?.data || err.message)
        }
    }
}

cargar()
