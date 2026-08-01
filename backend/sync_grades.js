const { pool } = require('./db');

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

async function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  while (true) {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    const res = await pool.query('SELECT id FROM classes WHERE code = $1', [code]);
    if (res.rowCount === 0) return code;
  }
}

/**
 * Creates classes from 1st to 9th grade for all teachers
 * and copies all teacher videos to every grade class.
 */
async function syncGradesAndVideos() {
  try {
    const teachersRes = await pool.query('SELECT id FROM teachers');
    const teachers = teachersRes.rows;
    if (teachers.length === 0) return;

    for (const teacher of teachers) {
      const teacherId = teacher.id;

      // Find all existing videos created by this teacher across any class
      const existingVidRes = await pool.query(
        `SELECT DISTINCT v.title, v.description, v.url 
         FROM videos v 
         JOIN classes c ON v.class_id = c.id 
         WHERE c.teacher_id = $1`,
        [teacherId]
      );
      const teacherVideos = existingVidRes.rows;

      console.log(`\n🏫 Syncing 1-9 grades for teacher #${teacherId} (${teacherVideos.length} videos found)...`);

      // For each grade 1 to 9
      for (const gradeName of GRADE_NAMES) {
        let classRes = await pool.query(
          'SELECT id FROM classes WHERE teacher_id = $1 AND name = $2',
          [teacherId, gradeName]
        );
        let classId;

        if (classRes.rows.length === 0) {
          const code = await generateCode();
          const newClass = await pool.query(
            'INSERT INTO classes (teacher_id, name, description, code) VALUES ($1, $2, $3, $4) RETURNING id',
            [teacherId, gradeName, 'Англис тилин үйрөнүү курсу', code]
          );
          classId = newClass.rows[0].id;
          console.log(`  ✅ Created class "${gradeName}" [Code: ${code}]`);
        } else {
          classId = classRes.rows[0].id;
        }

        // Copy teacher's videos to this class
        for (const vid of teacherVideos) {
          const vidExists = await pool.query(
            'SELECT id FROM videos WHERE class_id = $1 AND title = $2',
            [classId, vid.title]
          );
          if (vidExists.rows.length === 0) {
            await pool.query(
              'INSERT INTO videos (class_id, title, description, url) VALUES ($1, $2, $3, $4)',
              [classId, vid.title, vid.description || '', vid.url]
            );
            console.log(`    📹 Added video "${vid.title}" -> "${gradeName}"`);
          }
        }
      }
    }
    console.log(`\n🎉 Grades 1-9 synced successfully!\n`);
  } catch (err) {
    console.error('⚠️ Sync grades error (non-fatal):', err.message);
  }
}

module.exports = { syncGradesAndVideos };
