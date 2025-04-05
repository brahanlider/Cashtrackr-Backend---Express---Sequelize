import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 1000 * 60,
  // Testing: limit ==> Modificar porque da error cuando se hace testing
  limit: process.env.NODE_END === "production" ? 5 : 100,
  message: { error: "Haz alcanzado el límite de peticiones" },
});
