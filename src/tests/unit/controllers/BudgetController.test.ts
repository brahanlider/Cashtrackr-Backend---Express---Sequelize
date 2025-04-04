import { createRequest, createResponse } from "node-mocks-http";
import { budgets } from "../../mocks/budgets";
import { BudgetController } from "../../../controllers/BudgetController";
import Budget from "../../../models/Budget";
import Expense from "../../../models/Expense";

jest.mock("../../../models/Budget", () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
}));

describe("BudgetController.getAll", () => {
  // antes de cada uno
  beforeEach(() => {
    (Budget.findAll as jest.Mock).mockReset();
    (Budget.findAll as jest.Mock).mockImplementation((options) => {
      const updatedBudgets = budgets.filter(
        (budget) => budget.userId === options.where.userId
      );
      return Promise.resolve(updatedBudgets);
    });
  });

  // Deberían recuperarse 2 presupuestos por usuario con ID 1
  it("should retrieve 2 budgets for user with ID 1", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 1 },
    });

    const res = createResponse();
    // (Budget.findAll as jest.Mock).mockResolvedValue(updatedBudgets); //=>elimnated
    await BudgetController.getAll(req, res);

    const data = res._getJSONData();

    expect(data).toHaveLength(2);
    expect(res.statusCode).toBe(200);
    expect(res.status).not.toBe(400);
  });

  // Deberían recuperarse 1 presupuestos for id 2
  it("should retrieve 1 budget for user with ID 2", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 2 },
    });

    const res = createResponse();
    await BudgetController.getAll(req, res);

    const data = res._getJSONData();

    expect(data).toHaveLength(1);
    expect(res.statusCode).toBe(200);
    expect(res.status).not.toBe(400);
  });

  // Deberían recuperarse 0 presupuestos for id 10
  it("should retrieve 0 budget for user with ID 10", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 100 },
    });

    const res = createResponse();
    await BudgetController.getAll(req, res);

    const data = res._getJSONData();

    expect(data).toHaveLength(0);
    expect(res.statusCode).toBe(200);
    expect(res.status).not.toBe(400);
  });

  // Debería gestionar errores al obtener presupuestos
  it("should handle errors when fetching budgets", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 100 },
    });

    const res = createResponse();

    (Budget.findAll as jest.Mock).mockRejectedValue(new Error());
    await BudgetController.getAll(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Hubo un eror" });
  });
});

describe("BudgetController.create", () => {
  // Debería crear un nuevo presupuesto y responder con el código de estado 201.
  it("Should create a new budget and respond with statusCode 201", async () => {
    const mockBudget = {
      save: jest.fn().mockResolvedValue(true),
    };
    (Budget.create as jest.Mock).mockResolvedValue(mockBudget);
    const req = createRequest({
      method: "POST",
      url: "/api/budgets",
      user: { id: 1 },
      body: { name: "Presupuesto de Prueba", amount: 1000 },
    });

    const res = createResponse();
    await BudgetController.create(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(201);
    expect(data).toBe("Presupuesto creado correctamente");
    expect(mockBudget.save).toHaveBeenCalled();
    expect(mockBudget.save).toHaveBeenCalledTimes(1);
    expect(Budget.create).toHaveBeenCalledWith(req.body);
  });

  // Debería gestionar el error de creación de presupuesto
  it("Should handle budget creation error", async () => {
    const mockBudget = {
      save: jest.fn(),
    };

    (Budget.create as jest.Mock).mockRejectedValue(new Error());
    const req = createRequest({
      method: "POST",
      url: "/api/budgets",
      user: { id: 1 },
      body: { name: "Presupuesto de Prueba", amount: 1000 },
    });

    const res = createResponse();
    await BudgetController.create(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(500);
    expect(data).toEqual({ error: "Hubo un eror" });

    expect(mockBudget.save).not.toHaveBeenCalled();
    expect(Budget.create).toHaveBeenCalledWith(req.body);
  });
});

describe("BudgetController.getById", () => {
  // antes de cada uno

  beforeEach(() => {
    (Budget.findByPk as jest.Mock).mockImplementation((id /*,include*/) => {
      const budget = budgets.filter((b) => b.id === id)[0]; //filter llama un arreglo pero queremos un objeto
      return Promise.resolve(budget);
    });
  });

  // Debería devolver un presupuesto con ID 1 y 3 gastos.
  it("Should return a budget with Id 1 and 3 expenses", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets/:budgetId",
      budget: { id: 1 },
    });

    const res = createResponse();
    await BudgetController.getById(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.expenses).toHaveLength(3);
    expect(Budget.findByPk).toHaveBeenCalled();
    expect(Budget.findByPk).toHaveBeenCalledTimes(1);
    expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id, {
      include: [Expense],
    });
  });

  // Debería devolver un presupuesto con ID 2 y 2 gastos.
  it("Should return a budget with Id 2 and 2 expenses", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets/:budgetId",
      budget: { id: 2 },
    });

    const res = createResponse();
    await BudgetController.getById(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.expenses).toHaveLength(2);
  });

  // Debería devolver un presupuesto con ID 3 y 0 gastos.
  it("Should return a budget with Id 3 and 0 expenses", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets/:budgetId",
      budget: { id: 3 },
    });

    const res = createResponse();
    await BudgetController.getById(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.expenses).toHaveLength(0);
  });
});

// req.budget.update o destro vienen del servidor y no del modelo como antes
describe("BudgetController.updateById", () => {
  // Debería actualizar el presupuesto y devolver un mensaje de éxito.
  it("Should update the budget and return a success message", async () => {
    const budgetMock = {
      update: jest.fn().mockResolvedValue(true),
    };

    const req = createRequest({
      method: "PUT",
      url: "/api/budgets/:budgetId",
      budget: budgetMock,
      body: { name: "Presupuesto Actualizado", amount: 5000 },
    });

    const res = createResponse();
    await BudgetController.updateById(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data).toBe("Presupuesto actualizado correctamente");
    expect(budgetMock.update).toHaveBeenCalled();
    expect(budgetMock.update).toHaveBeenCalledTimes(1);
    expect(budgetMock.update).toHaveBeenCalledWith(req.body);
  });
});

// req.budget.deleteById o destro vienen del servidor y no del modelo como antes
describe("BudgetController.deleteById", () => {
  // Debería actualizar el presupuesto y devolver un mensaje de éxito.
  it("Should delete the budget and return a success message", async () => {
    const budgetMock = {
      destroy: jest.fn().mockResolvedValue(true),
    };

    const req = createRequest({
      method: "DELETE",
      url: "/api/budgets/:budgetId",
      budget: budgetMock,
    });

    const res = createResponse();
    await BudgetController.deleteById(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data).toBe("Presupuesto eliminado correctamente");
    expect(budgetMock.destroy).toHaveBeenCalled();
    expect(budgetMock.destroy).toHaveBeenCalledTimes(1);
  });
});
