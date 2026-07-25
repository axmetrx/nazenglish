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
    const SECRET_CODE = process.env.TEACHER_CODE || '7777';

    if (code !== SECRET_CODE) {
      return res.status(401).json({ message: 'Неверный секретный код' });
    }

    const email = 'teacher@englishclass.com';
    let teacher = await teacherStore.findByEmail(email);
    
    if (!teacher) {
      const password_hash = await bcrypt.hash('nopassword123', 10);
      teacher = await teacherStore.create({ name: 'Преподаватель', email, password: password_hash });
    }

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

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), (req, res) => {
  res.json({ teacher: req.teacher });
});

module.exports = router;
