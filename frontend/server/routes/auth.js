const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { teacherStore } = require('../store');

const JWT_SECRET = process.env.JWT_SECRET || 'englishclass_super_secret_2024';
const JWT_EXPIRES = '7d';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Заполните все поля' });

    const existing = await teacherStore.findByEmail(email);
    if (existing)
      return res.status(409).json({ message: 'Email уже зарегистрирован' });

    const password_hash = await bcrypt.hash(password, 10);
    const teacher = await teacherStore.create({ name, email, password: password_hash });

    const token = jwt.sign(
      { id: teacher.id, email: teacher.email, name: teacher.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.status(201).json({ token, teacher: { id: teacher.id, name: teacher.name, email: teacher.email } });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Заполните все поля' });

    const teacher = await teacherStore.findByEmail(email);
    if (!teacher)
      return res.status(401).json({ message: 'Неверный email или пароль' });

    const isValid = await bcrypt.compare(password, teacher.password);
    if (!isValid)
      return res.status(401).json({ message: 'Неверный email или пароль' });

    const token = jwt.sign(
      { id: teacher.id, email: teacher.email, name: teacher.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({ token, teacher: { id: teacher.id, name: teacher.name, email: teacher.email } });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

// POST /api/auth/guest - Вход по секретному коду
router.post('/guest', async (req, res) => {
  try {
    const { code } = req.body;
    const SECRET_CODE = process.env.TEACHER_CODE || 'naz777';

    if (!code || code.toString().trim() !== SECRET_CODE.toString().trim()) {
      return res.status(401).json({ message: 'Неверный секретный код' });
    }

    const email = 'teacher@nazenglish.com';
    const password_hash = await bcrypt.hash('nazenglish_guest_pass', 10);

    // UPSERT: insert or get existing guest teacher
    const { rows } = await require('../db').query(
      `INSERT INTO teachers (name, email, password)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING *`,
      ['Преподаватель', email, password_hash]
    );
    const teacher = rows[0];

    const token = jwt.sign(
      { id: teacher.id, email: teacher.email, name: teacher.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({ token, teacher: { id: teacher.id, name: teacher.name, email: teacher.email } });
  } catch (err) {
    console.error('❌ /auth/guest error:', err.message, err.stack);
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), (req, res) => {
  res.json({ teacher: req.teacher });
});

module.exports = router;
