import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import Budget from "../models/Budget";
import {
  validateBudgetExists,
  validateBudgetId,
  validateBudgetInput,
} from "../middleware/budget";

const router = Router();

router.param("budgetId", validateBudgetId);
router.param("budgetId", validateBudgetExists);

router.get("/", BudgetController.getAll);
router.get("/:budgetId", BudgetController.getById);
router.post(
  "/",
  validateBudgetInput,
  handleInputErrors,
  BudgetController.create
);
router.put(
  "/:budgetId",
  validateBudgetInput,
  handleInputErrors,
  BudgetController.updateById
);
router.delete("/:budgetId", BudgetController.deleteById);

export default router;
