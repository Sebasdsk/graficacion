import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from './config/db';
import dotenv from 'dotenv'; 

dotenv.config();

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const secret = process.env.JWT_SECRET || 'Secret-Object';

        // Buscamos si existe el correo
        const result = await pool.query(
            'SELECT * FROM usuario WHERE email = $1', 
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No hay usuario con ese correo' });
        }

        const usuario = result.rows[0];

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
        res.status(500).send('Hubo un error al iniciar sesion');
    }
});

export default router;