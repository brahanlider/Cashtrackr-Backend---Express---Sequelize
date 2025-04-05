import express from "express";
import colors from "colors";
import morgan from "morgan";
import { db } from "./config/db";
import budgetRouter from "./routes/budgetRouter";
import authRouter from "./routes/authRouter";

//! se puso export por errores en supertest dando error en las consolas
export async function connectDB() {
  try {
    await db.authenticate(); // ya podemos hacer operacione en la bd
    db.sync(); // crea las tablas y columnas en automatico
    console.log(colors.blue.bold("Conexión exitosa a la BD"));
  } catch (error) {
    // console.log(error);
    console.log(colors.red.bold("Falló la conexión a la BD"));
  }
}

connectDB();

//instancia => porque se reutiliza de otra clase
const app = express();

// tener .. a nuestra rest api
app.use(morgan("dev"));

app.use(express.json());

app.use("/api/budgets", budgetRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Todo bien");
});

export default app;
// const express = require("express");
// const app = express();
// const port = 3000;

// app.get("/", (req, res) => {
//   res.send("Hello word");
// });

// app.listen(port, () => {
//   console.log("app listening port: " + port);
// });
