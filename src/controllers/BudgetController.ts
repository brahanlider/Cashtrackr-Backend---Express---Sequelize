import type { Request, Response } from "express";
import Budget from "../models/Budget";
import Expense from "../models/Expense";

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    // console.log("Desde Mock", req.user.id);

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
      // console.log(error);   //!===> CREO QUE FUE PARA TESTING
      res.status(500).json({ error: "Hubo un eror" });
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
      const budget = await Budget.create(req.body);
      budget.userId = req.user.id; //====> userID de la tabla

      await budget.save();
      res.status(201).json("Presupuesto creado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un eror" });
    }
  };

  static updateById = async (req: Request, res: Response) => {
    await req.budget.update(req.body);

    res.status(200).json("Presupuesto actualizado correctamente");
  };

  static deleteById = async (req: Request, res: Response) => {
    await req.budget.destroy();

    res.status(200).json("Presupuesto eliminado correctamente");
  };
}
