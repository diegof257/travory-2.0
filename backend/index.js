const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const axios = require('axios');

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
  console.log('Hola'+res);
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


// GET viaje por usuario
app.get('/user/trips/:id', (req, res) => {
  const { id } = req.params;
  console.log('Obteniendo viaje con ID:', id);
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

// GET viaje por usuario
app.get('/user/preferences/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    'SELECT * FROM user_preferences WHERE user_id = ?',
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Preferencias no encontradas' });
      }

      res.json(results);
    }
  );
});


// GET viaje id
app.get('/trips/:id', (req, res) => {
  const { id } = req.params;
  console.log('Obteniendo viaje con ID:', id);
  db.query(
    'SELECT * FROM trips WHERE id = ?',
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
// 🏠 HOME
// =====================================
app.get('/home/:userId', (req, res) => {
  const { userId } = req.params;
console.log('Fetching home data for user:', userId);
  const statsQuery = `
    SELECT
      COUNT(*) AS total,
      SUM(end_date >= CURDATE()) AS upcoming
    FROM trips
    WHERE user_id = ?
  `;

  const nextTripQuery = `
    SELECT id, destination, start_date, end_date
    FROM trips
    WHERE user_id = ?
      AND start_date >= CURDATE()
    ORDER BY start_date ASC
    LIMIT 1
  `;

  db.query(statsQuery, [userId], (err, statsResult) => {
    if (err) return res.status(500).json(err);

    db.query(nextTripQuery, [userId], (err, tripResult) => {
      if (err) return res.status(500).json(err);

      res.json({
        stats: statsResult[0],
        nextTrip: tripResult[0] || null
      });
    });
  });
});

// GET viajes por usuario
app.get('/users/:userId/trips', (req, res) => {
  const { userId } = req.params;

  db.query(
    'SELECT * FROM trips WHERE user_id = ? ORDER BY start_date DESC',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

// =====================================
// ❤️ USER PREFERENCES
// =====================================
app.get('/users/:userId/preferences', (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      preference_type,
      preference_level,
      source,
      updated_at
    FROM user_preferences
    WHERE user_id = ?
    ORDER BY preference_level DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('❌ Error obteniendo preferencias:', err);
      return res.status(500).json({ error: 'Error obteniendo preferencias' });
    }

    res.json({
      userId: Number(userId),
      preferences: results.map(row => ({
        type: row.preference_type,
        level: row.preference_level,
        source: row.source,
        updatedAt: row.updated_at
      }))
    });
  });
});

// Obetener detalles del itinerario
app.get('/itinerary/:id', (req, res) => {
  const { id } = req.params;

  const query_itinerary = 'SELECT '
  +'t.id AS trip_id, '
  +'t.name, '
  +'t.destination, '
  +'t.start_date, '
  +'t.end_date, '
  +'t.status, '
  +'t.created_at, '
  +'i.id                AS itinerary_id, '
  +'i.name              AS itinerary_name, '
  +'ii.id               AS item_id,'
  +'ii.type, '
  +'ii.title, '
  +'ii.description, '
  +'ii.start_datetime, '
  +'ii.end_datetime, '
  +'ii.location, '
  +'ii.status           AS item_status '
+'FROM trips t '
+'LEFT JOIN itineraries i '
 +' ON i.trip_id = t.id '
+'LEFT JOIN itinerary_items ii '
  +'ON ii.itinerary_id = i.id '
+'WHERE t.id = ? '
+'ORDER BY ii.start_datetime ASC;'
  
  db.query(
    query_itinerary,
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      const mappedResult = mapTripWithItinerary(results);

      if (!mappedResult) {
        return res.status(404).json({ error: 'Viaje no encontrado' });
      }

      res.json(mappedResult);
    }
  );
});

function mapTripWithItinerary(rows) {
  if (!rows || rows.length === 0) return null;

  const first = rows[0];
  const trip = {
    id: first.trip_id,
    name: first.name,
    destination: first.destination,
    start_date: first.start_date,
    end_date: first.end_date,
    status: first.status,
    created_at: first.created_at,

    itinerary: {
      id: first.itinerary_id,
      name: first.itinerary_name,
      items: []
    }
  };

  rows.forEach(row => {
    if (row.item_id) {
      trip.itinerary.items.push({
        id: row.item_id,
        type: row.type,
        title: row.title,
        description: row.description,
        start_datetime: row.start_datetime,
        end_datetime: row.end_datetime,
        location: row.location,
        status: row.item_status
      });
    }
  });

  return { trip };
}



// =====================================
// 🤖 GENERAR ITINERARIO CON IA
// =====================================

app.post('/trips/:tripId/itineraries/ai', async (req, res) => {
  const { tripId } = req.params;
  console.log('Generando itinerario IA para viaje ID:', tripId);  
  try {
    /**
     * 1️⃣ Llamar al webhook de n8n (agente IA)
     * El body lo reenvías tal cual (mensaje, preferencias, viaje, etc.)
     */
    const aiResponse = await axios.post(
      'http://localhost:5678/webhook/itinerary',
      req.body
    );

    /**
     * 2️⃣ Extraer el itinerario del payload
     */
    const aiItinerary = aiResponse.data?.output?.[0];
    console.log('Itinerario IA recibido:', aiItinerary);

    if (!aiItinerary || !Array.isArray(aiItinerary.items)) {
      return res.status(400).json({
        error: 'Respuesta de IA inválida o incompleta'
      });
    }

    /**
     * 3️⃣ Crear el itinerario (tabla itineraries)
     * El backend manda sobre status, source y trip_id
     */
    const insertItinerarySql = `
      INSERT INTO itineraries
      (trip_id, name, status, source, notes)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    db.query(
      insertItinerarySql,
      [
        tripId,
        aiItinerary.name || 'Itinerario generado por IA',
        'draft',
        'ai',
        aiItinerary.notes || null
      ],
      (err, itineraryResult) => {
        if (err) {
          console.error('❌ Error creando itinerario:', err);
          return res.status(500).json({
            error: 'Error creando itinerario'
          });
        }

        const itineraryId = itineraryResult.insertId;

        /**
         * 4️⃣ Insertar los elementos del itinerario
         */
        const insertItemSql = `
          INSERT INTO itinerary_items
          (
            itinerary_id,
            type,
            title,
            description,
            start_datetime,
            end_datetime,
            location,
            status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        let insertedItems = 0;
        
        for (const item of aiItinerary.items) {
          const startDatetime = normalizeDatetime(item.start_datetime, "09:00");
          const endDatetime   = normalizeDatetime(item.end_datetime, "11:00");
          db.query(
            insertItemSql,
            [
              itineraryId,
              item.type,
              item.title,
              item.description || null,
              startDatetime, // start_datetime (puedes mejorar esto luego)
              endDatetime, // end_datetime
              item.location || null,
              'pending'
            ],
            err => {
              if (err) {
                console.error('❌ Error insertando item:', err);
              } else {
                insertedItems++;
              }
            }
          );
        }

        /**
         * 5️⃣ Respuesta final
         */
        res.status(201).json({
          message: 'Itinerario generado y guardado correctamente',
          itineraryId,
          itemsInserted: aiItinerary.items.length
        });
      }
    );

  } catch (error) {
    console.error('❌ Error generando itinerario con IA:', error);
    res.status(500).json({
      error: 'Error generando itinerario con IA'
    });
  }
});


// =====================================
// 💬 CHAT CON MEMORIA (Travory)
// =====================================
app.post('/chat', async (req, res) => {
  const { userId, conversationId, message } = req.body;

  if (!userId || !conversationId || !message) {
    return res.status(400).json({
      error: 'userId, conversationId y message son obligatorios'
    });
  }

  try {
    /* =====================================================
     * 1️⃣ HISTORIAL (solo apoyo de tono, NO memoria)
     * ===================================================== */
    const historySql = `
      SELECT role, content
      FROM chat_messages
      WHERE user_id = ? AND conversation_id = ?
      ORDER BY created_at ASC
      LIMIT 6
    `;

    const [historyRows] = await db
      .promise()
      .query(historySql, [userId, conversationId]);

    const history = historyRows.map(row => ({
      role: row.role,
      content: row.content
    }));

    /* =====================================================
     * 2️⃣ ESTADO CONVERSACIONAL (memoria real)
     * ===================================================== */
    const [stateRows] = await db
      .promise()
      .query(
        'SELECT * FROM conversation_state WHERE user_id = ? AND conversation_id = ?',
        [userId, conversationId]
      );

    let state = stateRows[0] || {
      destination: null,
      month: null,
      budget: null,
      travel_type: null,
      companions: null,
      active_mode: null
    };

    const msg = message.toLowerCase();

    /* =====================================================
     * 3️⃣ BLOQUEO DE INTENCIÓN (ACTIVE MODE)
     * ===================================================== */

    // SOLO se detecta si aún NO hay modo activo
    if (!state.active_mode) {
      if (/panader[ií]a|restaurante|caf[eé]|bar/i.test(msg)) {
        state.active_mode = 'local_recommendation';
      } else if (/historia|qué sabes|curioso|significado/i.test(msg)) {
        state.active_mode = 'guide';
      } else if (/viaje|itinerario|fecha|presupuesto|plan/i.test(msg)) {
        state.active_mode = 'planner';
      }
    }

    /* =====================================================
     * 4️⃣ SLOT FILLING (SOLO si aplica al modo)
     * ===================================================== */

    if (state.active_mode === 'planner') {
      if (!state.destination && /\bitalia\b/i.test(msg)) {
        state.destination = 'Italia';
      }

      if (!state.month && /\bseptiembre\b/i.test(msg)) {
        state.month = 'septiembre';
      }

      if (!state.budget && /económic|barato|bajo/i.test(msg)) {
        state.budget = 'bajo';
      }
    }

    /* =====================================================
     * 5️⃣ GUARDAR ESTADO (FUENTE DE VERDAD)
     * ===================================================== */
    await db.promise().query(
      `
      INSERT INTO conversation_state
      (user_id, conversation_id, destination, month, budget, travel_type, companions, active_mode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        destination = VALUES(destination),
        month = VALUES(month),
        budget = VALUES(budget),
        travel_type = VALUES(travel_type),
        companions = VALUES(companions),
        active_mode = VALUES(active_mode)
      `,
      [
        userId,
        conversationId,
        state.destination,
        state.month,
        state.budget,
        state.travel_type,
        state.companions,
        state.active_mode
      ]
    );

    /* =====================================================
     * 6️⃣ TEXTO DE ESTADO (PARA LA IA)
     * ===================================================== */
    const stateText = `
Modo activo: ${state.active_mode ?? 'no definido'}

Destino: ${state.destination ?? 'desconocido'}
Mes: ${state.month ?? 'desconocido'}
Presupuesto: ${state.budget ?? 'desconocido'}
Tipo de viaje: ${state.travel_type ?? 'desconocido'}
Compañía: ${state.companions ?? 'desconocida'}
`.trim();

    /* =====================================================
     * 7️⃣ LLAMADA A N8N (CON MODO BLOQUEADO)
     * ===================================================== */
    const aiResponse = await axios.post(
      'http://localhost:5678/webhook/chatia',
      {
        message,
        history,
        stateText,
        activeMode: state.active_mode,
        meta: {
          hasHistory: history.length > 0
        }
      },
      { timeout: 60000 }
    );

    const reply = aiResponse.data?.[0]?.content;

    if (!reply) {
      return res.status(500).json({
        error: 'Respuesta de IA inválida'
      });
    }

    /* =====================================================
     * 8️⃣ GUARDAR MENSAJES
     * ===================================================== */
    await db.promise().query(
      'INSERT INTO chat_messages (user_id, conversation_id, role, content) VALUES (?, ?, ?, ?)',
      [userId, conversationId, 'user', message]
    );

    await db.promise().query(
      'INSERT INTO chat_messages (user_id, conversation_id, role, content) VALUES (?, ?, ?, ?)',
      [userId, conversationId, 'assistant', reply]
    );

    /* =====================================================
     * 9️⃣ RESPUESTA FINAL
     * ===================================================== */
    res.json({
      reply,
      activeMode: state.active_mode
    });

  } catch (error) {
    console.error('❌ Error en /chat:', error.message);
    res.status(500).json({
      error: 'Error procesando el chat'
    });
  }
});
function normalizeDatetime(dateStr, defaultTime = "09:00") {
  if (!dateStr) return null;

  // Si ya viene con hora (ISO o HH:mm)
  if (dateStr.includes("T") || dateStr.match(/\d{2}:\d{2}/)) {
    return new Date(dateStr);
  }

  // YYYY-MM-DD → YYYY-MM-DD HH:mm:ss
  return new Date(`${dateStr}T${defaultTime}:00`);
}





// =====================================
// 🚀 Arranque del servidor
// =====================================
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
