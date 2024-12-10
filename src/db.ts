import { DataSource } from "typeorm";
import { Equipo } from "./entities/Equipo";
import { Registro } from "./entities/Registro";
import "dotenv/config";

export const AppDataSource = new DataSource({
    type: process.env.DATABASE_TYPE as'postgres', // TypeORM requiere un valor específico
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    logging: true,
    entities: [Equipo, Registro],
    subscribers: [],
    migrations: [],
})