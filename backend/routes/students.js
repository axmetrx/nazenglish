const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { classStore, studentStore, videoStore } = require('../store');

const JWT_SECRET = process.env.JWT_SECRET || 'englishclass_super_secret_2024';

// POST /api/students/join — регистрация ученика (имя + код класса + email + пароль)
router.post('/join', async (req, res) => {
  try {
    const { name, code, email, password } = req.body;
    if (!name || !code)
      return res.status(400).json({ message: 'Введите имя и код класса' });

    const cls = await classStore.findByCode(code.trim());
    if (!cls)
      return res.status(404).json({ message: 'Класс с таким кодом не найден' });

    // Если указан email+password — регистрация с аккаунтом
    if (email && password) {
      if (password.length < 4)
        return res.status(400).json({ message: 'Пароль минимум 4 символа' });

      const existing = await studentStore.findByEmail(email.trim().toLowerCase());
      if (existing)
        return res.status(409).json({ message: 'Этот email уже зарегистрирован. Войдите через "Вход"' });

      const password_hash = await bcrypt.hash(password, 10);
      const student = await studentStore.create({
        classId: cls.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password_hash,
      });

      const token = jwt.sign(
        { studentId: student.id, classId: cls.id, name: student.name },
        JWT_SECRET,
        { expiresIn: '90d' }
      );

      return res.json({
        token,
        student: { id: student.id, name: student.name, email: student.email },
        class: { id: cls.id, name: cls.name, description: cls.description },
      });
    }

    // Без email — обычный вход по имени (как раньше)
    const student = await studentStore.create({
      classId: cls.id,
      name: name.trim(),
    });

    const token = jwt.sign(
      { studentId: student.id, classId: cls.id, name: student.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      student: { id: student.id, name: student.name },
      class: { id: cls.id, name: cls.name, description: cls.description },
    });
  } catch (err) {
    console.error('❌ /students/join error:', err.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/students/login — вход ученика по email + пароль
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Введите email и пароль' });

    const student = await studentStore.findByEmail(email.trim().toLowerCase());
    if (!student || !student.password)
      return res.status(401).json({ message: 'Неверный email или пароль' });

    const isValid = await bcrypt.compare(password, student.password);
    if (!isValid)
      return res.status(401).json({ message: 'Неверный email или пароль' });

    // Обновить last_active_at
    const db = require('../db');
    await db.query('UPDATE students SET last_active_at = NOW() WHERE id = $1', [student.id]);

    const cls = await classStore.findById(student.classId);

    const token = jwt.sign(
      { studentId: student.id, classId: student.classId, name: student.name },
      JWT_SECRET,
      { expiresIn: '90d' }
    );

    res.json({
      token,
      student: { id: student.id, name: student.name, email: student.email },
      class: cls ? { id: cls.id, name: cls.name, description: cls.description } : null,
    });
  } catch (err) {
    console.error('❌ /students/login error:', err.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

const studentAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Нет токена' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Проверяем что ученик ещё существует в базе (не удалён админом)
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

// GET /api/students/class — получить видеоуроки своего класса (по токену) + статус просмотра
router.get('/class', studentAuth, async (req, res) => {
  try {
    const cls = await classStore.findById(req.student.classId);
    if (!cls) return res.status(404).json({ message: 'Класс не найден' });

    const videos = await videoStore.findByClass(cls.id);
    const db = require('../db');
    const progressRes = await db.query(
      'SELECT video_id FROM student_video_progress WHERE student_id = $1',
      [req.student.studentId]
    ).catch(() => ({ rows: [] }));
    const watchedVideoIds = progressRes.rows.map(r => r.video_id);

    res.json({
      class: { id: cls.id, name: cls.name, description: cls.description },
      videos,
      watchedVideoIds
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/students/activity — обновить время последней активности
router.post('/activity', studentAuth, async (req, res) => {
  try {
    const db = require('../db');
    await db.query(
      'UPDATE students SET last_active_at = CURRENT_TIMESTAMP WHERE id = $1',
      [req.student.studentId]
    );
    await db.query(`
      INSERT INTO student_activity_logs (student_id, active_date, active_minutes)
      VALUES ($1, CURRENT_DATE, 1)
      ON CONFLICT (student_id, active_date) 
      DO UPDATE SET active_minutes = student_activity_logs.active_minutes + 1
    `, [req.student.studentId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// GET /api/students/activity/weekly — активность за последние 7 дней
router.get('/activity/weekly', studentAuth, async (req, res) => {
  try {
    const result = await require('../db').query(`
      SELECT active_date, active_minutes 
      FROM student_activity_logs 
      WHERE student_id = $1 AND active_date >= CURRENT_DATE - INTERVAL '6 days'
      ORDER BY active_date ASC
    `, [req.student.studentId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// GET /api/students/leaderboard/class — рейтинг учеников для ученика
router.get('/leaderboard/class', studentAuth, async (req, res) => {
  try {
    const students = await studentStore.findByClass(req.student.classId);
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/students/progress/:videoId — отметить видео как просмотренное
router.post('/progress/:videoId', studentAuth, async (req, res) => {
  try {
    const result = await require('../db').query(`
      INSERT INTO student_video_progress (student_id, video_id) 
      VALUES ($1, $2)
      ON CONFLICT (student_id, video_id) DO NOTHING
      RETURNING id
    `, [req.student.studentId, req.params.videoId]);
    
    if (result.rowCount > 0) {
      await require('../db').query('UPDATE students SET points = points + 10 WHERE id = $1', [req.student.studentId]);
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// GET /api/students/:classId — список учеников класса (для учителя)
router.get('/:classId', require('../middleware/auth'), async (req, res) => {
  try {
    const cls = await classStore.findById(req.params.classId);
    if (!cls) return res.status(404).json({ message: 'Класс не найден' });
    if (cls.teacherId !== req.teacher.id)
      return res.status(403).json({ message: 'Нет доступа' });

    const students = await studentStore.findByClass(req.params.classId);
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// DELETE /api/students/:id — удалить ученика (для учителя)
router.delete('/:id', require('../middleware/auth'), async (req, res) => {
  try {
    const student = await studentStore.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Ученик не найден' });

    const cls = await classStore.findById(student.classId);
    if (cls.teacherId !== req.teacher.id) return res.status(403).json({ message: 'Нет доступа' });

    await studentStore.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
