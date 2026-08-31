const router = require('express').Router();
const jwt = require('jsonwebtoken');
const db = require('../db');
const { classStore } = require('../store');

const JWT_SECRET = process.env.JWT_SECRET || 'englishclass_super_secret_2024';

// Middleware for Teacher
const teacherAuth = require('../middleware/auth');

// Middleware for Student
const studentAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Нет токена' });

  const token = authHeader.split(' ')[1];
  try {
    req.student = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Токен недействителен' });
  }
};

// ================= TEACHER ROUTES =================

// DELETE /api/games/item/:id - delete game
router.delete('/item/:id', teacherAuth, async (req, res) => {
  try {
    // Need to check class ownership
    const gameRes = await db.query('SELECT class_id FROM games WHERE id = $1', [req.params.id]);
    if (!gameRes.rows[0]) return res.status(404).json({ message: 'Игра не найдена' });

    const cls = await classStore.findById(gameRes.rows[0].class_id);
    if (!cls || cls.teacherId !== req.teacher.id) return res.status(403).json({ message: 'Нет доступа' });

    await db.query('DELETE FROM games WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PUT /api/games/item/:id - update game
router.put('/item/:id', teacherAuth, async (req, res) => {
  try {
    const gameRes = await db.query('SELECT class_id FROM games WHERE id = $1', [req.params.id]);
    if (!gameRes.rows[0]) return res.status(404).json({ message: 'Игра не найдена' });

    const cls = await classStore.findById(gameRes.rows[0].class_id);
    if (!cls || cls.teacherId !== req.teacher.id) return res.status(403).json({ message: 'Нет доступа' });

    const { title, type, data } = req.body;
    if (!title || !type || !data) return res.status(400).json({ message: 'Неверные данные' });

    const result = await db.query(
      'UPDATE games SET title = $1, type = $2, data = $3 WHERE id = $4 RETURNING *',
      [title.trim(), type, data, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Update game error:', err.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ================= STUDENT ROUTES =================

// GET /api/games/student/list - get games for the student's class
router.get('/student/list', studentAuth, async (req, res) => {
  try {
    // get games + student progress
    const result = await db.query(`
      SELECT g.*, 
        (SELECT score FROM student_game_progress p WHERE p.student_id = $1 AND p.game_id = g.id) as score
      FROM games g
      WHERE g.class_id = $2
      ORDER BY g.created_at ASC
    `, [req.student.studentId, req.student.classId]);
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/games/student/complete/:id - complete a game and get points
router.post('/student/complete/:id', studentAuth, async (req, res) => {
  try {
    const { score } = req.body;

    // Get game type to determine XP
    const gameRes = await db.query('SELECT type FROM games WHERE id = $1', [req.params.id]);
    const gameType = gameRes.rows[0]?.type || 'match_pairs';
    const xpByType = { match_pairs: 15, anagram: 10, quiz: score || 20, pronunciation: 25 };
    const xp = xpByType[gameType] ?? 15;

    // Insert progress, do nothing if already exists
    const result = await db.query(`
      INSERT INTO student_game_progress (student_id, game_id, score) 
      VALUES ($1, $2, $3)
      ON CONFLICT (student_id, game_id) DO NOTHING
      RETURNING game_id
    `, [req.student.studentId, req.params.id, xp]);

    if (result.rowCount > 0) {
      await db.query('UPDATE students SET points = points + $1 WHERE id = $2', [xp, req.student.studentId]);
      res.json({ success: true, pointsAwarded: xp });
    } else {
      res.json({ success: true, pointsAwarded: 0, message: 'Уже пройдено' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ================= TEACHER ROUTES (catch-all for :classId) =================

// GET /api/games/:classId - get games for a class
router.get('/:classId', teacherAuth, async (req, res) => {
  try {
    const cls = await classStore.findById(req.params.classId);
    if (!cls || cls.teacherId !== req.teacher.id) return res.status(403).json({ message: 'Нет доступа' });

    const result = await db.query('SELECT * FROM games WHERE class_id = $1 ORDER BY created_at ASC', [cls.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/games/:classId - create a game
router.post('/:classId', teacherAuth, async (req, res) => {
  try {
    const cls = await classStore.findById(req.params.classId);
    if (!cls || cls.teacherId !== req.teacher.id) return res.status(403).json({ message: 'Нет доступа' });

    const { title, type, data } = req.body;
    if (!title || !type || !data) return res.status(400).json({ message: 'Неверные данные' });

    const result = await db.query(
      'INSERT INTO games (class_id, title, type, data) VALUES ($1, $2, $3, $4) RETURNING *',
      [cls.id, title, type, data]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;

