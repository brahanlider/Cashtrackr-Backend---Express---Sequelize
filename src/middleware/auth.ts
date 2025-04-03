import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// Extensión del tipo Request de Express para añadir la propiedad user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Verificar presencia del header Authorization
  const bearer = req.headers.authorization;
  if (!bearer) {
    const error = new Error("No Autorizado");
    res.status(401).json({ error: error.message });
    return;
  }

  // 2. Extraer el token del formato "Bearer <token>"
  const [, token] = bearer.split(" ");
  if (!token) {
    const error = new Error("Token No Autorizado");
    res.status(401).json({ error: error.message });
    return;
  }

  // 3. Verificar y decodificar el token JWT
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 4. Verificar que el payload decodificado tiene la estructura esperada

    if (typeof decoded === "object" && decoded.id) {
      // 5. Buscar usuario en la base de datos usando el ID del token
      req.user = await User.findByPk(decoded.id, {
        attributes: ["id", "name", "email"],
      });

      // res.json(user);
      next();
    }
  } catch (error) {
    res.status(500).json({ error: "Token no válido" });
  }

  //// res.json(req.headers.authorization)
};
