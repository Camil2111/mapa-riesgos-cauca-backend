import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export default function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(403).json({ error: 'Token requerido' })

    try {
        const verificado = jwt.verify(token, process.env.ADMIN_SECRET)
        req.user = verificado
        next()
    } catch {
        return res.status(403).json({ error: 'Token inválido' })
    }
}
