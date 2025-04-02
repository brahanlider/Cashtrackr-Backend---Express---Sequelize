import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import Expense from "../models/Expense";

declare global {
  namespace Express {
    interface Request {
      expense?: Expense;
    }
  }
}

export const validateExpenseInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("name")
    .notEmpty()
    .withMessage("El nombre del gasto no puede ir vacio")
    .run(req),
    await body("amount")
      // .notEmpty()
      // .withMessage("La cantidad del presupuesto no puede ir vacio")
      // .isNumeric()
      // .withMessage("Cantidad no válida")
      // .custom((value) => value > 0)
      // .withMessage("El presupuesto debe ser mayor a 0")
      .notEmpty()
      .withMessage("El cantidad del gasto no puede estar vacío")
      .isFloat({ min: 0.01 })
      .withMessage("Debe ser un número > 0") // Valida números y convierte strings numéricos
      .custom((value) => {
        // Validación adicional para asegurar que no sea string
        if (typeof value === "string") {
          throw new Error(
            'No se aceptan valores textuales en el gasto (ej: "10"), debe ser número (ej: 10)'
          );
        }
        return true;
      })
      .run(req);

  next();
};

export const validateExpenseId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await param("expenseId")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo")
    .run(req);

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export const validateExpenseExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { expenseId } = req.params;
    const expense = await Expense.findByPk(expenseId);

    if (!expense) {
      const error = new Error("No se encontro el gasto");
      res.status(404).json({ error: error.message });
      return;
    }

    // res.status(500).json(req.expense);
    req.expense = expense;

    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
};
