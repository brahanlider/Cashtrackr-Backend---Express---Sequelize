import type { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import Budget from "../models/Budget";

declare global {
  namespace Express {
    interface Request {
      budget?: Budget;
    }
  }
}

export const validateBudgetId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await param("budgetId")
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

export const validateBudgetExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { budgetId } = req.params;
    const budget = await Budget.findByPk(budgetId);

    if (!budget) {
      const error = new Error("Presupuesto no encontrado");
      res.status(404).json({ error: error.message });
      return;
    }

    // res.status(200).json(budget);
    req.budget = budget;
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
};

export const validateBudgetInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("name")
    .notEmpty()
    .withMessage("El nombre del presupuesto es obligatorio")
    .run(req),
    await body("amount")
      // .notEmpty()
      // .withMessage("La cantidad del presupuesto no puede ir vacio")
      // .isNumeric()
      // .withMessage("Cantidad no válida")
      // .custom((value) => value > 0)
      // .withMessage("El presupuesto debe ser mayor a 0")
      .notEmpty()
      .withMessage("El monto no puede estar vacío")
      .isFloat({ min: 0.01 })
      .withMessage("Debe ser un número > 0") // Valida números y convierte strings numéricos
      .custom((value) => {
        // Validación adicional para asegurar que no sea string
        if (typeof value === "string") {
          throw new Error(
            'No se aceptan valores textuales (ej: "10"), debe ser número (ej: 10)'
          );
        }
        return true;
      })
      .run(req);

  next();
};

export function hasAccess(req: Request, res: Response, next: NextFunction) {
  // * Permirtir que solo traigan presupuesto por el mismo usuario y no otro
  if (req.budget.userId !== req.user.id) {
    const error = new Error("Accion no válida");
    res.status(401).json({ error: error.message });
    return;
  }

  next();
}
