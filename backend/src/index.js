import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import pkg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors'; // 👈 Importar cors

dotenv.config(); // lee las variables del archivo .env
const { Pool } = pkg;

const app = express();
app.use(bodyParser.json());

// 👇 Agregar CORS antes de las rutas
app.use(cors({
  origin: 'http://localhost:8080', // dominio frontend
  credentials: true
}));

app.use(express.static('../frontend/public')); // sirve tus páginas HTML

// conectar con PostgreSQL usando DATABASE_URL
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const SECRET = process.env.JWT_SECRET || 'supersecret';
const POKE_BASE = 'https://pokeapi.co/api/v2';
const PORT = process.env.PORT || 3000;

// LOGIN
app.post('/auth/login', async (req, res) => {
  const { user, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [user, password]
    );
    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    const token = jwt.sign(
      { id: result.rows[0].id, username: result.rows[0].username },
      SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Middleware de autenticación
function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'Token faltante' });
  try {
    req.user = jwt.verify(h.split(' ')[1], SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

// AUTOCOMPLETAR pokémon
app.get('/api/pokemon/autocomplete', auth, async (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  if (!q) return res.json([]);
  const list = await fetch(`${POKE_BASE}/pokemon?limit=1000`).then(r => r.json());
  const matches = list.results
    .filter(r => r.name.includes(q))
    .slice(0, 10)
    .map(r => ({ name: r.name }));
  res.json(matches);
});

// BUSCAR pokémon por ID o nombre
app.get('/api/pokemon/:id', auth, async (req, res) => {
  try {
    const p = await fetch(`${POKE_BASE}/pokemon/${req.params.id}`).then(r => r.json());
    res.json(p);
  } catch {
    res.status(404).json({ error: 'No encontrado' });
  }
});

// LISTADO paginado
app.get('/api/pokemons', auth, async (req, res) => {
  const page = parseInt(req.query.page || '1');
  const limit = parseInt(req.query.limit || '20');
  const offset = (page - 1) * limit;
  const data = await fetch(`${POKE_BASE}/pokemon?limit=${limit}&offset=${offset}`).then(r => r.json());
  res.json(data);
});

// GUARDAR búsqueda en la base
app.post('/api/searches', auth, async (req, res) => {
  const q = req.body.q || '';
  try {
    await pool.query('INSERT INTO searches (user_id, query) VALUES ($1, $2)', [req.user.id, q]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar búsqueda' });
  }
});

// Iniciar servidor
app.listen(PORT, () => console.log(`✅ Servidor escuchando en http://localhost:${PORT}`));
