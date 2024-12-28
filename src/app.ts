import express from "express";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";
import equipoRoutes from "./routes/equipo.routes";
import registroRoutes from "./routes/registro.routes";
import authRoutes from './routes/auth.routes';
import dataRoutes from './routes/data.routes';
import plantRoutes from './routes/plant.routes'

const app = express();


app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use(equipoRoutes);
app.use(registroRoutes);
app.use('/api', dataRoutes);
app.use('/auth', authRoutes);
app.use('/plants', plantRoutes);


export default app