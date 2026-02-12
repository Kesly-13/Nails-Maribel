console.log('🔥 ESTE ES EL INDEX CORRECTO 🔥');


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from './db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ===== RUTA DE PRUEBA ===== */
app.get('/', (req, res) => {
  res.send('Backend Nails funcionando');
});

/* ===== LOGIN ADMIN ===== */
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    // 🔍 Buscar SOLO en admins
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND role = "admin"',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Administrador no existe' });
    }

    const admin = rows[0];

    // 🔐 Comparar contraseña
    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // 🎟️ Token
    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

/* ===== REGISTRO CLIENTE ===== */
app.post('/auth/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO clients (name, email, phone, password) VALUES (?, ?, ?, ?)',
      [name, email, phone, hashedPassword]
    );

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar cliente' });
  }
});

/* ===== LOGIN CLIENTE ===== */
app.post('/auth/login-client', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM clients WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Cliente no existe' });
    }

    const client = rows[0];

    const isValid = await bcrypt.compare(password, client.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: client.id, role: 'client' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: client.id,
        name: client.name,
        email: client.email,
        role: 'client'
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en login cliente' });
  }
});

/* ===== CREAR CITA ===== */
app.post('/appointments', async (req, res) => {
  try {
    console.log('BODY RECIBIDO:', req.body);

    const { client_name, service, date, time } = req.body;

    if (!client_name || !service || !date || !time) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    await pool.query(
      `INSERT INTO appointments (client_name, service, date, time)
       VALUES (?, ?, ?, ?)`,
      [client_name, service, date, time]
    );

    console.log('✅ CITA GUARDADA EN BD');

    res.json({ success: true });

  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({ message: 'Error al guardar la cita' });
  }
});

app.get('/appointments', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM appointments ORDER BY date, time'
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener citas' });
  }
});

/* ===== CITA GUARDEN DESPUES DEL REGARGO  ===== */
app.get('/appointments', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM appointments ORDER BY date, time'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener citas' });
  }
});



/* ===== ACTUALIZAR ESTADO CITA ===== */
app.put('/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    await pool.query(
      'UPDATE appointments SET status = ?, reason = ? WHERE id = ?',
      [status, reason || null, id]
    );

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar cita' });
  }
});

/* ===== OBTENER FECHAS BLOQUEADAS ===== */
app.get('/blocked-dates', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT date FROM blocked_dates ORDER BY date'
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener fechas bloqueadas' });
  }
});


/* ===== BLOQUEAR FECHA ===== */
app.post('/blocked-dates', async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Fecha requerida' });
    }

    await pool.query(
      'INSERT INTO blocked_dates (date) VALUES (?)',
      [date]
    );

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'La fecha ya está bloqueada' });
  }
});


/* ===== DESBLOQUEAR FECHA ===== */
app.delete('/blocked-dates/:date', async (req, res) => {
  try {
    const { date } = req.params;

    await pool.query(
      'DELETE FROM blocked_dates WHERE date = ?',
      [date]
    );

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al desbloquear fecha' });
  }
});



/* ===== SERVIDOR ===== */
app.listen(3001, () => {
  console.log('Backend corriendo en http://localhost:3001');
});