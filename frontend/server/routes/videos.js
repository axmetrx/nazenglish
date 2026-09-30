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

// GET /api/videos/stream/:fileId — прямой стриминг видео с Google Диска в нативный HTML5 <video> плеер
router.get('/stream/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  if (!fileId || !/^[a-zA-Z0-9_-]+$/.test(fileId)) {
    return res.status(400).send('Invalid file ID');
  }

  const https = require('https');
  const initialUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  const clientReq = https.get(initialUrl, (gRes1) => {
    const cookies = gRes1.headers['set-cookie'] || [];
    const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');
    const redirectLoc = gRes1.headers.location;

    let targetUrl;
    if (redirectLoc) {
      targetUrl = redirectLoc.includes('confirm=') ? redirectLoc : `${redirectLoc}&confirm=t`;
    } else {
      targetUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
    }

    const headers2 = {};
    if (cookieHeader) headers2['Cookie'] = cookieHeader;
    if (req.headers.range) headers2['Range'] = req.headers.range;

    const streamReq = https.get(targetUrl, { headers: headers2 }, (gRes2) => {
      if ((gRes2.statusCode === 301 || gRes2.statusCode === 302 || gRes2.statusCode === 303 || gRes2.statusCode === 307) && gRes2.headers.location) {
        return https.get(gRes2.headers.location, { headers: headers2 }, (gRes3) => {
          pipeVideo(gRes3, res);
        }).on('error', (err) => {
          if (!res.headersSent) res.status(500).send(err.message);
        });
      }

      pipeVideo(gRes2, res);
    });

    streamReq.on('error', (err) => {
      if (!res.headersSent) res.status(500).send(err.message);
    });

    req.on('close', () => {
      streamReq.destroy();
    });
  });

  clientReq.on('error', (err) => {
    if (!res.headersSent) res.status(500).send(err.message);
  });

  req.on('close', () => {
    clientReq.destroy();
  });
});

function pipeVideo(gRes, res) {
  const statusCode = gRes.statusCode === 206 ? 206 : 200;
  const headers = {
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=86400',
  };

  if (gRes.headers['content-range']) {
    headers['Content-Range'] = gRes.headers['content-range'];
  }
  if (gRes.headers['content-length']) {
    headers['Content-Length'] = gRes.headers['content-length'];
  }

  res.writeHead(statusCode, headers);
  gRes.pipe(res);
}

module.exports = router;
