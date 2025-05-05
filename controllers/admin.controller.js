// controllers/admin.controller.js
import Admin from '../models/admin.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).json({ message: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
            expiresIn: '8h'
        });

        res.json({ token });
    } catch (err) {
        console.error('Error en loginAdmin:', err);
        res.status(500).json({ message: 'Error del servidor' });
    }
};
