console.log('Ejecutando createAdmin.js');

import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

async function createAdmin() {
  console.log('Conectando a TiDB...');

  const connection = await mysql.createConnection({
    host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
    user: '2y1ALRjXvo2JGcV.root',
    password: 'X4r8nrY36Doq2dIB',
    database: 'nails_db',
    port: 4000,
    ssl: { rejectUnauthorized: true }
  });

  console.log('Conectado a TiDB');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await connection.execute(
    `INSERT INTO users (name, email, password, role)
     VALUES (?, ?, ?, ?)`,
    ['Admin Nails', 'admin@nails.com', hashedPassword, 'admin']
  );

  console.log('Admin creado correctamente');

  await connection.end();
}

createAdmin();

