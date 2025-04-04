import { createRequest, createResponse } from "node-mocks-http";
import Expense from "../../../models/Expense";
import { ExpenseController } from "../../../controllers/ExpenseController";
import { expenses } from "../../mocks/expenses";

jest.mock("../../../models/Expense", () => ({
  create: jest.fn(),
}));

describe("ExpenseController.create", () => {
  // Debería crear un nuevo gasto
  it("Should create a new expense", async () => {
    const expenseMock = {
      save: jest.fn(),
    };

    (Expense.create as jest.Mock).mockResolvedValue(expenseMock);

    const req = createRequest({
      method: "POST",
      url: "/api/budgets/:budgetId/expenses",
      body: { name: "Test Expense", amount: 100 },
      budget: { id: 1 },
    });

    const res = createResponse();

    await ExpenseController.create(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(201);
    expect(data).toEqual("Gasto Agregado Correctamente");
    expect(expenseMock.save).toHaveBeenCalled();
    expect(expenseMock.save).toHaveBeenCalledTimes(1);
    expect(Expense.create).toHaveBeenCalledWith(req.body);
  });

  // Debería gestionarse el error de creación de gastos
  it("Should handle expense creation error", async () => {
    const expenseMock = {
      save: jest.fn().mockResolvedValue(true),
    };

    (Expense.create as jest.Mock).mockRejectedValue(new Error());

    const req = createRequest({
      method: "POST",
      url: "/api/budgets/:budgetId/expenses",
      body: { name: "Test Expense", amount: 100 },
      budget: { id: 1 },
    });

    const res = createResponse();

    await ExpenseController.create(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(500);
    expect(data).toEqual({ error: "Hubo un error" });
    expect(expenseMock.save).not.toHaveBeenCalled();
    expect(Expense.create).toHaveBeenCalledWith(req.body);
  });
});

describe("ExpenseController.getByID", () => {
  // Debe devolver el gasto con ID
  it("Should return expense with ID 1", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: expenses[0],
    });

    const res = createResponse();

    await ExpenseController.getById(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data).toEqual(expenses[0]);
  });
});

describe("ExpenseController.updateById", () => {
  // Debería actualizar el gasto y devolver un mensaje de éxito.
  it("Should update expense and return a success message", async () => {
    const expenseMock = {
      ...expenses[0],
      update: jest.fn(),
    };

    const req = createRequest({
      method: "PUT",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: expenseMock,
      body: { name: "Updated Expense", amount: 100 },
    });

    const res = createResponse();

    await ExpenseController.updateById(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data).toBe("Se actualizó correctamente el gasto");
    expect(expenseMock.update).toHaveBeenCalled();
    expect(expenseMock.update).toHaveBeenCalledTimes(1);
    expect(expenseMock.update).toHaveBeenCalledWith(req.body);
  });
});

describe("ExpenseController.deleteById", () => {
  //  Debería eliminar el gasto y devolver un mensaje de éxito.
  it("Should delete expense and return a success message", async () => {
    const expenseMock = {
      ...expenses[0],
      destroy: jest.fn(),
    };

    const req = createRequest({
      method: "DELETE",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: expenseMock,
    });

    const res = createResponse();

    await ExpenseController.deleteById(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data).toBe("Gasto Eliminado Correctamente");
    expect(expenseMock.destroy).toHaveBeenCalled();
    expect(expenseMock.destroy).toHaveBeenCalledTimes(1);
  });
});
