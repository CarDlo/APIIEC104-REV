import { Router } from "express";
import { createRegistro } from "../controllers/registro.controllers";
import { runPythonScript } from '../services/pythonService';

const router = Router();

router.post("/registros", createRegistro);

router.post('/start-python-script', (req, res) => {
    runPythonScript();
    res.send('Python script started');
  });

export default router;