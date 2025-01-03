import {Router} from "express";
import { getStatus, getStatusById, createStatus, updateStatus, deleteStatus } from "../controllers/status.controllers";
const router = Router();

router.get("/", getStatus);
router.get("/:id", getStatusById);
router.post("/", createStatus);
router.put("/:id", updateStatus);
router.delete("/:id", deleteStatus);

export default router;