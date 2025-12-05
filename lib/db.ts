// lib/db.ts
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Tipos explícitos
type QueryResult = any[];
type RowDataPacket = any;
type ResultSetHeader = mysql.ResultSetHeader;

export async function query<T = RowDataPacket>(sql: string, params?: any[]): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function execute(sql: string, params?: any[]): Promise<ResultSetHeader> {
  try {
    const [result] = await pool.execute(sql, params);
    return result as ResultSetHeader;
  } catch (error) {
    console.error('Database execute error:', error);
    throw error;
  }
}

// Função auxiliar para obter um único registro
export async function queryOne<T = RowDataPacket>(sql: string, params?: any[]): Promise<T | null> {
  try {
    const results = await query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Database queryOne error:', error);
    throw error;
  }
}

export default pool;