import {Request, Response} from "express";
import { Between, Like, Raw, MoreThanOrEqual, LessThanOrEqual } from "typeorm";

import { Registro } from "../entities/Registro";

export const createRegistro = async (req: any, res: any) => {
    try {
        const { equipo_iec_870_5_104, value, direccion } = req.body;
        const registro = new Registro();
        registro.equipo_iec_870_5_104 = equipo_iec_870_5_104;
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

export const getRegistros = async (req: Request, res: Response) => {
    try {
        const { equipo_iec_870_5_104, direccion, value, fechaInicio, fechaFin } = req.query;

        const whereConditions: any = {};

        // Filtrar por 'equipo_iec_870_5_104' si existe en el query
        if (equipo_iec_870_5_104) {
            whereConditions.equipo_iec_870_5_104 = Number(equipo_iec_870_5_104);
        }

        // Filtrar por 'direccion' si existe en el query
        if (direccion) {
            whereConditions.direccion = Number(direccion);
        }

        // Filtrar por 'value' si existe en el query
        if (value) {
            whereConditions.value = Number(value);
        }

        // Filtrar por rango de fechas 'createdAt'
        if (fechaInicio && fechaFin) {
            whereConditions.createdAt = Between(new Date(fechaInicio), new Date(fechaFin));
        } else if (fechaInicio) {
            whereConditions.createdAt = MoreThanOrEqual(new Date(fechaInicio));
        } else if (fechaFin) {
            whereConditions.createdAt = LessThanOrEqual(new Date(fechaFin));
        }

        const registros = await Registro.find({
            where: whereConditions,
            order: { createdAt: 'DESC' } // Ordenar por fecha de creación (opcional)
        });

        return res.json(registros); 
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }    
    }
};
export const showRegistros = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const registro = await Registro.findOneBy({ id: Number(id) });
        if (!registro) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }
        return res.json(registro);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export const filterRegistros = async (req: any, res: any) => {
    try {
        const { search, startDate, endDate, column } = req.query;

        // Validar si se especifica la columna
        const allowedColumns = ["id", "equipo_iec_870_5_104", "value", "direccion"];
        if (column && !allowedColumns.includes(column as string)) {
            return res.status(400).json({ message: `La columna ${column} no está permitida.` });
        }

        // Construir el filtro de búsqueda
        let where: any = {};
        if (search && column) {
            const isNumericSearch = !isNaN(Number(search));
            if (isNumericSearch) {
                where[column as string] = Number(search);
            } else {
                if (column === "value") {
                    where[column as string] = Raw((alias) => `CAST(${alias} AS TEXT) LIKE :search`, {
                        search: `%${search}%`,
                    });
                } else {
                    return res.status(400).json({ message: `La columna ${column} solo acepta valores numéricos.` });
                }
            }
        }

        // Construir el filtro de rango de fecha
        if (startDate && endDate) {
            const parsedStartDate = new Date(startDate as string);
            const parsedEndDate = new Date(endDate as string);

            // Validar formato de fecha
            if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
                return res.status(400).json({ message: "Formato de fecha inválido. Usa 'YYYY-MM-DDTHH:mm:ss.sssZ'." });
            }

            where.createdAt = Between(parsedStartDate, parsedEndDate);
        }

        // Realizar la consulta
        const registros = await Registro.find({ where });
        res.status(200).json(registros);
    } catch (error) {
        console.error("Error in filterRegistros:", error);
        res.status(500).json({ message: "Error fetching registros", error });
    }
};