import type { Request, Response } from "express";
import Budget from "../models/Budget";

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const budgets = await Budget.findAll({
        order: [
          ["createdAt", "DESC"], // ← Formato correcto: array de arrays
        ],
        // limit: 1,
        //whgere:{}
      });
      res.status(200).json(budgets);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los presupuestos" });
    }
  };

  static getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const budgetId = await Budget.findByPk(id);

      if (!budgetId) {
        const error = new Error("Presupuesto no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(200).json(budgetId);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener un producto por Id" });
    }
  };

  static create = async (req: Request, res: Response) => {
    try {
      const budget = new Budget(req.body);

      await budget.save();
      res.status(201).json("Presupuesto Creado Correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un eror" });
    }
  };

  static updateById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, amount } = req.body;
    try {
      const budget = await Budget.findByPk(id);

      if (!budget) {
        const error = new Error("Presupuesto no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }

      await budget.update({ name, amount });

      res.status(200).json(budget);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al editar" });
    }
  };

  static deleteById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const budget = await Budget.findByPk(id);

      if (!budget) {
        const error = new Error("Presupuesto no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }
      await budget.destroy();

      res.status(200).json("Presupuesto eliminado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al eliminar" });
    }
  };
}
