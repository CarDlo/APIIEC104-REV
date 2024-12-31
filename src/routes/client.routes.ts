// Importar módulos necesarios
import { Router } from 'express';
import {
  startPlant,
  stopPlant,
  restartPlant,
  getStatus,
  startAllPlants,
  stopAllPlants,
  restartAllPlants,
} from '../controllers/client.controllers';

// Crear el router
const router = Router();

// Definir rutas
router.get('/start/:plantName', startPlant);
router.get('/stop/:plantName', stopPlant);
router.get('/restart/:plantName', restartPlant);
router.get('/status', getStatus);
router.get('/start-all', startAllPlants);
router.get('/stop-all', stopAllPlants);
router.get('/restart-all', restartAllPlants);

export default router;