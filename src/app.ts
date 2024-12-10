import express from "express";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";
import equipoRoutes from "./routes/equipo.routes";
import registroRoutes from "./routes/registro.routes";


const app = express();


app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use(equipoRoutes);
app.use(registroRoutes);


export default app