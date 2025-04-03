import type { Request, Response } from "express";
import Budget from "../models/Budget";
import Expense from "../models/Expense";

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const budgets = await Budget.findAll({
        order: [
          ["createdAt", "DESC"], // ← Formato correcto: array de arrays
        ],
        // limit: 1,
        //where==>: Filtrar por el usuario auntenticado
        where: {
          userId: req.user.id,
        },
      });

      res.status(200).json(budgets);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los presupuestos" });
    }
  };

  static getById = async (req: Request, res: Response) => {
    const budget = await Budget.findByPk(req.budget.id, {
      include: [Expense],
    });

    res.json(budget);
  };

  static create = async (req: Request, res: Response) => {
    try {
      const budget = new Budget(req.body);
      budget.userId = req.user.id; //====> userID de la tabla

      await budget.save();
      res.status(201).json(budget);
    } catch (error) {
      res.status(500).json({ error: "Hubo un eror" });
    }
  };

  static updateById = async (req: Request, res: Response) => {
    await req.budget.update(req.body);

    res.status(200).json(req.budget);
  };

  static deleteById = async (req: Request, res: Response) => {
    await req.budget.destroy();

    res.status(200).json("Presupuesto eliminado correctamente");
  };
}
