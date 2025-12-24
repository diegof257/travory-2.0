const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// =====================================
// 🔌 Conexión MySQL (Docker)
// =====================================
const db = mysql.createConnection({
  host: '127.0.0.1',
  port: 3307,
  user: 'travory',
  password: 'travory',
  database: 'travory'
});

db.connect(err => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err);
  } else {
    console.log('✅ Conectado a MySQL (Docker)');
  }
});

// =====================================
// 🧪 Health check
// =====================================
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend funcionando' });
});

// =====================================
// 🔐 LOGIN
// =====================================
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT id, name, email
    FROM users
    WHERE email = ? AND password = ?
    LIMIT 1
  `;

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    res.json({
      message: 'Login correcto',
      user: results[0]
    });
  });
});

// =====================================
// ✈️ TRIPS
// =====================================


// GET viaje por ID
app.get('/trips/:id', (req, res) => {
  const { id } = req.params;

  db.query(
    'SELECT * FROM trips WHERE user_id = ?',
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Viaje no encontrado' });
      }

      res.json(results);
    }
  );
});

// POST crear viaje
app.post('/trips', (req, res) => {
  console.log('🧪 Cuerpo de la solicitud:', req.body);
  const {
    user_id,
    name,
    destination,
    start_date,
    end_date,
    description,
    status
  } = req.body;

  const sql = `
    INSERT INTO trips
    (user_id, name, destination, start_date, end_date, description, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [user_id, name, destination, start_date, end_date, description ?? null, status ?? 'UPCOMING'],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      res.status(201).json({
        message: 'Viaje creado',
        tripId: result.insertId
      });
    }
  );
});

// =====================================
// 📍 POIS
// =====================================

// GET POIs por viaje
app.get('/trips/:id/pois', (req, res) => {
  const { id } = req.params;

  db.query(
    'SELECT * FROM pois WHERE trip_id = ?',
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      res.json(results);
    }
  );
});

// POST crear POI
app.post('/pois', (req, res) => {
  const {
    trip_id,
    name,
    type,
    description,
    rating
  } = req.body;

  const sql = `
    INSERT INTO pois
    (trip_id, name, type, description, rating)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [trip_id, name, type, description, rating],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      res.status(201).json({
        message: 'POI creado',
        poiId: result.insertId
      });
    }
  );
});

// =====================================
// 🚀 Arranque del servidor
// =====================================
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
