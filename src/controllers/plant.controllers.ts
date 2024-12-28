import { Request, Response } from "express";
import { AppDataSource } from "../db"; // Importa tu instancia de DataSource
import { Plant } from "../entities/Plant";


  // Obtener todas las plantas
export const getAll = async (req: Request, res: Response) =>{
    try {
      const plantRepository = AppDataSource.getRepository(Plant);
      const plants = await plantRepository.find();
      res.json(plants);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener las plantas", error });
    }
  }

  // Obtener una planta por ID
export const getById = async (req: Request, res: Response) =>{
    try {
      const { id } = req.params;
      const plantRepository = AppDataSource.getRepository(Plant);
      const plant = await plantRepository.findOneBy({ id: parseInt(id) });

      if (!plant) {
        res.status(404).json({ message: "Planta no encontrada" });
      }

      res.json(plant);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener la planta", error });
    }
  }

  // Crear una nueva planta
export const create = async (req: Request, res: Response) =>{
    try {
      const plantRepository = AppDataSource.getRepository(Plant);
      const plant = plantRepository.create(req.body);
      const result = await plantRepository.save(plant);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error al crear la planta", error });
    }
  }

  // Actualizar una planta existente
export const update = async (req: any, res: any) =>{
    try {
      const { id } = req.params;
      const plantRepository = AppDataSource.getRepository(Plant);
      const plant = await plantRepository.findOneBy({ id: parseInt(id) });

      if (!plant) {
        return res.status(404).json({ message: "Planta no encontrada" });
      }

      plantRepository.merge(plant, req.body);
      const result = await plantRepository.save(plant);

      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error al actualizar la planta", error });
    }
  }

  // Eliminar una planta
export const destroy = async (req: Request, res: Response) =>{
    try {
      const { id } = req.params;
      const plantRepository = AppDataSource.getRepository(Plant);
      const result = await plantRepository.delete(id);

      if (result.affected === 0) {
        res.status(404).json({ message: "Planta no encontrada" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar la planta", error });
    }
  }

