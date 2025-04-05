import { exit } from "node:process";
import { db } from "../config/db";

// TESTING: end o end integration test === LIMPIEZA DE DATOS
const clearData = async () => {
  try {
    await db.sync({ force: true });
    console.log("Datos Eliminados Correctamente");

    exit(0);
  } catch (error) {
    // console.log(error);
    exit(1);
  }
};

if (process.argv[2] === "--clear") {
  clearData();
}

clearData();
