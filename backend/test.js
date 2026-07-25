const { initDB, query } = require('./db');
async function test() {
  const result = await query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'student_game_progress'");
  console.log("Columns:", result.rows);
  process.exit(0);
}
test();
