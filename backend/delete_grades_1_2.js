const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://neondb_owner:npg_wvC7KTQpN0Jl@ep-solitary-queen-awll96jl-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  try {
    const res = await pool.query(
      `DELETE FROM classes WHERE name LIKE '%1-класс%' OR name LIKE '%2-класс%' RETURNING name`
    );
    console.log('🗑️ Удалены классы:', res.rows.map(r => r.name));

    const remaining = await pool.query('SELECT name, code FROM classes ORDER BY name ASC');
    console.log('\n📚 Оставшиеся классы:');
    remaining.rows.forEach(r => console.log(`  - ${r.name} (Код: ${r.code})`));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

main();
