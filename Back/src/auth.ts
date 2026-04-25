import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 
import { prisma } from '../lib/prisma';

dotenv.config();

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const secret = process.env.JWT_SECRET || 'Secret-Object';

        // Buscamos si existe el correo
        const result = await prisma.usuario.findFirst({
            where: { email: email }
        });

        if (!result) {
            return res.status(404).json({ message: 'No hay usuario con ese correo' });
        }

        const usuario = result;

        // Validamos la contraseña
        if (usuario.password_hash !== password) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Se crea el token
        const token = jwt.sign(
            { id: usuario.id_usuario }, 
            secret,
            { expiresIn: '1h' }
        );

        // Mandamos el token y los datos
        res.json({ 
            message: 'Inicio de sesion exitoso', 
            token, 
            user: usuario 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json('Hubo un error al iniciar sesion');
    }
});

export default router;