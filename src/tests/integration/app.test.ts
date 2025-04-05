import request from "supertest";
import server from "../../server";
import { AuthController } from "../../controllers/AuthController";

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
