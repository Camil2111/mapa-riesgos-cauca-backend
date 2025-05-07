import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'data', 'datos_riesgos.json')
const raw = fs.readFileSync(filePath, 'utf-8')
let datos = JSON.parse(raw)

const normalizados = []
const yaVistos = new Set()

for (let r of datos) {
    const municipio = (r.municipio || '').trim()
    const departamento = (r.departamento || 'CAUCA').trim().toUpperCase()
    const nivel = (r.nivel_riesgo || 'BAJO').trim().toLowerCase()
    const contexto = (r.contexto || '').trim()
    const novedades = (r.novedades || '').trim()
    const estructuras = (r.estructuras_zona || '').trim()
    const lat = parseFloat(r.lat)
    const lng = parseFloat(r.lng)

    if (!municipio || isNaN(lat) || isNaN(lng)) continue

    const key = `${municipio.toUpperCase()}-${lat.toFixed(5)}-${lng.toFixed(5)}`
    if (yaVistos.has(key)) continue
    yaVistos.add(key)

    normalizados.push({
        departamento,
        municipio,
        lat,
        lng,
        nivel_riesgo: nivel,
        contexto,
        estructuras_zona: estructuras,
        novedades
    })
}

normalizados.sort((a, b) => {
    if (a.departamento === b.departamento) {
        return a.municipio.localeCompare(b.municipio)
    }
    return a.departamento.localeCompare(b.departamento)
})

fs.writeFileSync(filePath, JSON.stringify(normalizados, null, 2))
console.log(`✅ Normalización completada: ${normalizados.length} registros únicos.`)
