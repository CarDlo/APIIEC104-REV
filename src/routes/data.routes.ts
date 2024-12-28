import { Router } from "express";
import {
    createRegistro,
    getRegistros,
    showRegistros,
    filterRegistros,
} from "../controllers/data.controllers";

const router = Router();

// Rutas dinámicas por planta
router.post("/:planta", createRegistro); // Crear un registro
router.get("/:planta", getRegistros); // Obtener todos los registros
router.get("/:planta/:id", showRegistros); // Obtener un registro específico
router.get("/:planta/filter", filterRegistros); // Filtrar registros

export default router;
