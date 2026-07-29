const { pool } = require('./db');

const SAMPLE_GAMES = [
  // 🃏 Жубун тап (Найди пару)
  {
    title: 'Жаныбарлар 🐾',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Cat', translation: 'Мышык' },
      { word: 'Dog', translation: 'Ит' },
      { word: 'Bird', translation: 'Канаттуу' },
      { word: 'Fish', translation: 'Балык' },
      { word: 'Horse', translation: 'Жылкы' },
      { word: 'Rabbit', translation: 'Коён' },
    ]}
  },
  {
    title: 'Мөмө-жемиштер 🍎',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Apple', translation: 'Алма' },
      { word: 'Banana', translation: 'Банан' },
      { word: 'Orange', translation: 'Апельсин' },
      { word: 'Carrot', translation: 'Сабиз' },
      { word: 'Potato', translation: 'Картошка' },
      { word: 'Tomato', translation: 'Помидор' },
    ]}
  },
  {
    title: 'Түстөр 🎨',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Red', translation: 'Кызыл' },
      { word: 'Blue', translation: 'Көк' },
      { word: 'Green', translation: 'Жашыл' },
      { word: 'Yellow', translation: 'Сары' },
      { word: 'Black', translation: 'Кара' },
      { word: 'White', translation: 'Ак' },
    ]}
  },
  {
    title: 'Адамдын денеси 🧍',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Head', translation: 'Баш' },
      { word: 'Eye', translation: 'Көз' },
      { word: 'Hand', translation: 'Кол' },
      { word: 'Leg', translation: 'Бут' },
      { word: 'Nose', translation: 'Мурун' },
      { word: 'Mouth', translation: 'Ооз' },
    ]}
  },

  // 🔤 Анаграмма (Сөздү тап)
  {
    title: 'Сөздү тап: Табият 🌿',
    type: 'anagram',
    data: { words: ['tree', 'water', 'cloud', 'stone', 'grass', 'river', 'flower'] }
  },
  {
    title: 'Сөздү тап: Тамак 🍕',
    type: 'anagram',
    data: { words: ['bread', 'sugar', 'pizza', 'salad', 'cheese', 'butter', 'coffee'] }
  },
  {
    title: 'Сөздү тап: Мектеп 🏫',
    type: 'anagram',
    data: { words: ['book', 'pencil', 'school', 'table', 'lesson', 'class', 'student'] }
  },

  // 📖 Тест/Квиз
  {
    title: 'Тест: Негизги сөздөр ✏️',
    type: 'quiz',
    data: { questions: [
      { question: "'Hello' сөзү кыргызча кандай которулат?", options: ['Саламатсызбы', 'Көрүшкөнчө', 'Рахмат', 'Кечириңиз'], answer: 0 },
      { question: "'I am happy' эмнени билдирет?", options: ['Мен чарчадым', 'Мен ачууландым', 'Мен бактылуумун', 'Мен ачкамын'], answer: 2 },
      { question: "'Менин атым...' англисче кандай болот?", options: ['I have name...', 'I am name...', 'My name is...', 'Call me is...'], answer: 2 },
      { question: "'Thank you' эмнени билдирет?", options: ['Эч нерсе эмес', 'Рахмат', 'Кечириңиз', 'Салам'], answer: 1 },
      { question: "Которгула: 'The sun is bright'", options: ['Ай сулуу', 'Күн тийип турат', 'Күн суук', 'Асман көк'], answer: 1 },
    ]}
  },
  {
    title: 'Тест: Сандар жана түстөр 🔢',
    type: 'quiz',
    data: { questions: [
      { question: "'Five' канча болот?", options: ['Үч (3)', 'Төрт (4)', 'Беш (5)', 'Алты (6)'], answer: 2 },
      { question: "'Blue' кайсы түс?", options: ['Кызыл', 'Сары', 'Жашыл', 'Көк'], answer: 3 },
      { question: "'Ten' саны кайсы?", options: ['Жети (7)', 'Сегиз (8)', 'Тогуз (9)', 'Он (10)'], answer: 3 },
      { question: "'Green' түсү кайсы?", options: ['Көк', 'Жашыл', 'Күрөң', 'Боз'], answer: 1 },
      { question: "'Three + Four' канча болот?", options: ['Five (5)', 'Six (6)', 'Seven (7)', 'Eight (8)'], answer: 2 },
    ]}
  },

  // 🎤 Туура айтуу
  {
    title: 'Туура айтуу: Жөнөкөй сөздөр 🎤',
    type: 'pronunciation',
    data: { words: ['hello', 'water', 'apple', 'beautiful', 'morning', 'school', 'friend'] }
  },
  {
    title: 'Туура айтуу: Сандар 🔢',
    type: 'pronunciation',
    data: { words: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'] }
  },
  {
    title: 'Туура айтуу: Түстөр жана жаныбарлар 🌈',
    type: 'pronunciation',
    data: { words: ['red', 'blue', 'green', 'yellow', 'cat', 'dog', 'bird', 'fish'] }
  },
];

/**
 * Seed pure Kyrgyz sample games into all classes.
 * Deletes old non-Kyrgyz sample games and replaces them with 100% Kyrgyz content.
 */
const seedGamesIfNeeded = async () => {
  try {
    const classRes = await pool.query('SELECT id, name FROM classes ORDER BY created_at ASC');
    const classes = classRes.rows;
    if (classes.length === 0) return;

    for (const cls of classes) {
      console.log(`🌱 Updating pure Kyrgyz games for class "${cls.name}"...`);

      // Delete old sample games that don't match pure Kyrgyz titles
      await pool.query(
        `DELETE FROM games WHERE class_id = $1 AND title NOT IN (
          'Жаныбарлар 🐾', 'Мөмө-жемиштер 🍎', 'Түстөр 🎨', 'Адамдын денеси 🧍',
          'Сөздү тап: Табият 🌿', 'Сөздү тап: Тамак 🍕', 'Сөздү тап: Мектеп 🏫',
          'Тест: Негизги сөздөр ✏️', 'Тест: Сандар жана түстөр 🔢',
          'Туура айтуу: Жөнөкөй сөздөр 🎤', 'Туура айтуу: Сандар 🔢', 'Туура айтуу: Түстөр жана жаныбарлар 🌈'
        )`,
        [cls.id]
      );

      // Insert or update pure Kyrgyz sample games
      for (const game of SAMPLE_GAMES) {
        const exists = await pool.query(
          'SELECT id FROM games WHERE class_id = $1 AND title = $2',
          [cls.id, game.title]
        );

        if (exists.rows.length > 0) {
          // Update data to pure Kyrgyz
          await pool.query(
            'UPDATE games SET type = $1, data = $2 WHERE id = $3',
            [game.type, JSON.stringify(game.data), exists.rows[0].id]
          );
        } else {
          // Insert new pure Kyrgyz game
          await pool.query(
            'INSERT INTO games (class_id, title, type, data) VALUES ($1, $2, $3, $4)',
            [cls.id, game.title, game.type, JSON.stringify(game.data)]
          );
        }
      }
      console.log(`✅ Pure Kyrgyz games set for "${cls.name}"`);
    }
  } catch (err) {
    console.error('⚠️ Seed games error (non-fatal):', err.message);
  }
};

module.exports = { seedGamesIfNeeded };
