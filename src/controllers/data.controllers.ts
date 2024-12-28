import { Request, Response } from "express";
import { AppDataSource } from "../db"; // Importa tu instancia de DataSource
import { Bayunca1 } from "../entities/Bayunca1";
import { Lavilla } from "../entities/Lavilla";
import { Oldt } from "../entities/Oldt";
import { Solchacras } from "../entities/Solchacras";
import { Solsantonio } from "../entities/Solsantonio";
import { Solhuaqui } from "../entities/Solhuaqui";
import { Sanpedro } from "../entities/Sanpedro";
import { Gonzanenergy } from "../entities/Gonzanenergy";
import { Produlesti } from "../entities/Produlesti";

import { Between, Like, Raw } from "typeorm";

// Diccionario para mapear plantas con entidades
const plantEntities: Record<string, any> = {
    "Bayunca1": Bayunca1,
    "Lavilla": Lavilla,
    "Oldt": Oldt,
    "Solchacras": Solchacras,
    "Solsantonio": Solsantonio,
    "Solhuaqui": Solhuaqui,
    "Sanpedro": Sanpedro,
    "Gonzanenergy": Gonzanenergy,
    "Produlesti": Produlesti,
};

// Validar planta y obtener la entidad correspondiente
const validatePlant = (planta: string) => {
    const PlantEntity = plantEntities[planta];
    if (!PlantEntity) {
        throw new Error(`La planta "${planta}" no tiene una entidad válida.`);
    }
    return PlantEntity;
};

// Crear un nuevo registro
export const createRegistro = async (req: Request, res: Response) => {
    const { planta } = req.params; // Obtener la planta de la URL
    const { REG_CA, value, direccion, metadata } = req.body;

    try {
        const PlantEntity = validatePlant(planta); // Validar la planta
        const repository = AppDataSource.getRepository(PlantEntity); // Usar DataSource para obtener el repositorio

        // Crear un nuevo registro
        const registro = repository.create({
            REG_CA,
            value,
            direccion: direccion ?? null,
            metadata,
        });

        // Guardar en la base de datos
        await repository.save(registro);

        res.status(201).json({
            message: `Registro creado exitosamente en la planta ${planta}`,
            data: registro,
        });
    } catch (error: Error | any) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los registros de una planta
export const getRegistros = async (req: Request, res: Response) => {
    const { planta } = req.params;

    try {
        const PlantEntity = validatePlant(planta);
        const repository = AppDataSource.getRepository(PlantEntity);

        const registros = await repository.find();
        res.status(200).json(registros);
    } catch (error : Error | any) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un registro específico por ID
export const showRegistros = async (req: any, res: any) => {
    const { planta, id } = req.params;

    try {
        const PlantEntity = validatePlant(planta);
        const repository = AppDataSource.getRepository(PlantEntity);

        const registro = await repository.findOne({ where: { id: Number(id) } });
        if (!registro) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        res.status(200).json(registro);
    } catch (error : Error | any) {
        res.status(500).json({ message: error.message });
    }
};

// Filtrar registros con condiciones dinámicas
export const filterRegistros = async (req: any, res: any) => {
    const { planta } = req.params;
    const { search, startDate, endDate, column } = req.query;

    try {
        const PlantEntity = validatePlant(planta);
        const repository = AppDataSource.getRepository(PlantEntity);

        const allowedColumns = ["id", "REG_CA", "value", "direccion", "metadata"];
        if (column && !allowedColumns.includes(column as string)) {
            return res.status(400).json({ message: `La columna ${column} no está permitida.` });
        }

        let where: any = {};
        if (search && column) {
            if (column === "metadata") {
                where[column] = Raw((alias) => `${alias}::text ILIKE :search`, {
                    search: `%${search}%`,
                });
            } else {
                where[column as string] = search;
            }
        }

        if (startDate && endDate) {
            where.createdAt = Between(new Date(startDate as string), new Date(endDate as string));
        }

        const registros = await repository.find({ where });
        res.status(200).json(registros);
    } catch (error : Error | any) {
        res.status(500).json({ message: error.message });
    }
};
