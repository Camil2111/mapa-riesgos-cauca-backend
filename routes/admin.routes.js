import express from 'express'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const router = express.Router()

// Secretos desde .env
const SECRET = process.env.ADMIN_SECRET || 'admin123'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

// 🟢 Login
router.post('/auth/login', (req, res) => {
    const { email, password } = req.body
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ rol: 'admin', email }, SECRET, { expiresIn: '2h' })
        return res.json({ token })
    }
    res.status(401).json({ error: 'Credenciales incorrectas' })
})

// 🛡️ Middleware de autenticación
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(403).json({ error: 'Token requerido' })
    try {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, SECRET)
        next()
    } catch {
        res.status(403).json({ error: 'Token inválido' })
    }
}

// 📄 GET datos_riesgos.json
router.get('/datos-riesgos', auth, (req, res) => {
    const filePath = path.join(process.cwd(), 'data', 'datos_riesgos.json')
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Archivo no encontrado' })
    }
    const data = fs.readFileSync(filePath, 'utf-8')
    res.json(JSON.parse(data))
})

// 💾 POST corregido para sobrescribir datos_riesgos.json con data[]
router.post('/datos-riesgos/guardar-edicion', auth, (req, res) => {
    const filePath = path.join(process.cwd(), 'data', 'datos_riesgos.json')
    try {
        const riesgos = req.body.data
        if (!Array.isArray(riesgos)) {
            return res.status(400).json({ ok: false, error: 'Formato inválido: se esperaba un array.' })
        }

        fs.writeFileSync(filePath, JSON.stringify(riesgos, null, 2))
        res.json({ ok: true, mensaje: 'Archivo actualizado con éxito' })
    } catch (error) {
        console.error('❌ Error al escribir archivo:', error)
        res.status(500).json({ ok: false, error: 'No se pudo guardar el archivo' })
    }
})

// 🔍 Rutas de debug (opcional)
router.get('/debug/env', (req, res) => {
    res.json({
        admin_email: ADMIN_EMAIL,
        admin_password: ADMIN_PASSWORD,
        mensaje: '✅ Backend y .env funcionando'
    })
})

router.get('/auth/login', (req, res) => {
    res.json({ mensaje: '✅ Ruta de login activa' })
})

export default router


