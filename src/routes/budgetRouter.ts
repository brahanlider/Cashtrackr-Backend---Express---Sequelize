import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import {
  validateBudgetExists,
  validateBudgetId,
  validateBudgetInput,
} from "../middleware/budget";
import { ExpenseController } from "../controllers/ExpenseController";
import {
  validateExpenseExists,
  validateExpenseId,
  validateExpenseInput,
} from "../middleware/expense";

const router = Router();

router.param("budgetId", validateBudgetId);
router.param("budgetId", validateBudgetExists);

router.param("expenseId", validateExpenseId);
router.param("expenseId", validateExpenseExists);

//* Router for Budgets
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

//* Router for Expenses / PATRON (ROA) budgetId recursos / gasto---------
router.get("/:budgetId/expenses/:expenseId", ExpenseController.getById);
router.post(
  "/:budgetId/expenses",
  validateExpenseInput,
  handleInputErrors,
  ExpenseController.create
);
router.put(
  "/:budgetId/expenses/:expenseId",
  validateExpenseInput,
  handleInputErrors,
  ExpenseController.updateById
);
router.delete("/:budgetId/expenses/:expenseId", ExpenseController.deleteById);

export default router;
