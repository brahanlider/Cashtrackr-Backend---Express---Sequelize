import type { Request, Response } from "express";

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    console.log("Desde getAll /api/budgets");
  };

  static getById = async (req: Request, res: Response) => {
    console.log("Desde getById /api/budgets/id");
  };

  static create = async (req: Request, res: Response) => {
    console.log(" Desde create /api/budgets");
  };

  static updateById = async (req: Request, res: Response) => {
    console.log(" Desde updateById /api/budgets");
  };

  static deleteById = async (req: Request, res: Response) => {
    console.log(" Desde delete /api/budgets");
  };
  
}
