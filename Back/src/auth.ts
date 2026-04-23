import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from './config/db';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;
        const secret = process.env.JWT_SECRET || 'Secret-Object';

        const usuario = await prisma.usuario.findUnique({
            where: { email }
        });

        if (!usuario) {
            return res.status(404).json({ message: 'No hay usuario con ese correo' });
        }

        if (usuario.password_hash !== password) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: usuario.id_usuario },
            secret,
            { expiresIn: '1h' }
        );

        const { password_hash, ...usuarioSinPassword } = usuario;
        res.json({
            message: 'Inicio de sesion exitoso',
            token,
            user: usuarioSinPassword
        });

    } catch (error) {
        console.error("Error en /login:", error);
        res.status(500).send('Hubo un error al iniciar sesion');
    }
});

export default router;