import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Prevenir duplicados => email
    const userExists = await User.findOne({
      where: {
        email,
      },
    });
    if (userExists) {
      const error = new Error("Un usuario con ese email ya esta registrado");
      res.status(409).json({ error: error.message });
      return;
    }

    try {
      const user = new User(req.body);
      user.password = await hashPassword(password);
      user.token = generateToken();
      await user.save();

      await AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: user.token,
      });

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    const { token } = req.body;

    const user = await User.findOne({
      where: {
        token: token,
      },
    });

    if (!user) {
      const error = new Error("Token no válido");
      res.status(401).json({ error: error.message });
      return;
    }

    user.confirmed = true;
    user.token = null; //una vez confirmado => el token desaparece

    await user.save();

    // res.json(user);
    res.json("Cuenta confirmada correctamente");
  };

  static loginAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    //1. Revisar que el usuario existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error("Usuario no encontrado");
      res.status(404).json({ error: error.message });
      return;
    }

    //2. Revisar si la cuenta fue confimada                        (403 = cuando no tiene sentido hacer re autenticacion)
    if (!user.confirmed) {
      const error = new Error("La Cuenta no ha sido confirmada");
      res.status(403).json({ error: error.message });
      return;
    }

    //4. Chequear la contraseña
    const isPasswordCorrect = await checkPassword(password, user.password);
    if (!isPasswordCorrect) {
      const error = new Error("Password Incorrecto");
      res.status(401).json({ error: error.message });
      return;
    }

    //5.
    const token = generateJWT(user.id);

    res.json(token);
  };
}
