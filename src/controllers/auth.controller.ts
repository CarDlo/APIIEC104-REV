import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/User';
import { generateToken } from '../utils/jwt.utils';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: 'Faltan campos obligatorios' });
      return;
    }

    const user = new User();
    user.username = username;
    user.password = password;
    await user.hashPassword();
    await user.save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    next(error); // Pasar el error al manejador global de errores
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: 'Faltan campos obligatorios' });
      return;
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Contraseña incorrecta' });
      return;
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    next(error); // Pasar el error al manejador global de errores
  }
};
