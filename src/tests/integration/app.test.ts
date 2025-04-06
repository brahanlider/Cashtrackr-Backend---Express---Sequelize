import request from "supertest";
import server from "../../server";
import { AuthController } from "../../controllers/AuthController";
import User from "../../models/User";
import * as authUtils from "../../utils/auth";
import * as jwtUtils from "../../utils/jwt";

describe("Authentication - Create Account", () => {
  beforeEach(() => {
    jest.resetAllMocks(); // Resetea los mocks antes de cada prueba / no se hereden
  });

  // Debería mostrar errores de validación cuando los formularios estén vacíos
  it("Should display validation errors when forms is empty", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({});

    const createAccountMock = jest.spyOn(AuthController, "createAccount");

    // console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(3);
    // console.log(response.body.errors);
    expect(response.status).not.toBe(201);
    expect(response.body.errors).not.toHaveLength(2);
    expect(createAccountMock).not.toHaveBeenCalled();
  });

  //*errors: extension del email
  // Debería devolver 400 status code cuando el correo electrónico no sea válido
  it("Should return 400 status code when the email is invalid", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({
        name: "Brahan",
        password: "12345678",
        email: "not_invalid_email",
      });

    const createAccountMock = jest.spyOn(AuthController, "createAccount");

    // console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("E-mail no válido");
    expect(response.status).not.toBe(201);
    expect(response.body.errors).not.toHaveLength(2);
    expect(createAccountMock).not.toHaveBeenCalled();
  });

  //*errors: extension del password
  // Debe devolver el código de estado 400 cuando la contraseña tenga menos de 8 caracteres
  it("Should return 400 status code when the password is less than 8 characters", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({
        name: "Brahan",
        password: "1234567",
        email: "test@test.com",
      });

    const createAccountMock = jest.spyOn(AuthController, "createAccount");

    // console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe(
      "El password es muy corto, mínimo 8 caracteres"
    );
    expect(response.status).not.toBe(201);
    expect(response.body.errors).not.toHaveLength(2);
    expect(createAccountMock).not.toHaveBeenCalled();
  });

  //* CREAR USUARIO
  // Debería registrarse un nuevo usuario exitosamente
  it("Should register a new user successfully", async () => {
    const userData = {
      name: "Brahan",
      password: "12345678",
      email: "test@test.com",
    };

    const response = await request(server)
      .post("/api/auth/create-account")
      .send(userData);

    expect(response.status).toBe(201);

    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty("errors");
  });

  // Debería devolver el conflicto 409 cuando un usuario ya está registrado
  it("Should return 409 conflict when a user is already registered", async () => {
    const userData = {
      name: "Brahan",
      password: "12345678",
      email: "test@test.com",
    };

    const response = await request(server)
      .post("/api/auth/create-account")
      .send(userData);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe(
      "Un usuario con ese email ya esta registrado"
    );

    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(201);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("Authentication - Account Confirmation with token", () => {
  // Debería mostrarse un error si el token está vacío o si el token es inválido
  it("Should display error if token is empty or token is not valid", async () => {
    const response = await request(server)
      .post("/api/auth/confirm-account")
      .send({
        token: "not_valid",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Token no válido");
  });

  // Debería mostrarse un error si el token no existe
  it("Should display error if token doesn't exists", async () => {
    const response = await request(server)
      .post("/api/auth/confirm-account")
      .send({
        token: "123456",
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Token no válido");
    expect(response.status).not.toBe(200);
  });

  // Debe confirmar la cuenta con un token válido
  it("Should confirm account with a valid token", async () => {
    const token = globalThis.cashTrackrConfirmationToken;

    const response = await request(server)
      .post("/api/auth/confirm-account")
      .send({ token: token });

    // console.log(globalThis);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("Cuenta confirmada correctamente");
    expect(response.status).not.toBe("401");
  });
});

describe("Authentication - Login", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // limpia los mock previos y el contador se reinicia
  });
  // Debería mostrar errores de validación cuando el formulario esté vacío
  it("Should display validation errors when the form is empty", async () => {
    const response = await request(server).post("/api/auth/login").send({});

    const loginMock = jest.spyOn(AuthController, "loginAccount");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2);

    expect(response.body.errors).not.toHaveLength(1);
    expect(loginMock).not.toHaveBeenCalled();
  });

  // Debería mostrar errores de validación cuando el formulario esté vacío
  it("Should return 400 bad request when the email is invalid", async () => {
    const response = await request(server)
      .post("/api/auth/login")
      .send({ password: "password", email: "not_valid" });

    const loginMock = jest.spyOn(AuthController, "loginAccount");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Email no válido");

    expect(response.body.errors).not.toHaveLength(2);
    expect(loginMock).not.toHaveBeenCalled();
  });

  // controller usuario que no existe
  // Debería devolver un error 400 si no se encuentra el usuario
  it("Should return 400 error if the User is not found", async () => {
    const response = await request(server)
      .post("/api/auth/login")
      .send({ password: "password", email: "user_not_found@test.com" });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Usuario no encontrado");

    expect(response.status).not.toBe(200);
  });

  // Cuando un usuario no ha sido confirmado
  // Debería devolver un error 403 si la cuenta de usuario no está confirmada
  it("Should return a 403 error if the User account is not confirmed", async () => {
    //! ==> OTRA FORMAS: registrarse y loguearse sin confirmar
    (jest.spyOn(User, "findOne") as jest.Mock).mockResolvedValue({
      id: 1,
      confirmed: false,
      password: "hashedPassword",
      email: "user_not_confirmed@test.com",
    });

    const response = await request(server)
      .post("/api/auth/login")
      .send({ password: "password", email: "user_not_confirmed@test.com" });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("La Cuenta no ha sido confirmada");

    expect(response.status).not.toBe(200);
    expect(response.status).not.toBe(400);
  });

  // //! ==> OTRA FORMAS: registrarse y loguearse sin confirmar

  // Cuando un usuario no ha sido confirmado
  // Debería devolver un error 403 si la cuenta de usuario no está confirmada
  it("Should return a 403 error if the User account is not confirmed", async () => {
    const userData = {
      name: "Test",
      password: "password",
      email: "user_not_confirmed@test.com",
    };
    await request(server).post("/api/auth/create-account").send(userData);

    const response = await request(server)
      .post("/api/auth/login")
      .send({ password: userData.password, email: userData.email });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("La Cuenta no ha sido confirmada");

    expect(response.status).not.toBe(200);
    expect(response.status).not.toBe(400);
  });

  // verificar si el password es correcto
  // Debería devolver un error 401 si la contraseña es incorrecta
  it("Should return a 401 error if the password is incorrect", async () => {
    const findOne = (
      jest.spyOn(User, "findOne") as jest.Mock
    ).mockResolvedValue({
      id: 1,
      confirmed: true,
      password: "hashedPassword",
      email: "user_confirmed@test.com",
    });

    const checkPassword = jest
      .spyOn(authUtils, "checkPassword")
      .mockResolvedValue(false);

    const response = await request(server).post("/api/auth/login").send({
      password: "password_incorrecto",
      email: "user_confirmed@test.com",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Password Incorrecto");

    expect(response.status).not.toBe(200);
    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(403);

    expect(findOne).toHaveBeenCalledTimes(1);
    expect(checkPassword).toHaveBeenCalledTimes(1);
  });

  // exito
  // Should return a jwt
  it("Should return a jwt", async () => {
    const findOne = (
      jest.spyOn(User, "findOne") as jest.Mock
    ).mockResolvedValue({
      id: 1,
      confirmed: true,
      password: "hashedPassword",
      email: "user_confirmed@test.com",
    });

    const checkPassword = jest
      .spyOn(authUtils, "checkPassword")
      .mockResolvedValue(true);

    const generateJWT = jest
      .spyOn(jwtUtils, "generateJWT")
      .mockReturnValue("jwt_token");

    const response = await request(server).post("/api/auth/login").send({
      password: "password_correct",
      email: "user_confirmed@test.com",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual("jwt_token");

    expect(findOne).toHaveBeenCalled();
    expect(findOne).toHaveBeenCalledTimes(1);

    expect(checkPassword).toHaveBeenCalled();
    expect(checkPassword).toHaveBeenCalledTimes(1);
    expect(checkPassword).toHaveBeenCalledWith(
      "password_correct",
      "hashedPassword"
    );

    expect(generateJWT).toHaveBeenCalled();
    expect(generateJWT).toHaveBeenCalledTimes(1);
    expect(generateJWT).toHaveBeenCalledWith(1); //user.id
  });
});

//*_______________ Presupuesto - Budgets______________________

//===> generando datos user reales
let jwt: string;
async function authenticateUser() {
  const response = await request(server).post("/api/auth/login").send({
    email: "test@test.com",
    password: "12345678",
  });
  jwt = response.body;

  expect(response.status).toBe(200);
  // console.log(response.body);
}

describe("GET /api/budgets", () => {
  beforeAll(() => {
    jest.restoreAllMocks(); // restaurar las funciones de las jest.py a su implementacion original
  });

  //conseguimos datos reales (token)
  beforeAll(async () => {
    await authenticateUser();
  });

  // Debería rechazarse el acceso no autenticado a los presupuestos sin un jwt
  it("Should reject unauthenticated access to budgets without a jwt", async () => {
    const response = await request(server).get("/api/budgets");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("No Autorizado");
  });

  // no valid token
  // Debería permitir el acceso autenticado a los presupuestos sin un jwt válido
  it("Should allow authenticated access to budgets without a valid jwt", async () => {
    const response = await request(server)
      .get("/api/budgets")
      .auth("not_valid", { type: "bearer" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Token no válido");
  });

  // Debería permitir el acceso autenticado a los presupuestos con un jwt válido
  it("Should allow authenticated access to budgets with a valid jwt", async () => {
    const response = await request(server)
      .get("/api/budgets")
      .auth(jwt, { type: "bearer" });

    expect(response.body).toHaveLength(0);

    expect(response.status).not.toBe(401);
    expect(response.body.error).not.toBe("No Autorizado");
  });
});

describe("POST /api/budgets", () => {
  //conseguimos datos reales (token)
  beforeAll(async () => {
    await authenticateUser();
  });

  // Debería rechazar solicitudes de publicación no autenticadas a presupuestos sin un jwt
  it("Should reject unauthenticated post request to budgets without a jwt", async () => {
    const response = await request(server).post("/api/budgets");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("No Autorizado");
  });

  // Debe mostrar validación cuando se envía el formulario con datos no válidos
  it("Should display validation when the form is submitted with invalid data", async () => {
    const response = await request(server)
      .post("/api/budgets")
      .auth(jwt, { type: "bearer" })
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(3);
  });

  // Debe mostrar validación cuando se envía el formulario con datos no válidos
  it("Should display validation when the form is submitted with invalid data", async () => {
    const response = await request(server)
      .post("/api/budgets")
      .auth(jwt, { type: "bearer" })
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(3);
  });

  //! CREANDO budget presupuesto POST
  it("CREANDO  budget presupuesto", async () => {
    const response = await request(server)
      .post("/api/budgets")
      .auth(jwt, { type: "bearer" })
      .send({
        name: "Vacaciones",
        amount: 2000,
      });

    expect(response.status).toBe(201);

    expect(response.status).not.toBe(200);
    expect(response.status).not.toBe(400);
  });
});

describe("GET /api/budgets/:budgetId", () => {
  //conseguimos datos reales (token)
  beforeAll(async () => {
    await authenticateUser();
  });

  // Debe rechazar solicitudes GET no autenticadas para obtener ID de presupuestos sin un JWT.
  it("Should reject unauthenticated get request to budgets id without a jwt", async () => {
    const response = await request(server).get("/api/budgets/1");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("No Autorizado");
  });

  // Debería devolver 400 solicitudes incorrectas cuando la identificación no es válida
  it("Should return 400 bad request when id is not valid", async () => {
    const response = await request(server)
      .get("/api/budgets/not_valid")
      .auth(jwt, { type: "bearer" });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe(
      "El ID debe ser un número entero positivo"
    );

    expect(response.status).not.toBe(401);
    expect(response.body.error).not.toBe("No Autorizado");
  });

  // Debería devolver 404 no encontrado cuando no existe un presupuesto
  it("Should return 404 not found when a budget does not exists", async () => {
    const response = await request(server)
      .get("/api/budgets/5000")
      .auth(jwt, { type: "bearer" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Presupuesto no encontrado");

    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(401);
  });

  // Debería devolver un único presupuesto por id
  it("Should return a single budget by id", async () => {
    const response = await request(server)
      .get("/api/budgets/1")
      .auth(jwt, { type: "bearer" });

    expect(response.status).toBe(200);

    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(404);
  });
});

describe("PUT /api/budgets/:budgetId", () => {
  //conseguimos datos reales (token)
  beforeAll(async () => {
    await authenticateUser();
  });

  // Debe rechazar solicitudes put no autenticadas para obtener ID de presupuestos sin un JWT.
  it("Should reject unauthenticated put request to budgets id without a jwt", async () => {
    const response = await request(server).put("/api/budgets/1");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("No Autorizado");
  });

  // Debería mostrar errores de validación si el formulario está vacío
  it("Should display validation errors if the form is empty", async () => {
    const response = await request(server)
      .put("/api/budgets/1")
      .auth(jwt, { type: "bearer" })
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(3);
  });

  // Debe actualizar un presupuesto por identificación y devolver un mensaje de éxito
  it("Should update a budget by id and return a success message", async () => {
    const response = await request(server)
      .put("/api/budgets/1")
      .auth(jwt, { type: "bearer" })
      .send({
        name: "Gratificacion",
        amount: 1000,
      });

    expect(response.status).toBe(200);
    expect(response.body).toBe("Presupuesto actualizado correctamente");
  });

  // !!!!!!!!
  // * FATAL VILIDAR POR TOKEN --- RARO
});

describe("DELETE /api/budgets/:budgetId", () => {
  //conseguimos datos reales (token)
  beforeAll(async () => {
    await authenticateUser();
  });

  // Debe rechazar solicitudes delete no autenticadas para obtener ID de presupuestos sin un JWT.
  it("Should reject unauthenticated delete request to budgets id without a jwt", async () => {
    const response = await request(server).delete("/api/budgets/1");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("No Autorizado");
  });

  // Debería devolver 404 no encontrado cuando no existe un presupuesto
  it("Should return 404 not found when a budget does not exists", async () => {
    const response = await request(server)
      .delete("/api/budgets/3000")
      .auth(jwt, { type: "bearer" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Presupuesto no encontrado");
  });

  // Debería eliminar un presupuesto y devolver un mensaje de éxito
  it("Should delete a budget and return a success message", async () => {
    const response = await request(server)
      .delete("/api/budgets/1")
      .auth(jwt, { type: "bearer" });

    expect(response.status).toBe(200);
    expect(response.body).toBe("Presupuesto eliminado correctamente");
  });

  // !!!!!!!!
  // * FATAL VILIDAR POR TOKEN --- NOSE NO PROBE
});