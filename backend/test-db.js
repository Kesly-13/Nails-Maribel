import { pool } from './db.js';

const test = async () => {
  const [rows] = await pool.query('SELECT 1');
  console.log('Conexión OK', rows);
};

test();
