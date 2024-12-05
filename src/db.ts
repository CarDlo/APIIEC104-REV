import { DataSource } from "typeorm";
import { Equipo } from "./entities/Equipo";
import { Registro } from "./entities/Registro";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "1234",
    database: "iec104_db",
    synchronize: true,
    logging: true,
    entities: [Equipo, Registro],
    subscribers: [],
    migrations: [],
})