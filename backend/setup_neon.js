/**
 * setup_neon.js — Полная настройка базы данных Neon для Nazenglish
 * Запуск: node setup_neon.js
 */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const DATABASE_URL = 'postgresql://neondb_owner:npg_wvC7KTQpN0Jl@ep-solitary-queen-awll96jl-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  connectionTimeoutMillis: 15000,
});

async function q(text, params) {
  const res = await pool.query(text, params);
  return res;
}

// ── 1. Создать все таблицы ─────────────────────────────────────
async function createTables() {
  console.log('\n📦 Создаём таблицы...');

  await q(`CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`);

  await q(`CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    code VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`);

  await q(`CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`);

  await q(`CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    points INTEGER DEFAULT 0,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`);

  await q(`CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`);

  await q(`CREATE TABLE IF NOT EXISTS student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    score INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, game_id)
  )`);

  await q(`CREATE TABLE IF NOT EXISTS student_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL DEFAULT 'game',
    duration_minutes INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`);

  console.log('  ✅ Все таблицы созданы');
}

// ── 2. Создать учителя ─────────────────────────────────────────
async function createTeacher() {
  console.log('\n👨‍🏫 Создаём аккаунт учителя...');
  const email = 'teacher@nazenglish.com';
  const password_hash = await bcrypt.hash('nazenglish_guest_pass', 10);

  const res = await q(
    `INSERT INTO teachers (name, email, password)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING *`,
    ['Преподаватель', email, password_hash]
  );
  const teacher = res.rows[0];
  console.log(`  ✅ Учитель создан: ${teacher.email} (ID: ${teacher.id})`);
  return teacher;
}

// ── 3. Создать классы 1-9 ──────────────────────────────────────
async function createGrades(teacherId) {
  console.log('\n🏫 Создаём классы 1–9...');
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  const grades = [
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

  const classIds = [];
  for (const name of grades) {
    // Generate unique code
    let code;
    while (true) {
      code = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      const exists = await q('SELECT id FROM classes WHERE code = $1', [code]);
      if (exists.rows.length === 0) break;
    }

    const res = await q(
      `INSERT INTO classes (teacher_id, name, description, code)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT DO NOTHING
       RETURNING *`,
      [teacherId, name, 'Англис тилин үйрөнүү курсу', code]
    );

    if (res.rows.length > 0) {
      classIds.push({ id: res.rows[0].id, name, code });
      console.log(`  ✅ ${name} — код: ${code}`);
    }
  }
  return classIds;
}

// ── 4. Добавить видео во все классы ───────────────────────────
async function addVideos(classes) {
  console.log('\n🎬 Добавляем видеоуроки...');

  // 4 видео которые были у пользователя
  // URL-ы с Google Диска или YouTube — пользователь подтвердит
  const videos = [
    {
      title: 'Урок 1 — Приветствие / Hello & Greetings',
      description: 'Базовые приветствия на английском языке',
      url: 'https://drive.google.com/file/d/PLACEHOLDER_1/view',
    },
    {
      title: 'Урок 2 — Числа / Numbers 1-10',
      description: 'Числа от 1 до 10 на английском языке',
      url: 'https://drive.google.com/file/d/PLACEHOLDER_2/view',
    },
    {
      title: 'Урок 3 — Цвета / Colors',
      description: 'Основные цвета на английском языке',
      url: 'https://drive.google.com/file/d/PLACEHOLDER_3/view',
    },
    {
      title: 'Урок 4 — Алфавит / Alphabet',
      description: 'Английский алфавит',
      url: 'https://drive.google.com/file/d/PLACEHOLDER_4/view',
    },
  ];

  for (const cls of classes) {
    for (let i = 0; i < videos.length; i++) {
      const v = videos[i];
      await q(
        `INSERT INTO videos (class_id, title, description, url, order_index)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [cls.id, v.title, v.description, v.url, i]
      );
    }
  }
  console.log(`  ✅ ${videos.length} видео добавлено в ${classes.length} классов`);
}

// ── 5. Добавить игры ───────────────────────────────────────────
const GAMES = [
  { title: '1. Мектеп куралдары / School 🎒', type: 'match_pairs', pairs: [
    { word: 'School', translation: 'Мектеп' },
    { word: 'Teacher', translation: 'Мугалим' },
    { word: 'Student', translation: 'Окуучу' },
    { word: 'Book', translation: 'Китеп' },
    { word: 'Pencil', translation: 'Карандаш' },
    { word: 'Desk', translation: 'Парта' },
  ]},
  { title: '2. Үй-бүлө / Family 👨‍👩‍👧‍👦', type: 'match_pairs', pairs: [
    { word: 'Father', translation: 'Ата' },
    { word: 'Mother', translation: 'Апа' },
    { word: 'Brother', translation: 'Ага / Ини' },
    { word: 'Sister', translation: 'Эже / Сиңди' },
    { word: 'Grandfather', translation: 'Чоң ата' },
    { word: 'Grandmother', translation: 'Чоң эне' },
  ]},
  { title: '3. Сандар / Numbers 🔢', type: 'match_pairs', pairs: [
    { word: 'One', translation: 'Бир (1)' },
    { word: 'Five', translation: 'Беш (5)' },
    { word: 'Ten', translation: 'Он (10)' },
    { word: 'Twenty', translation: 'Жыйырма (20)' },
    { word: 'Hundred', translation: 'Жүз (100)' },
    { word: 'Thousand', translation: 'Миң (1000)' },
  ]},
  { title: '4. Түстөр / Colors 🎨', type: 'match_pairs', pairs: [
    { word: 'Red', translation: 'Кызыл' },
    { word: 'Blue', translation: 'Көк' },
    { word: 'Green', translation: 'Жашыл' },
    { word: 'Yellow', translation: 'Сары' },
    { word: 'White', translation: 'Ак' },
    { word: 'Black', translation: 'Кара' },
  ]},
  { title: '5. Дене / Body 🫀', type: 'match_pairs', pairs: [
    { word: 'Head', translation: 'Баш' },
    { word: 'Hand', translation: 'Кол' },
    { word: 'Eye', translation: 'Көз' },
    { word: 'Nose', translation: 'Мурун' },
    { word: 'Ear', translation: 'Кулак' },
    { word: 'Foot', translation: 'Бут' },
  ]},
  { title: '6. Кийим / Clothes 👕', type: 'match_pairs', pairs: [
    { word: 'Shirt', translation: 'Көйнөк' },
    { word: 'Shoes', translation: 'Бут кийим' },
    { word: 'Hat', translation: 'Калпак / Кепка' },
    { word: 'Jacket', translation: 'Куртка' },
    { word: 'Dress', translation: 'Көйнөк (кыздар)' },
    { word: 'Socks', translation: 'Байпак' },
  ]},
  { title: '7. Тамак-аш / Food 🍎', type: 'match_pairs', pairs: [
    { word: 'Apple', translation: 'Алма' },
    { word: 'Bread', translation: 'Нан' },
    { word: 'Milk', translation: 'Сүт' },
    { word: 'Water', translation: 'Суу' },
    { word: 'Egg', translation: 'Жумуртка' },
    { word: 'Rice', translation: 'Күрүч' },
  ]},
  { title: '8. Жаныбарлар / Animals 🐾', type: 'match_pairs', pairs: [
    { word: 'Cat', translation: 'Мышык' },
    { word: 'Dog', translation: 'Ит' },
    { word: 'Horse', translation: 'Жылкы' },
    { word: 'Cow', translation: 'Уй' },
    { word: 'Bird', translation: 'Куш' },
    { word: 'Fish', translation: 'Балык' },
  ]},
  { title: '9. Шаар / City 🏙', type: 'match_pairs', pairs: [
    { word: 'School', translation: 'Мектеп' },
    { word: 'Hospital', translation: 'Оорукана' },
    { word: 'Market', translation: 'Базар' },
    { word: 'Park', translation: 'Парк' },
    { word: 'Road', translation: 'Жол' },
    { word: 'House', translation: 'Үй' },
  ]},
  { title: '10. Табият / Nature 🌿', type: 'match_pairs', pairs: [
    { word: 'Sun', translation: 'Күн' },
    { word: 'Moon', translation: 'Ай' },
    { word: 'Rain', translation: 'Жамгыр' },
    { word: 'Mountain', translation: 'Тоо' },
    { word: 'River', translation: 'Дарыя' },
    { word: 'Flower', translation: 'Гүл' },
  ]},
  { title: '11. Иш-аракет / Verbs ⚡', type: 'match_pairs', pairs: [
    { word: 'Run', translation: 'Чуркоо' },
    { word: 'Eat', translation: 'Жоо' },
    { word: 'Sleep', translation: 'Уктоо' },
    { word: 'Read', translation: 'Окуу' },
    { word: 'Write', translation: 'Жазуу' },
    { word: 'Play', translation: 'Ойноо' },
  ]},
  { title: '12. Убакыт / Time ⏰', type: 'match_pairs', pairs: [
    { word: 'Morning', translation: 'Эртең мурун' },
    { word: 'Afternoon', translation: 'Күндүзкү' },
    { word: 'Evening', translation: 'Кечинде' },
    { word: 'Night', translation: 'Түн' },
    { word: 'Today', translation: 'Бүгүн' },
    { word: 'Tomorrow', translation: 'Эртең' },
  ]},
  { title: '13. Мезгилдер / Seasons 🌸', type: 'match_pairs', pairs: [
    { word: 'Spring', translation: 'Жаз' },
    { word: 'Summer', translation: 'Жай' },
    { word: 'Autumn', translation: 'Күз' },
    { word: 'Winter', translation: 'Кыш' },
    { word: 'Hot', translation: 'Ысык' },
    { word: 'Cold', translation: 'Суук' },
  ]},
  { title: '14. Транспорт / Transport 🚗', type: 'match_pairs', pairs: [
    { word: 'Car', translation: 'Машина' },
    { word: 'Bus', translation: 'Автобус' },
    { word: 'Train', translation: 'Поезд' },
    { word: 'Plane', translation: 'Учак' },
    { word: 'Bicycle', translation: 'Велосипед' },
    { word: 'Taxi', translation: 'Такси' },
  ]},
  { title: '15. Спорт / Sports ⚽', type: 'match_pairs', pairs: [
    { word: 'Football', translation: 'Футбол' },
    { word: 'Basketball', translation: 'Баскетбол' },
    { word: 'Swimming', translation: 'Сүзүү' },
    { word: 'Running', translation: 'Чуркоо' },
    { word: 'Volleyball', translation: 'Волейбол' },
    { word: 'Tennis', translation: 'Теннис' },
  ]},
];

async function addGames(classes) {
  console.log('\n🎮 Добавляем игры...');
  for (const cls of classes) {
    for (const g of GAMES) {
      await q(
        `INSERT INTO games (class_id, title, type, data)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [cls.id, g.title, g.type, JSON.stringify({ pairs: g.pairs })]
      );
    }
  }
  console.log(`  ✅ ${GAMES.length} игр добавлено в ${classes.length} классов`);
}

// ── MAIN ───────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Запуск настройки Neon базы данных для Nazenglish...');
  try {
    await createTables();
    const teacher = await createTeacher();
    const classes = await createGrades(teacher.id);
    await addVideos(classes);
    await addGames(classes);

    console.log('\n══════════════════════════════════════════');
    console.log('✅ ВСЁ ГОТОВО!');
    console.log('══════════════════════════════════════════');
    console.log('\nКоды классов:');
    classes.forEach(c => console.log(`  ${c.name}: ${c.code}`));
    console.log('\n⚠️  Видео добавлены с временными ссылками!');
    console.log('   Замените PLACEHOLDER ссылки на реальные Google Drive URL.');
    console.log('\nВход учителя: код 7777');

  } catch (err) {
    console.error('\n❌ Ошибка:', err.message);
    console.error(err.stack);
  } finally {
    await pool.end();
  }
}

main();
