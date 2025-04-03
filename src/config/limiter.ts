import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 1000 * 60,
  limit: 5,
  message: { error: "Haz alcanzado el límite de peticiones" },
});
