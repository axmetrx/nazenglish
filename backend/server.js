require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');
const { seedGamesIfNeeded } = require('./seed_games');
const { syncGradesAndVideos } = require('./sync_grades');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://nazenglish.vercel.app'],
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ─── Routes ─────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/students', require('./routes/students'));
app.use('/api/games', require('./routes/games'));
app.use('/api/dictionary', require('./routes/dictionary'));
app.use('/api/homeworks', require('./routes/homeworks'));

// ─── Health check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EnglishClass API is running 🚀' });
});

// ─── 404 handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// ─── Error handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// ─── Start ───────────────────────────────────────────────────
const startServer = async () => {
  await initDB();
  await seedGamesIfNeeded();
  app.listen(PORT, () => {
    console.log(`\n🎓 EnglishClass API Server`);
    console.log(`✅ Running on http://localhost:${PORT}`);
    console.log(`📚 API Health: http://localhost:${PORT}/api/health\n`);
  });
};

startServer();
