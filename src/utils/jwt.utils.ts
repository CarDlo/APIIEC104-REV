import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno desde .env

const SECRET_KEY = process.env.SECRET_KEY || 'fallback_secret';

export const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};
