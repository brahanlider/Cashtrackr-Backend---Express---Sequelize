# 🚀 Configuración de Express + Sequelize con TypeScript y PostgreSQL

## 📦 Prerrequisitos

- Node.js v18+
- PostgreSQL 15+
- npm o yarn

### 1. Instalar dependencias principales

```bash
npm i express color morgan
npm i -D @types/express nodemon ts-node typescript @types/morgan
```

## Crear archivo - tsconfig.json

```bash
npx tsc --init
```

```json
{
  "compilerOptions": {
    "outDir": "./dir",
    "rootDir": "./src",
    "lib": ["esnext"],
    "target": "ESNext",
    "moduleResolution": "NodeNext",
    "module": "NodeNext",
    "strict": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "declaration": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*.ts"]
}
```

## 🚦 package.json

```json
"scripts": {
"dev": "nodemon src/index.ts",
"dev:api": "nodemon src/index.ts --api",
"build": "tsc",
"start": "node ./dist/index.js"
},
```

## 🔄 RENDER ( + New => PostgreSQL)

- Variables con sequelize para render para la DB
- "pg pg-hstore" es para postgreSQL

```bash
 npm i dotenv sequelize-typescript pg pg-hstore
```

```bash
mkdir config/db.ts
```

```typescript
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
```

## env

- Tambien para conectar a la dbBeaver,etc.

```bash
DATABASE_URL =  postgresql://External Database URL
```

- Luego conectarse a dbBeaver o TablePlus

## 🖥 Conexión con DBeaver/TablePlus

Datos de conexión:

- Host: dpg-xxxxxx-a.oregon-postgres.render.com

- Port: 5432

- Database: nombre_db

- Username: nombre_db_user

- Password: contraseña_proporcionada_por_render


# TEST
npm i -D jest @types/jest ts-jest
npx ts-jest config:init

npm i -D node-mocks-http