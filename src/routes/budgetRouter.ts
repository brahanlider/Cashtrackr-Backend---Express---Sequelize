import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  console.log("Desde /api/budgets");
});

export default router;
