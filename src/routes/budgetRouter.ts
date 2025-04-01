import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import Budget from "../models/Budget";
import { validateBudgetExists, validateBudgetId } from "../middleware/budget";

const router = Router();

router.get("/", BudgetController.getAll);
router.get(
  "/:id",
  validateBudgetId,
  validateBudgetExists,
  BudgetController.getById
);
router.post(
  "/",
  body("name")
    .notEmpty()
    .withMessage("El nombre del presupuesto es obligatorio"),
  body("amount")
    .notEmpty()
    .withMessage("La cantidad del presupuesto no puede ir vacio")
    .isNumeric()
    .withMessage("Cantidad no válida")
    .custom((value) => value > 0)
    .withMessage("El presupuesto debe ser mayor a 0"),

  handleInputErrors,
  BudgetController.create
);
router.put(
  "/:id",
  validateBudgetId,
  validateBudgetExists,

  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre del presupuesto es obligatorio"),

  body("amount")
    .notEmpty()
    .withMessage("La cantidad no puede estar vacía")
    .isFloat({ min: 0.01 }) // Acepta decimales y valida tipo number
    .withMessage("Debe ser un número válido mayor a 0")
    .custom((value) => {
      if (typeof value !== "number") {
        throw new Error("Debe ser un número (no texto)");
      }
      return true;
    }),

  handleInputErrors,
  BudgetController.updateById
);
router.delete(
  "/:id",
  validateBudgetId,
  validateBudgetExists,

  handleInputErrors,
  BudgetController.deleteById
);

export default router;
