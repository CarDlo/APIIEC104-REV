import {Request, Response} from "express";
import { Equipo } from "../entities/Equipo";
export const createEquipo = async (req: any, res: any) => {
    
try {
  const {
        inversor,
        panel,
        equipo,
        descripcion,
        direccion,
        tipo_objeto,
        min,
        max,
        unidad,
        f_conv,
        enviado,
        iec_870_5_104,
      } = req.body;

      //throw new Error("Error del Programa");

      const equipo2 = new Equipo();
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

      await equipo2.save();

   //return res.json(equipo2);
   res.send("Equipo creado");

} catch (error) {
  if (error instanceof Error) {
    return res.status(500).json({ message: error.message });
  }
}

}

export const getEquipo = async (req: any, res: any) => {
  try {
    const equipos = await Equipo.find();
    return res.json(equipos);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const updateEquipo = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const equipo = await Equipo.findOneBy({ id: Number(id) });
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
    await equipo.save();
    return res.json(equipo);
  } catch (error) {
    if (error instanceof Error) { 
      return res.status(500).json({ message: error.message });
    }
  }
};

export const deleteEquipo = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const equipo = await Equipo.findOneBy({ id: Number(id) });
    if (!equipo) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }
    await Equipo.delete({ id: Number(id) });
    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const showEquipo = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const equipo = await Equipo.findOneBy({ id: Number(id) });
    if (!equipo) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }
    return res.json(equipo);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};