const router = require('express').Router();
const auth = require('../middleware/auth');
const { classStore, videoStore } = require('../store');

// GET /api/videos/:classId — все видео класса (для учителя)
router.get('/:classId', auth, async (req, res) => {
  try {
    const cls = await classStore.findById(req.params.classId);
    if (!cls) return res.status(404).json({ message: 'Класс не найден' });
    if (cls.teacherId !== req.teacher.id)
      return res.status(403).json({ message: 'Нет доступа' });

    const videos = await videoStore.findByClass(req.params.classId);
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/videos/:classId — добавить видео в класс
router.post('/:classId', auth, async (req, res) => {
  try {
    const cls = await classStore.findById(req.params.classId);
    if (!cls) return res.status(404).json({ message: 'Класс не найден' });
    if (cls.teacherId !== req.teacher.id)
      return res.status(403).json({ message: 'Нет доступа' });

    const { title, description, url } = req.body;
    if (!title || !url)
      return res.status(400).json({ message: 'Введите название и ссылку на видео' });

    const video = await videoStore.create({
      classId: req.params.classId,
      title,
      description: description || '',
      url
    });
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PUT /api/videos/item/:id — обновить видео
router.put('/item/:id', auth, async (req, res) => {
  try {
    const video = await videoStore.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Видео не найдено' });

    const cls = await classStore.findById(video.classId);
    if (cls.teacherId !== req.teacher.id)
      return res.status(403).json({ message: 'Нет доступа' });

    const updated = await videoStore.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// DELETE /api/videos/item/:id — удалить видео
router.delete('/item/:id', auth, async (req, res) => {
  try {
    const video = await videoStore.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Видео не найдено' });

    const cls = await classStore.findById(video.classId);
    if (cls.teacherId !== req.teacher.id)
      return res.status(403).json({ message: 'Нет доступа' });

    await videoStore.delete(req.params.id);
    res.json({ message: 'Видео удалено' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
