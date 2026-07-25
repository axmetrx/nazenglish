const router = require('express').Router();
const auth = require('../middleware/auth');
const { classStore } = require('../store');

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
