import express from "express";
import morgan from "morgan";
import cors from "cors";
import equipoRoutes from "./routes/equipo.routes";

const app = express();


app.use(morgan("dev"));
app.use(cors());

app.use(equipoRoutes);

export default app