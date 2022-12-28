import * as pg from 'pg'
import * as dotenv from 'dotenv' 

const { Pool, Client } = pg.default
dotenv.config()

const config = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
}

const pool = new Pool(config)
export default pool;
