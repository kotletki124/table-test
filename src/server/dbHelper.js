import { Pool } from 'pg';
import 'dotenv/config';

const dbConfig = {
  user: 'user',
  host: 'localhost',
  database: 'testdb',
  password: '123',
  port: 5432,
};

export const tableName = 'products';

const poolInitObj =
  process.env.USE_LOCAL_DB === 'true'
    ? dbConfig
    : {
        connectionString: `${process.env.POSTGRES_URL}?sslmode=require`,
      };

const pool = new Pool(poolInitObj);

export async function executeQuery(query, values) {
  const client = await pool.connect();

  try {
    const result = await client.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    client.release();
  }
}
