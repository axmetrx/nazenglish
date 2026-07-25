const { pool } = require('./backend/db.js');

async function migrate() {
  try {
    await pool.query('ALTER TABLE videos ADD COLUMN IF NOT EXISTS description TEXT;');
    await pool.query('ALTER TABLE videos DROP COLUMN IF EXISTS platform;');
    await pool.query('ALTER TABLE videos DROP COLUMN IF EXISTS video_id;');
    console.log('Migration successful');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
