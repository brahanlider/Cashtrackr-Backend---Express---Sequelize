import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

// Configuración de variables de entorno
dotenv.config();

export const db = new Sequelize(process.env.DATABASE_URL, {
  // Configuración de modelos (ruta segura con path.resolve)
  models: [__dirname + "/../models/**/*"],
  //// Configuración de logs (solo en desarrollo)
  //// logging: false,

  //// Configuración de timestamps (mejor práctica): created etc
  //// define: {
  ////   timestamps: false,
  //// },

  // Configuración SSL segura para producción
  dialectOptions: {
    ssl: {
      require: false, // Obligatorio para entornos cloud
    },
  },
});
