import {Router} from "express";
import { createEquipo, getEquipo, updateEquipo, deleteEquipo, showEquipo } from "../controllers/equipo.controllers";

const router = Router();

router.post("/equipos", createEquipo);

router.get("/equipos", getEquipo);

router.put("/equipos/:id", updateEquipo);

router.delete("/equipos/:id", deleteEquipo);

router.get("/equipos/:id", showEquipo);


export default router;