const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://neondb_owner:npg_wvC7KTQpN0Jl@ep-solitary-queen-awll96jl-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const BONUS_VIDEOS = [
  {
    title: 'Бонус сабак 1 (1-бөлүм)',
    description: 'Киришүү / Кошумча бонус видео сабак (1-бөлүм)',
    url: 'https://drive.google.com/file/d/1_40o6a5VmGVq824hbi-lW_sqgbDI3kye/view',
    order: 1
  },
  {
    title: 'Бонус сабак 2 (2-бөлүм)',
    description: 'Киришүү / Кошумча бонус видео сабак (2-бөлүм)',
    url: 'https://drive.google.com/file/d/1tuRlcv_lePwsuX2zPckYyMVho5RVCJBd/view',
    order: 2
  },
  {
    title: 'Бонус сабак 3 (Бонус+)',
    description: 'Кошумча бонус видео сабак (Бонус+)',
    url: 'https://drive.google.com/file/d/1nfDSd_N38eaXXINdS3joGv8AuA27QldZ/view',
    order: 3
  },
  {
    title: 'Бонус сабак 4 (Бонус++)',
    description: 'Кошумча бонус видео сабак (Бонус++)',
    url: 'https://drive.google.com/file/d/1Y0-5kwaUJpgl2de5ZS36Kqw30i3zS1Vl/view',
    order: 4
  }
];

async function prependBonuses() {
  console.log('🚀 Добавляем 4 бонусных урока в начало каждого класса...\n');

  const classesRes = await pool.query('SELECT id, name FROM classes ORDER BY name ASC');

  for (const cls of classesRes.rows) {
    console.log(`📌 Обрабатываем: ${cls.name}`);

    // 1. Удаляем любые старые бонусы из этого класса
    await pool.query(
      `DELETE FROM videos 
       WHERE class_id = $1 AND (title LIKE '%Бонус%' OR title LIKE '%бонус%' OR title LIKE '%тест%')`,
      [cls.id]
    );

    // 2. Сдвигаем обычные уроки, чтобы освободить первые 4 позиции (1, 2, 3, 4)
    // Сначала сбрасываем нумерацию обычных уроков по их текущему порядку
    const regularVideos = await pool.query(
      'SELECT id, title FROM videos WHERE class_id = $1 ORDER BY order_index ASC, created_at ASC',
      [cls.id]
    );

    for (let i = 0; i < regularVideos.rows.length; i++) {
      const v = regularVideos.rows[i];
      await pool.query(
        'UPDATE videos SET order_index = $1 WHERE id = $2',
        [i + 5, v.id] // обычные уроки идут с 5-й позиции
      );
    }

    // 3. Вставляем 4 бонуса на позиции 1, 2, 3, 4
    for (const b of BONUS_VIDEOS) {
      await pool.query(
        `INSERT INTO videos (class_id, title, description, url, order_index)
         VALUES ($1, $2, $3, $4, $5)`,
        [cls.id, b.title, b.description, b.url, b.order]
      );
    }

    const countRes = await pool.query('SELECT COUNT(*) FROM videos WHERE class_id = $1', [cls.id]);
    console.log(`  ✅ ${cls.name}: всего теперь ${countRes.rows[0].count} уроков (4 бонуса в начале)\n`);
  }

  console.log('🎉 4 БОНУСНЫХ УРОКА УСПЕШНО ДОБАВЛЕНЫ В НАЧАЛО КАЖДОГО КЛАССА!');
}

prependBonuses()
  .catch(err => console.error('Error:', err))
  .finally(() => pool.end());
