import {Request, Response} from "express";
import { Status } from "../entities/Status";

export const getStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const status = await Status.find();
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getStatusById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const status = await Status.findOneBy({ id: Number(id) });
    if (!status) {
      res.status(404).json({ message: "Status not found" });
      return;
    }
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const createStatus = async (req: Request, res: Response): Promise<void> => {
  try {    
    const status = Status.create(req.body);
    await status.save();
    res.status(201).json(status);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const status = await    Status.findOneBy({ id: Number(id) });
    if (!status) {
      res.status(404).json({ message: "Status not found" });
      return;
    }
    Status.merge(status, req.body);
    await Status.save(status);
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const deleteStatus = async (req: Request, res: Response): Promise<void> => {  
  try {
    const { id } = req.params;
    const status = await Status.findOneBy({ id: Number(id) });
    if (!status) {
      res.status(404).json({ message: "Status not found" });
      return;
    }
    await Status.remove(status);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error });
  }     
}