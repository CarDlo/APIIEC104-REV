import { Router } from "express";
import { createRegistro, getRegistros, showRegistros, filterRegistros } from "../controllers/registro.controllers";
import { runPythonScript } from '../services/pythonService';

const router = Router();

router.post("/registros", createRegistro);

router.get("/registros", getRegistros);

router.get("/registro/:id", showRegistros);

router.get("/registros/filter", filterRegistros);

router.post('/start-python-script', (req, res) => {
  runPythonScript();
  res.send('Python script started');
});

export default router;