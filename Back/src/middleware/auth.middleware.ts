import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
    
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No se proporciono un token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Secret-Object');

        req.usuario = decoded;

        next();

    } catch (error) {
        return res.status(401).json({ message: 'Token invalido o expirado' });
    }
};