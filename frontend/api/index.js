const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to mount routes on both /api/path and /path
const mount = (path, router) => {
  app.use(`/api${path}`, router);
  app.use(path, router);
};

mount('/auth', require('../server/routes/auth'));
mount('/classes', require('../server/routes/classes'));
mount('/videos', require('../server/routes/videos'));
mount('/students', require('../server/routes/students'));
mount('/games', require('../server/routes/games'));
mount('/dictionary', require('../server/routes/dictionary'));

app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', message: 'Nazenglish API is running on Vercel 🚀' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

module.exports = app;
