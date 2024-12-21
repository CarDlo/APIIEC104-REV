import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  username: string;
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Acceso no autorizado' });
    return;
  }

  try {
    const decoded = verifyToken(token) as JwtPayload;
    req.user = decoded; // ✅ Ahora TypeScript reconocerá req.user
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
