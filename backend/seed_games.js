const { pool } = require('./db');

const SAMPLE_GAMES = [
  // 🃏 Найди пару (Жубун тап)
  {
    title: 'Жаныбарлар / Животные 🐾',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Cat', translation: 'Мышык / Кошка' },
      { word: 'Dog', translation: 'Ит / Собака' },
      { word: 'Bird', translation: 'Канаттуу / Птица' },
      { word: 'Fish', translation: 'Балык / Рыба' },
      { word: 'Horse', translation: 'Жылкы / Лошадь' },
      { word: 'Rabbit', translation: 'Коён / Кролик' },
    ]}
  },
  {
    title: 'Мөмө-жемиштер / Фрукты и овощи 🍎',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Apple', translation: 'Алма / Яблоко' },
      { word: 'Banana', translation: 'Банан' },
      { word: 'Orange', translation: 'Апельсин' },
      { word: 'Carrot', translation: 'Сабиз / Морковь' },
      { word: 'Potato', translation: 'Картошка' },
      { word: 'Tomato', translation: 'Помидор' },
    ]}
  },
  {
    title: 'Түстөр / Цвета 🎨',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Red', translation: 'Кызыл / Красный' },
      { word: 'Blue', translation: 'Көк / Синий' },
      { word: 'Green', translation: 'Жашыл / Зелёный' },
      { word: 'Yellow', translation: 'Сары / Жёлтый' },
      { word: 'Black', translation: 'Кара / Чёрный' },
      { word: 'White', translation: 'Ак / Белый' },
    ]}
  },
  {
    title: 'Адамдын денеси / Тело человека 🧍',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Head', translation: 'Баш / Голова' },
      { word: 'Eye', translation: 'Көз / Глаз' },
      { word: 'Hand', translation: 'Кол / Рука' },
      { word: 'Leg', translation: 'Бут / Нога' },
      { word: 'Nose', translation: 'Мурун / Нос' },
      { word: 'Mouth', translation: 'Ооз / Рот' },
    ]}
  },

  // 🔤 Анаграмма (Сөздү тап)
  {
    title: 'Сөздү тап: Табият / Природа 🌿',
    type: 'anagram',
    data: { words: ['tree', 'water', 'cloud', 'stone', 'grass', 'river', 'flower'] }
  },
  {
    title: 'Сөздү тап: Тамак / Еда 🍕',
    type: 'anagram',
    data: { words: ['bread', 'sugar', 'pizza', 'salad', 'cheese', 'butter', 'coffee'] }
  },
  {
    title: 'Сөздү тап: Мектеп / Школа 🏫',
    type: 'anagram',
    data: { words: ['book', 'pencil', 'school', 'table', 'lesson', 'class', 'student'] }
  },

  // 📖 Тест/Квиз
  {
    title: 'Тест: Негизги сөздөр / Основы ✏️',
    type: 'quiz',
    data: { questions: [
      { question: "'Hello' сөзү кыргызча кандай которулат?", options: ['Саламатсызбы / Привет', 'Көрүшкөнчө / Пока', 'Рахмат / Спасибо', 'Кечириңиз / Извините'], answer: 0 },
      { question: "'I am happy' эмнени билдирет?", options: ['Мен чарчадым', 'Мен ачууландым', 'Мен бактылуумун', 'Мен ачкамын'], answer: 2 },
      { question: "'Менин атым...' англисче кандай болот?", options: ['I have name...', 'I am name...', 'My name is...', 'Call me is...'], answer: 2 },
      { question: "'Thank you' эмнени билдирет?", options: ['Эч нерсе эмес', 'Рахмат / Спасибо', 'Кечириңиз', 'Салам'], answer: 1 },
      { question: "Которгула: 'The sun is bright'", options: ['Ай сулуу', 'Күн тийип турат', 'Күн суук', 'Асман көк'], answer: 1 },
    ]}
  },
  {
    title: 'Тест: Сандар жана түстөр 🔢',
    type: 'quiz',
    data: { questions: [
      { question: "'Five' канча болот?", options: ['Үч (3)', 'Төрт (4)', 'Беш (5)', 'Алты (6)'], answer: 2 },
      { question: "'Blue' кайсы түс?", options: ['Кызыл', 'Сары', 'Жашыл', 'Көк / Синий'], answer: 3 },
      { question: "'Ten' саны кайсы?", options: ['Жети (7)', 'Сегиз (8)', 'Тогуз (9)', 'Он (10)'], answer: 3 },
      { question: "'Green' түсү кайсы?", options: ['Көк', 'Жашыл / Зелёный', 'Күрөң', 'Боз'], answer: 1 },
      { question: "'Three + Four' канча болот?", options: ['Five (5)', 'Six (6)', 'Seven (7)', 'Eight (8)'], answer: 2 },
    ]}
  },

  // 🎤 Произношение
  {
    title: 'Айтуу: Жөнөкөй сөздөр 🎤',
    type: 'pronunciation',
    data: { words: ['hello', 'water', 'apple', 'beautiful', 'morning', 'school', 'friend'] }
  },
  {
    title: 'Айтуу: Сандар 🔢',
    type: 'pronunciation',
    data: { words: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'] }
  },
  {
    title: 'Айтуу: Түстөр жана жаныбарлар 🌈',
    type: 'pronunciation',
    data: { words: ['red', 'blue', 'green', 'yellow', 'cat', 'dog', 'bird', 'fish'] }
  },
];

/**
 * Seed sample games into all classes that have fewer than 3 games.
 * Called automatically on server startup.
 */
const seedGamesIfNeeded = async () => {
  try {
    const classRes = await pool.query('SELECT id, name FROM classes ORDER BY created_at ASC');
    const classes = classRes.rows;
    if (classes.length === 0) return;

    for (const cls of classes) {
      const countRes = await pool.query('SELECT COUNT(*) FROM games WHERE class_id = $1', [cls.id]);
      const existingCount = parseInt(countRes.rows[0].count, 10);

      // Seed if class has less than 3 games
      if (existingCount >= 3) continue;

      console.log(`🌱 Seeding Kyrgyz/Bilingual games for class "${cls.name}"...`);
      for (const game of SAMPLE_GAMES) {
        const exists = await pool.query(
          'SELECT id FROM games WHERE class_id = $1 AND title = $2',
          [cls.id, game.title]
        );
        if (exists.rows.length > 0) continue;

        await pool.query(
          'INSERT INTO games (class_id, title, type, data) VALUES ($1, $2, $3, $4)',
          [cls.id, game.title, game.type, JSON.stringify(game.data)]
        );
      }
      console.log(`✅ Games seeded for "${cls.name}"`);
    }
  } catch (err) {
    console.error('⚠️ Seed games error (non-fatal):', err.message);
  }
};

module.exports = { seedGamesIfNeeded };
