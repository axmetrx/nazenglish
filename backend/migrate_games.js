const { pool } = require('./db.js');

async function migrate() {
  try {
    console.log('Adding points to students...');
    await pool.query('ALTER TABLE students ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;');
    
    console.log('Creating games table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS games (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        type TEXT NOT NULL, -- e.g., 'match_pairs'
        data JSONB NOT NULL, -- pairs of words
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating student_game_progress table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS student_game_progress (
        student_id UUID REFERENCES students(id) ON DELETE CASCADE,
        game_id UUID REFERENCES games(id) ON DELETE CASCADE,
        score INTEGER DEFAULT 0,
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, game_id)
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
