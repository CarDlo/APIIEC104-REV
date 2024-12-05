import {Request, Response} from "express";
import { Registro } from "../entities/Registro";

export const createRegistro = async (req: any, res: any) => {
    try {
        const { equipo_iec_870_5_104, value, direccion } = req.body;
        const registro = new Registro();
        registro.equipo = equipo_iec_870_5_104;
        registro.value = value;
        registro.direccion = direccion;
        await registro.save();
        return res.json(registro);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
