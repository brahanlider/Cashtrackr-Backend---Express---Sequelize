import type { Request, Response } from "express";

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    console.log("Desde GETALL /api/budgets");
  };

  static create = async (req: Request, res: Response) => {
    console.log("asdasdas Desde POST /api/budgets");
  };
}
