const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const auth = require('../middleware/auth');
const authStudent = require('../middleware/authStudent');

// ═══════════════════════════════════════════════════════════════
// TEACHER ENDPOINTS
// ═══════════════════════════════════════════════════════════════

// GET /api/homeworks/class/:classId — List all homeworks for a class with stats
router.get('/class/:classId', auth, async (req, res) => {
  try {
    const { classId } = req.params;

    // Check teacher ownership
    const classCheck = await pool.query(
      'SELECT id FROM classes WHERE id = $1 AND teacher_id = $2',
      [classId, req.teacher.id]
    );
    if (classCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Доступ запрещён' });
    }

    const homeworksRes = await pool.query(
      `SELECT h.*, v.title as video_title,
        COUNT(s.id)::int as total_submissions,
        COUNT(CASE WHEN s.status = 'pending' THEN 1 END)::int as pending_submissions,
        COUNT(CASE WHEN s.status = 'reviewed' THEN 1 END)::int as reviewed_submissions
       FROM homeworks h
       LEFT JOIN videos v ON h.video_id = v.id
       LEFT JOIN homework_submissions s ON h.id = s.homework_id
       WHERE h.class_id = $1
       GROUP BY h.id, v.title
       ORDER BY h.created_at DESC`,
      [classId]
    );

    res.json(homeworksRes.rows);
  } catch (err) {
    console.error('Error fetching homeworks:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/homeworks/class/:classId — Create new homework
router.post('/class/:classId', auth, async (req, res) => {
  try {
    const { classId } = req.params;
    const { title, description, video_id, deadline, max_points } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Название и описание обязательны' });
    }

    const classCheck = await pool.query(
      'SELECT id FROM classes WHERE id = $1 AND teacher_id = $2',
      [classId, req.teacher.id]
    );
    if (classCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Доступ запрещён' });
    }

    const result = await pool.query(
      `INSERT INTO homeworks (class_id, video_id, title, description, deadline, max_points)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        classId,
        video_id || null,
        title.trim(),
        description.trim(),
        deadline || null,
        parseInt(max_points) || 30
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating homework:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PUT /api/homeworks/item/:id — Update homework
router.put('/item/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, video_id, deadline, max_points } = req.body;

    const hwRes = await pool.query(
      `SELECT h.* FROM homeworks h
       JOIN classes c ON h.class_id = c.id
       WHERE h.id = $1 AND c.teacher_id = $2`,
      [id, req.teacher.id]
    );

    if (hwRes.rows.length === 0) {
      return res.status(404).json({ message: 'Задание не найдено' });
    }

    const result = await pool.query(
      `UPDATE homeworks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           video_id = $3,
           deadline = $4,
           max_points = COALESCE($5, max_points)
       WHERE id = $6
       RETURNING *`,
      [
        title ? title.trim() : null,
        description ? description.trim() : null,
        video_id || null,
        deadline || null,
        max_points ? parseInt(max_points) : null,
        id
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating homework:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// DELETE /api/homeworks/item/:id — Delete homework
router.delete('/item/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const hwRes = await pool.query(
      `SELECT h.* FROM homeworks h
       JOIN classes c ON h.class_id = c.id
       WHERE h.id = $1 AND c.teacher_id = $2`,
      [id, req.teacher.id]
    );

    if (hwRes.rows.length === 0) {
      return res.status(404).json({ message: 'Задание не найдено' });
    }

    await pool.query('DELETE FROM homeworks WHERE id = $1', [id]);
    res.json({ message: 'Задание удалено' });
  } catch (err) {
    console.error('Error deleting homework:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// GET /api/homeworks/submissions/:homeworkId — Get submissions for a homework
router.get('/submissions/:homeworkId', auth, async (req, res) => {
  try {
    const { homeworkId } = req.params;

    const hwRes = await pool.query(
      `SELECT h.*, c.name as class_name FROM homeworks h
       JOIN classes c ON h.class_id = c.id
       WHERE h.id = $1 AND c.teacher_id = $2`,
      [homeworkId, req.teacher.id]
    );

    if (hwRes.rows.length === 0) {
      return res.status(404).json({ message: 'Задание не найдено' });
    }

    const submissionsRes = await pool.query(
      `SELECT s.*, st.name as student_name, st.points as student_total_points
       FROM homework_submissions s
       JOIN students st ON s.student_id = st.id
       WHERE s.homework_id = $1
       ORDER BY
         CASE WHEN s.status = 'pending' THEN 1 ELSE 2 END,
         s.submitted_at DESC`,
      [homeworkId]
    );

    res.json({
      homework: hwRes.rows[0],
      submissions: submissionsRes.rows
    });
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/homeworks/review/:submissionId — Review/grade student submission
router.post('/review/:submissionId', auth, async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status, grade, points_awarded, teacher_comment } = req.body;

    const subCheck = await pool.query(
      `SELECT s.*, h.class_id, h.max_points, st.id as student_id
       FROM homework_submissions s
       JOIN homeworks h ON s.homework_id = h.id
       JOIN classes c ON h.class_id = c.id
       JOIN students st ON s.student_id = st.id
       WHERE s.id = $1 AND c.teacher_id = $2`,
      [submissionId, req.teacher.id]
    );

    if (subCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Ответ ученика не найден' });
    }

    const prevSubmission = subCheck.rows[0];
    const prevPoints = prevSubmission.points_awarded || 0;
    const newPoints = parseInt(points_awarded) || 0;
    const pointsDiff = newPoints - prevPoints;

    // Update submission record
    const result = await pool.query(
      `UPDATE homework_submissions
       SET status = $1,
           grade = $2,
           points_awarded = $3,
           teacher_comment = $4,
           reviewed_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [
        status || 'reviewed',
        grade !== undefined ? parseInt(grade) : null,
        newPoints,
        teacher_comment ? teacher_comment.trim() : '',
        submissionId
      ]
    );

    // If points changed, update student total points in students table
    if (pointsDiff !== 0) {
      await pool.query(
        'UPDATE students SET points = GREATEST(0, points + $1) WHERE id = $2',
        [pointsDiff, prevSubmission.student_id]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error reviewing submission:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ═══════════════════════════════════════════════════════════════
// STUDENT ENDPOINTS
// ═══════════════════════════════════════════════════════════════

// GET /api/homeworks/student/list — Get homeworks for student's class
router.get('/student/list', authStudent, async (req, res) => {
  try {
    const studentId = req.student.id;
    const classId = req.student.classId;

    const homeworksRes = await pool.query(
      `SELECT h.*, v.title as video_title,
        s.id as submission_id,
        s.text_content,
        s.media_url,
        s.audio_url,
        s.status as submission_status,
        s.grade,
        s.points_awarded,
        s.teacher_comment,
        s.submitted_at,
        s.reviewed_at
       FROM homeworks h
       LEFT JOIN videos v ON h.video_id = v.id
       LEFT JOIN homework_submissions s ON h.id = s.homework_id AND s.student_id = $1
       WHERE h.class_id = $2
       ORDER BY h.created_at DESC`,
      [studentId, classId]
    );

    res.json(homeworksRes.rows);
  } catch (err) {
    console.error('Error fetching student homeworks:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/homeworks/student/submit/:homeworkId — Submit homework
router.post('/student/submit/:homeworkId', authStudent, async (req, res) => {
  try {
    const studentId = req.student.id;
    const classId = req.student.classId;
    const { homeworkId } = req.params;
    const { text_content, media_url, audio_url } = req.body;

    if (!text_content && !media_url && !audio_url) {
      return res.status(400).json({ message: 'Заполните текст, фото или аудиозапись' });
    }

    // Verify homework belongs to student's class
    const hwCheck = await pool.query(
      'SELECT id FROM homeworks WHERE id = $1 AND class_id = $2',
      [homeworkId, classId]
    );
    if (hwCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Задание не найдено' });
    }

    // Insert or update submission
    const result = await pool.query(
      `INSERT INTO homework_submissions (homework_id, student_id, text_content, media_url, audio_url, status, submitted_at)
       VALUES ($1, $2, $3, $4, $5, 'pending', CURRENT_TIMESTAMP)
       ON CONFLICT (homework_id, student_id)
       DO UPDATE SET
         text_content = EXCLUDED.text_content,
         media_url = EXCLUDED.media_url,
         audio_url = EXCLUDED.audio_url,
         status = 'pending',
         submitted_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [homeworkId, studentId, text_content || '', media_url || '', audio_url || '']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error submitting homework:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
