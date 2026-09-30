const router = require('express').Router();
const jwt = require('jsonwebtoken');
const db = require('../db');
const { classStore, studentStore } = require('../store');

const JWT_SECRET = process.env.JWT_SECRET || 'englishclass_super_secret_2024';

// Middleware for Teacher
const teacherAuth = require('../middleware/auth');

// Middleware for Student
const studentAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Нет токена' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const student = await studentStore.findById(decoded.studentId);
    if (!student) {
      return res.status(401).json({ message: 'Аккаунт удалён' });
    }
    req.student = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Токен недействителен' });
  }
};

// Helper function to extract words from games and insert into dictionary
async function autoSyncGamesToDictionary(classId) {
  try {
    const gamesRes = await db.query('SELECT title, type, data FROM games WHERE class_id = $1', [classId]);
    const extracted = [];

    for (const game of gamesRes.rows) {
      const topic = game.title.replace(/^\d+\.\s*/, '').trim();
      
      if (game.type === 'match_pairs' && Array.isArray(game.data.pairs)) {
        for (const p of game.data.pairs) {
          if (p.word && p.translation) {
            extracted.push({ word: p.word.trim(), translation: p.translation.trim(), category: topic });
          }
        }
      } else if ((game.type === 'anagram' || game.type === 'pronunciation') && Array.isArray(game.data.words)) {
        for (const w of game.data.words) {
          if (typeof w === 'object' && w.word) {
            extracted.push({ word: w.word.trim(), translation: (w.translation || '').trim(), category: topic });
          } else if (typeof w === 'string' && w.trim()) {
            extracted.push({ word: w.trim(), translation: '', category: topic });
          }
        }
      }
    }

    // Insert unique words
    for (const item of extracted) {
      const exists = await db.query(
        'SELECT id FROM dictionary_words WHERE class_id = $1 AND LOWER(word) = LOWER($2)',
        [classId, item.word]
      );
      if (exists.rows.length === 0) {
        await db.query(
          'INSERT INTO dictionary_words (class_id, word, translation, category) VALUES ($1, $2, $3, $4)',
          [classId, item.word, item.translation, item.category || 'Жалпы / Общий']
        );
      }
    }
  } catch (e) {
    console.error('AutoSync dictionary error:', e.message);
  }
}

// ================= STUDENT ROUTES =================

// GET /api/dictionary/student/list - get dictionary words for student's class
router.get('/student/list', studentAuth, async (req, res) => {
  try {
    let result = await db.query(
      'SELECT * FROM dictionary_words WHERE class_id = $1 ORDER BY word ASC',
      [req.student.classId]
    );

    // If empty, auto-sync from class games so student has immediate access to words
    if (result.rows.length === 0) {
      await autoSyncGamesToDictionary(req.student.classId);
      result = await db.query(
        'SELECT * FROM dictionary_words WHERE class_id = $1 ORDER BY word ASC',
        [req.student.classId]
      );
    }

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Dictionary student list error:', err.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ================= TEACHER ROUTES =================

// DELETE /api/dictionary/item/:id - delete a word
router.delete('/item/:id', teacherAuth, async (req, res) => {
  try {
    const wordRes = await db.query('SELECT class_id FROM dictionary_words WHERE id = $1', [req.params.id]);
    if (!wordRes.rows[0]) return res.status(404).json({ message: 'Слово не найдено' });

    const cls = await classStore.findById(wordRes.rows[0].class_id);
    if (!cls || cls.teacherId !== req.teacher.id) return res.status(403).json({ message: 'Нет доступа' });

    await db.query('DELETE FROM dictionary_words WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PUT /api/dictionary/item/:id - update a word
router.put('/item/:id', teacherAuth, async (req, res) => {
  try {
    const wordRes = await db.query('SELECT class_id FROM dictionary_words WHERE id = $1', [req.params.id]);
    if (!wordRes.rows[0]) return res.status(404).json({ message: 'Слово не найдено' });

    const cls = await classStore.findById(wordRes.rows[0].class_id);
    if (!cls || cls.teacherId !== req.teacher.id) return res.status(403).json({ message: 'Нет доступа' });

    const { word, translation, category, example } = req.body;
    if (!word || !translation) return res.status(400).json({ message: 'Введите слово и перевод' });

    const result = await db.query(
      'UPDATE dictionary_words SET word = $1, translation = $2, category = $3, example = $4 WHERE id = $5 RETURNING *',
      [word.trim(), translation.trim(), (category || 'Жалпы / Общий').trim(), (example || '').trim(), req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/dictionary/:classId/sync-games - manually trigger game words sync
router.post('/:classId/sync-games', teacherAuth, async (req, res) => {
  try {
    const cls = await classStore.findById(req.params.classId);
    if (!cls || cls.teacherId !== req.teacher.id) return res.status(403).json({ message: 'Нет доступа' });

    await autoSyncGamesToDictionary(cls.id);
    const result = await db.query('SELECT * FROM dictionary_words WHERE class_id = $1 ORDER BY word ASC', [cls.id]);
    res.json({ success: true, count: result.rows.length, words: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// GET /api/dictionary/:classId - get dictionary for class
router.get('/:classId', teacherAuth, async (req, res) => {
  try {
    const cls = await classStore.findById(req.params.classId);
    if (!cls || cls.teacherId !== req.teacher.id) return res.status(403).json({ message: 'Нет доступа' });

    let result = await db.query('SELECT * FROM dictionary_words WHERE class_id = $1 ORDER BY word ASC', [cls.id]);

    if (result.rows.length === 0) {
      await autoSyncGamesToDictionary(cls.id);
      result = await db.query('SELECT * FROM dictionary_words WHERE class_id = $1 ORDER BY word ASC', [cls.id]);
    }

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/dictionary/:classId - add single word
router.post('/:classId', teacherAuth, async (req, res) => {
  try {
    const cls = await classStore.findById(req.params.classId);
    if (!cls || cls.teacherId !== req.teacher.id) return res.status(403).json({ message: 'Нет доступа' });

    const { word, translation, category, example } = req.body;
    if (!word || !translation) return res.status(400).json({ message: 'Введите слово и перевод' });

    const result = await db.query(
      'INSERT INTO dictionary_words (class_id, word, translation, category, example) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [cls.id, word.trim(), translation.trim(), (category || 'Жалпы / Общий').trim(), (example || '').trim()]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;