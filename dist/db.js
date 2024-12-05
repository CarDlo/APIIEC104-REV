"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Equipo_1 = require("./entities/Equipo");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "1234",
    database: "iec104_db",
    synchronize: true,
    logging: true,
    entities: [Equipo_1.Equipo],
    subscribers: [],
    migrations: [],
});
