import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

dotenv.config();

export const db = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    // ssl => porque no tenemos un certificado seguro (corregir)
    ssl: {
      require: false,
    },
  },
});
