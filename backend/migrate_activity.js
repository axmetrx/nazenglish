const { pool } = require('./db.js');

async function migrate() {
  try {
    console.log('Adding last_active_at to students...');
    await pool.query('ALTER TABLE students ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;');
    
    console.log('Creating student_video_progress table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS student_video_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID REFERENCES students(id) ON DELETE CASCADE,
        video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
        watched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, video_id)
      );
    `);
    
    console.log('Migration successful');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
