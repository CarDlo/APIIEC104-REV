"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showEquipo = exports.deleteEquipo = exports.updateEquipo = exports.getEquipo = exports.createEquipo = void 0;
const Equipo_1 = require("../entities/Equipo");
const createEquipo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { inversor, panel, equipo, descripcion, direccion, tipo_objeto, min, max, unidad, f_conv, enviado, iec_870_5_104, } = req.body;
        //throw new Error("Error del Programa");
        const equipo2 = new Equipo_1.Equipo();
        equipo2.inversor = inversor;
        equipo2.panel = panel;
        equipo2.equipo = equipo;
        equipo2.descripcion = descripcion;
        equipo2.direccion = direccion;
        equipo2.tipo_objeto = tipo_objeto;
        equipo2.min = min;
        equipo2.max = max;
        equipo2.unidad = unidad;
        equipo2.f_conv = f_conv;
        equipo2.enviado = enviado;
        equipo2.iec_870_5_104 = iec_870_5_104;
        yield equipo2.save();
        //return res.json(equipo2);
        res.send("Equipo creado");
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.createEquipo = createEquipo;
const getEquipo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const equipos = yield Equipo_1.Equipo.find();
        return res.json(equipos);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.getEquipo = getEquipo;
const updateEquipo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const equipo = yield Equipo_1.Equipo.findOneBy({ id: Number(id) });
        if (!equipo) {
            return res.status(404).json({ message: "Equipo no encontrado" });
        }
        equipo.inversor = req.body.inversor;
        equipo.panel = req.body.panel;
        equipo.equipo = req.body.equipo;
        equipo.descripcion = req.body.descripcion;
        equipo.direccion = req.body.direccion;
        equipo.tipo_objeto = req.body.tipo_objeto;
        equipo.min = req.body.min;
        equipo.max = req.body.max;
        equipo.unidad = req.body.unidad;
        equipo.f_conv = req.body.f_conv;
        equipo.enviado = req.body.enviado;
        equipo.iec_870_5_104 = req.body.iec_870_5_104;
        yield equipo.save();
        return res.json(equipo);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.updateEquipo = updateEquipo;
const deleteEquipo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const equipo = yield Equipo_1.Equipo.findOneBy({ id: Number(id) });
        if (!equipo) {
            return res.status(404).json({ message: "Equipo no encontrado" });
        }
        yield Equipo_1.Equipo.delete({ id: Number(id) });
        return res.sendStatus(204);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.deleteEquipo = deleteEquipo;
const showEquipo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const equipo = yield Equipo_1.Equipo.findOneBy({ id: Number(id) });
        if (!equipo) {
            return res.status(404).json({ message: "Equipo no encontrado" });
        }
        return res.json(equipo);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.showEquipo = showEquipo;
