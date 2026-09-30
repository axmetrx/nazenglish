// ============================================================
// store.js — PostgreSQL data store
// ============================================================

const db = require('./db');

// ─── Helpers ─────────────────────────────────────────────────
async function generateUniqueClassCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  while (true) {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    const res = await db.query('SELECT id FROM classes WHERE code = $1', [code]);
    if (res.rowCount === 0) {
      return code;
    }
  }
}

// ─── Teachers ────────────────────────────────────────────────
const teacherStore = {
  findByEmail: async (email) => {
    const res = await db.query('SELECT * FROM teachers WHERE email = $1', [email]);
    return res.rows[0];
  },
  findById: async (id) => {
    const res = await db.query('SELECT * FROM teachers WHERE id = $1', [id]);
    return res.rows[0];
  },
  create: async (data) => {
    const res = await db.query(
      'INSERT INTO teachers (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [data.name, data.email, data.password]
    );
    return res.rows[0];
  },
};

// ─── Classes ─────────────────────────────────────────────────
const classStore = {
  findAll: async (teacherId) => {
    const res = await db.query('SELECT * FROM classes WHERE teacher_id = $1 ORDER BY created_at DESC', [teacherId]);
    // Map snake_case back to camelCase for the frontend
    return res.rows.map(r => ({ ...r, teacherId: r.teacher_id, createdAt: r.created_at }));
  },
  getStats: async (teacherId) => {
    const res = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM classes WHERE teacher_id = $1) as classes_count,
        (SELECT COUNT(*) FROM students s JOIN classes c ON s.class_id = c.id WHERE c.teacher_id = $1) as students_count,
        (SELECT COUNT(*) FROM videos v JOIN classes c ON v.class_id = c.id WHERE c.teacher_id = $1) as videos_count
    `, [teacherId]);
    return {
      classesCount: parseInt(res.rows[0].classes_count, 10),
      studentsCount: parseInt(res.rows[0].students_count, 10),
      videosCount: parseInt(res.rows[0].videos_count, 10),
    };
  },
  findById: async (id) => {
    const res = await db.query('SELECT * FROM classes WHERE id = $1', [id]);
    if (!res.rows[0]) return null;
    return { ...res.rows[0], teacherId: res.rows[0].teacher_id, createdAt: res.rows[0].created_at };
  },
  findByCode: async (code) => {
    const res = await db.query('SELECT * FROM classes WHERE code = $1', [code.toUpperCase()]);
    if (!res.rows[0]) return null;
    return { ...res.rows[0], teacherId: res.rows[0].teacher_id, createdAt: res.rows[0].created_at };
  },
  create: async (data) => {
    const code = await generateUniqueClassCode();
    const res = await db.query(
      'INSERT INTO classes (teacher_id, name, description, code) VALUES ($1, $2, $3, $4) RETURNING *',
      [data.teacherId, data.name, data.description, code]
    );
    return { ...res.rows[0], teacherId: res.rows[0].teacher_id, createdAt: res.rows[0].created_at };
  },
  update: async (id, data) => {
    const res = await db.query(
      'UPDATE classes SET name = COALESCE($1, name), description = COALESCE($2, description) WHERE id = $3 RETURNING *',
      [data.name, data.description, id]
    );
    if (!res.rows[0]) return null;
    return { ...res.rows[0], teacherId: res.rows[0].teacher_id, createdAt: res.rows[0].created_at };
  },
  delete: async (id) => {
    const res = await db.query('DELETE FROM classes WHERE id = $1', [id]);
    return res.rowCount > 0;
  },
};

// ─── Videos ──────────────────────────────────────────────────
const videoStore = {
  findByClass: async (classId) => {
    const res = await db.query('SELECT * FROM videos WHERE class_id = $1 ORDER BY order_index ASC', [classId]);
    return res.rows.map(r => ({ 
      ...r, 
      classId: r.class_id, 
      orderIndex: r.order_index, 
      createdAt: r.created_at 
    }));
  },
  findById: async (id) => {
    const res = await db.query('SELECT * FROM videos WHERE id = $1', [id]);
    if (!res.rows[0]) return null;
    return { 
      ...res.rows[0], 
      classId: res.rows[0].class_id, 
      orderIndex: res.rows[0].order_index, 
      createdAt: res.rows[0].created_at 
    };
  },
  create: async (data) => {
    const maxRes = await db.query('SELECT COALESCE(MAX(order_index), 0) as max_order FROM videos WHERE class_id = $1', [data.classId]);
    const maxOrder = parseInt(maxRes.rows[0].max_order, 10);
    
    const res = await db.query(
      'INSERT INTO videos (class_id, title, description, url, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [data.classId, data.title, data.description, data.url, maxOrder + 1]
    );
    return { 
      ...res.rows[0], 
      classId: res.rows[0].class_id, 
      orderIndex: res.rows[0].order_index, 
      createdAt: res.rows[0].created_at 
    };
  },
  update: async (id, data) => {
    const res = await db.query(
      'UPDATE videos SET title = COALESCE($1, title), description = COALESCE($2, description), url = COALESCE($3, url) WHERE id = $4 RETURNING *',
      [data.title, data.description, data.url, id]
    );
    if (!res.rows[0]) return null;
    return { 
      ...res.rows[0], 
      classId: res.rows[0].class_id, 
      orderIndex: res.rows[0].order_index, 
      createdAt: res.rows[0].created_at 
    };
  },
  delete: async (id) => {
    const res = await db.query('DELETE FROM videos WHERE id = $1', [id]);
    return res.rowCount > 0;
  },
};

// ─── Students ────────────────────────────────────────────────
const studentStore = {
  findByClass: async (classId) => {
    const res = await db.query(`
      SELECT 
        s.*,
        (SELECT COUNT(*) FROM student_video_progress p WHERE p.student_id = s.id) as watched_videos
      FROM students s 
      WHERE s.class_id = $1 
      ORDER BY s.points DESC, s.joined_at DESC
    `, [classId]);
    return res.rows.map(r => ({ 
      ...r, 
      classId: r.class_id, 
      joinedAt: r.joined_at,
      lastActiveAt: r.last_active_at,
      watchedVideos: parseInt(r.watched_videos, 10),
      points: r.points
    }));
  },
  findById: async (id) => {
    const res = await db.query('SELECT * FROM students WHERE id = $1', [id]);
    if (!res.rows[0]) return null;
    return { ...res.rows[0], classId: res.rows[0].class_id, joinedAt: res.rows[0].joined_at };
  },
  findByEmail: async (email) => {
    const res = await db.query('SELECT * FROM students WHERE email = $1', [email]);
    if (!res.rows[0]) return null;
    return { ...res.rows[0], classId: res.rows[0].class_id, joinedAt: res.rows[0].joined_at };
  },
  create: async (data) => {
    if (data.email && data.password) {
      const res = await db.query(
        'INSERT INTO students (class_id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
        [data.classId, data.name, data.email, data.password]
      );
      return { ...res.rows[0], classId: res.rows[0].class_id, joinedAt: res.rows[0].joined_at };
    }
    const res = await db.query(
      'INSERT INTO students (class_id, name) VALUES ($1, $2) RETURNING *',
      [data.classId, data.name]
    );
    return { ...res.rows[0], classId: res.rows[0].class_id, joinedAt: res.rows[0].joined_at };
  },
  delete: async (id) => {
    const res = await db.query('DELETE FROM students WHERE id = $1', [id]);
    return res.rowCount > 0;
  },
};

module.exports = { teacherStore, classStore, videoStore, studentStore };
