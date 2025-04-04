import { Request, Response } from "express";
import Expense from "../models/Expense";

export class ExpenseController {
  static getById = async (req: Request, res: Response) => {
    try {
      res.status(200).json(req.expense);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static create = async (req: Request, res: Response) => {
    try {
      const expense = await Expense.create(req.body);
      expense.budgetId = req.budget.id;
      await expense.save();

      res.status(201).json("Gasto Agregado Correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updateById = async (req: Request, res: Response) => {
    await req.expense.update(req.body);

    res.status(200).json(req.expense);
  };

  static deleteById = async (req: Request, res: Response) => {
    await req.expense.destroy();

    res.status(200).json("Gasto Eliminado");
  };
}
