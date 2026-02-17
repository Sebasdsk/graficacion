import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ message: 'No se proporciono un token' });
    }

    // Esto separa la palabra Bearer con la jwt_secret y asigna únicamente la jwt_secret
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Secret-Object');

        req.usuario = decoded;

        next();

    } catch (error) {
        return res.status(401).json({ message: 'Token invalido o expirado' });
    }
};