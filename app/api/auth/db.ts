// auth/db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv'; // To load environment variables
dotenv.config();  // Load variables from .env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export default pool;
