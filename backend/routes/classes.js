const router = require('express').Router();
const auth = require('../middleware/auth');
const { classStore } = require('../store');
const db = require('../db');

// POST /api/classes/sync-grades — Создать 1-9 классы и скопировать видео
router.post('/sync-grades', auth, async (req, res) => {
  try {
    const teacherId = req.teacher.id;

    // Все видеоуроки этого учителя
    const existingVidRes = await db.query(
      `SELECT DISTINCT v.title, v.description, v.url 
       FROM videos v 
       JOIN classes c ON v.class_id = c.id 
       WHERE c.teacher_id = $1`,
      [teacherId]
    );
    const teacherVideos = existingVidRes.rows;

    const GRADE_NAMES = [
      '1-класс (Англис тили)',
      '2-класс (Англис тили)',
      '3-класс (Англис тили)',
      '4-класс (Англис тили)',
      '5-класс (Англис тили)',
      '6-класс (Англис тили)',
      '7-класс (Англис тили)',
      '8-класс (Англис тили)',
      '9-класс (Англис тили)',
    ];

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    for (const gradeName of GRADE_NAMES) {
      let classRes = await db.query(
        'SELECT id FROM classes WHERE teacher_id = $1 AND name = $2',
        [teacherId, gradeName]
      );
      let classId;

      if (classRes.rows.length === 0) {
        let code = '';
        for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
        const newClass = await db.query(
          'INSERT INTO classes (teacher_id, name, description, code) VALUES ($1, $2, $3, $4) RETURNING id',
          [teacherId, gradeName, 'Англис тилин үйрөнүү курсу', code]
        );
        classId = newClass.rows[0].id;
      } else {
        classId = classRes.rows[0].id;
      }

      // Скопировать видео во все классы
      for (const vid of teacherVideos) {
        const vidExists = await db.query(
          'SELECT id FROM videos WHERE class_id = $1 AND title = $2',
          [classId, vid.title]
        );
        if (vidExists.rows.length === 0) {
          await db.query(
            'INSERT INTO videos (class_id, title, description, url) VALUES ($1, $2, $3, $4)',
            [classId, vid.title, vid.description || '', vid.url]
          );
        }
      }
    }

    const allClasses = await classStore.findAll(teacherId);
    res.json({ success: true, classes: allClasses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка создания классов' });
  }
});

// GET /api/classes — все классы учителя
router.get('/', auth, async (req, res) => {
  try {
    const classes = await classStore.findAll(req.teacher.id);
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// GET /api/classes/stats — статистика учителя
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await classStore.getStats(req.teacher.id);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// GET /api/classes/:id — один класс
router.get('/:id', auth, async (req, res) => {
  try {
    const cls = await classStore.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: 'Класс не найден' });
    if (cls.teacherId !== req.teacher.id)
      return res.status(403).json({ message: 'Нет доступа' });
    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/classes — создать класс
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Введите название класса' });

    const cls = await classStore.create({
      name,
      description: description || '',
      teacherId: req.teacher.id,
    });
    res.status(201).json(cls);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PUT /api/classes/:id — обновить класс
router.put('/:id', auth, async (req, res) => {
  try {
    const cls = await classStore.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: 'Класс не найден' });
    if (cls.teacherId !== req.teacher.id)
      return res.status(403).json({ message: 'Нет доступа' });

    const updated = await classStore.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// DELETE /api/classes/:id — удалить класс
router.delete('/:id', auth, async (req, res) => {
  try {
    const cls = await classStore.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: 'Класс не найден' });
    if (cls.teacherId !== req.teacher.id)
      return res.status(403).json({ message: 'Нет доступа' });

    await classStore.delete(req.params.id);
    res.json({ message: 'Класс удалён' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
