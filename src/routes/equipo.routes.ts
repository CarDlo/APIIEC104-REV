import {Router} from "express";

const router = Router();

router.post("/equipo", (req, res) => {
    res.json({
        message: "Equipo creado"
    })
})

export default router;