const { pool } = require('./db');

const SAMPLE_GAMES = [
  // 🃏 Найди пару
  {
    title: 'Животные 🐾',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Cat', translation: 'Кошка' },
      { word: 'Dog', translation: 'Собака' },
      { word: 'Bird', translation: 'Птица' },
      { word: 'Fish', translation: 'Рыба' },
      { word: 'Horse', translation: 'Лошадь' },
      { word: 'Rabbit', translation: 'Кролик' },
    ]}
  },
  {
    title: 'Фрукты и овощи 🍎',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Apple', translation: 'Яблоко' },
      { word: 'Banana', translation: 'Банан' },
      { word: 'Orange', translation: 'Апельсин' },
      { word: 'Carrot', translation: 'Морковь' },
      { word: 'Potato', translation: 'Картофель' },
      { word: 'Tomato', translation: 'Помидор' },
    ]}
  },
  {
    title: 'Цвета 🎨',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Red', translation: 'Красный' },
      { word: 'Blue', translation: 'Синий' },
      { word: 'Green', translation: 'Зелёный' },
      { word: 'Yellow', translation: 'Жёлтый' },
      { word: 'Black', translation: 'Чёрный' },
      { word: 'White', translation: 'Белый' },
    ]}
  },
  {
    title: 'Тело человека 🧍',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Head', translation: 'Голова' },
      { word: 'Eye', translation: 'Глаз' },
      { word: 'Hand', translation: 'Рука' },
      { word: 'Leg', translation: 'Нога' },
      { word: 'Nose', translation: 'Нос' },
      { word: 'Mouth', translation: 'Рот' },
    ]}
  },

  // 🔤 Анаграмма
  {
    title: 'Угадай слово: Природа 🌿',
    type: 'anagram',
    data: { words: ['tree', 'water', 'cloud', 'stone', 'grass', 'river', 'flower'] }
  },
  {
    title: 'Угадай слово: Еда 🍕',
    type: 'anagram',
    data: { words: ['bread', 'sugar', 'pizza', 'salad', 'cheese', 'butter', 'coffee'] }
  },
  {
    title: 'Угадай слово: Школа 🏫',
    type: 'anagram',
    data: { words: ['book', 'pencil', 'school', 'table', 'lesson', 'class', 'student'] }
  },

  // 📖 Тест/Квиз
  {
    title: 'Тест: Основы английского ✏️',
    type: 'quiz',
    data: { questions: [
      { question: "Как переводится 'Привет'?", options: ['Goodbye', 'Hello', 'Thank you', 'Sorry'], answer: 1 },
      { question: "Что означает 'I am happy'?", options: ['Я устал', 'Я злой', 'Я счастлив', 'Я голодный'], answer: 2 },
      { question: "Как сказать 'Меня зовут...'?", options: ['I have name...', 'I am name...', 'My name is...', 'Call me is...'], answer: 2 },
      { question: "Что значит 'Thank you'?", options: ['Пожалуйста', 'Спасибо', 'Извините', 'Привет'], answer: 1 },
      { question: "Переведите: 'The sun is bright'", options: ['Луна красивая', 'Солнце яркое', 'День холодный', 'Небо синее'], answer: 1 },
    ]}
  },
  {
    title: 'Тест: Числа и цвета 🔢',
    type: 'quiz',
    data: { questions: [
      { question: "Что значит 'Five'?", options: ['Три', 'Четыре', 'Пять', 'Шесть'], answer: 2 },
      { question: "Как переводится 'Blue'?", options: ['Красный', 'Жёлтый', 'Зелёный', 'Синий'], answer: 3 },
      { question: "Что означает 'Ten'?", options: ['Семь', 'Восемь', 'Девять', 'Десять'], answer: 3 },
      { question: "'Green' — это...", options: ['Синий', 'Зелёный', 'Коричневый', 'Серый'], answer: 1 },
      { question: "Сколько будет 'Three + Four'?", options: ['Five', 'Six', 'Seven', 'Eight'], answer: 2 },
    ]}
  },
  {
    title: 'Тест: Животные и природа 🌍',
    type: 'quiz',
    data: { questions: [
      { question: "Что значит 'Dog'?", options: ['Кошка', 'Собака', 'Корова', 'Лошадь'], answer: 1 },
      { question: "Как переводится 'Sun'?", options: ['Луна', 'Звезда', 'Солнце', 'Облако'], answer: 2 },
      { question: "'River' — это...", options: ['Гора', 'Озеро', 'Река', 'Море'], answer: 2 },
      { question: "Что означает 'Forest'?", options: ['Пустыня', 'Лес', 'Поле', 'Сад'], answer: 1 },
    ]}
  },

  // 🎤 Произношение
  {
    title: 'Произношение: Простые слова 🎤',
    type: 'pronunciation',
    data: { words: ['hello', 'water', 'apple', 'beautiful', 'morning', 'school', 'friend'] }
  },
  {
    title: 'Произношение: Числа 🔢',
    type: 'pronunciation',
    data: { words: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'] }
  },
  {
    title: 'Произношение: Цвета и животные 🌈',
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

      // Only seed if class has less than 3 games (fresh class)
      if (existingCount >= 3) continue;

      console.log(`🌱 Seeding games for class "${cls.name}"...`);
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
