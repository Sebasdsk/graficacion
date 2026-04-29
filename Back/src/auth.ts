import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

dotenv.config();

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const secret = process.env.JWT_SECRET || 'Secret-Object';

        // Buscamos si existe el correo
        const usuario = await prisma.usuario.findFirst({
          where: { email: email },
        });

        if (!usuario) {
            return res
            .status(404)
            .json({ message: "No hay usuario con ese correo" });
        }
        
        const compareHashPassword = await bcrypt.compare(password, usuario.password_hash);
        
        if (!compareHashPassword) {
            return res.status(401).json({ message: "La contraseña es incorrecta"});
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

//Ruta para registrar usuarios
router.post('/register', async (req: Request, res: Response) => {
    try {

        const { nombre, apellido_paterno, apellido_materno, email, password } = req.body;
        
        const saltRounds = 10;
        const passwordHashed = await bcrypt.hash(password, saltRounds);

        const usuarioNuevo = await prisma.usuario.create({
            data: {
                nombre: nombre, 
                apellido_paterno: apellido_paterno,
                apellido_materno: apellido_materno,
                email: email,
                password_hash: passwordHashed,
                estatus: "A"
            }
        })

        res.status(200).json({
            Message: "Usuario creado exitosamente", usuarioNuevo
        });

    } catch (error) {
        console.log(error);
        res.status(500).json('Hubo un error al crear el usuario')
    }
})

export default router;