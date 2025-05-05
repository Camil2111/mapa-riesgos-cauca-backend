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

// 🟢 Login (usando email y password)
router.post('/auth/login', (req, res) => {
    const { email, password } = req.body;

    console.log('🧪 Login recibido ->', email, password);
    console.log('🔍 Comparando con ->', process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ rol: 'admin', email }, process.env.ADMIN_SECRET, { expiresIn: '2h' });
        return res.json({ token });
    }

    res.status(401).json({ error: 'Credenciales incorrectas' });
});


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

// 💾 POST para sobrescribir datos_riesgos.json
router.post('/datos-riesgos', auth, (req, res) => {
    const filePath = path.join(process.cwd(), 'data', 'datos_riesgos.json')

    try {
        fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2))
        res.json({ mensaje: 'Archivo actualizado con éxito' })
    } catch (error) {
        console.error('❌ Error al escribir archivo:', error)
        res.status(500).json({ error: 'No se pudo guardar el archivo' })
    }
})

export default router

