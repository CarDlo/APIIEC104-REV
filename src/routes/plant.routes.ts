import { Router } from "express";
import { getAll, getById, create, update, destroy } from "../controllers/plant.controllers";


const router = Router();

// Definir rutas
router.get("/", getAll);         // Obtener todas las plantas
router.get("/:id", getById);    // Obtener una planta por ID
router.post("/", create);       // Crear una nueva planta
router.put("/:id", update);     // Actualizar una planta existente
router.delete("/:id", destroy);  // Eliminar una planta

export default router;
