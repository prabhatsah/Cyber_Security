import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.PG_HOST as string,
  user: process.env.PG_USER as string,
  password: process.env.PG_PASSWORD as string,
  database: process.env.PG_DATABASE as string,
  port: Number(process.env.PG_PORT) || 5432,
});

export default pool;
