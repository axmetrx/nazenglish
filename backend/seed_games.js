const { pool } = require('./db');

const SAMPLE_GAMES = [
  // 1. School (Мектеп)
  {
    title: '1. Мектеп куралдары / School 🎒',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'School', translation: 'Мектеп' },
      { word: 'Teacher', translation: 'Мугалим' },
      { word: 'Student', translation: 'Окуучу' },
      { word: 'Book', translation: 'Китеп' },
      { word: 'Pencil', translation: 'Карандаш' },
      { word: 'Desk', translation: 'Парта' },
    ]}
  },

  // 2. Family (Үй-бүлө)
  {
    title: '2. Үй-бүлө / Family 👨‍👩‍👧‍👦',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Father', translation: 'Ата' },
      { word: 'Mother', translation: 'Эне / Апа' },
      { word: 'Brother', translation: 'Ага / Ини' },
      { word: 'Sister', translation: 'Эже / Сиңди' },
      { word: 'Grandfather', translation: 'Чоң ата' },
      { word: 'Grandmother', translation: 'Чоң эне / Таене' },
    ]}
  },

  // 3. Numbers (Сандар)
  {
    title: '3. Сандар / Numbers 🔢',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'One', translation: 'Бир (1)' },
      { word: 'Five', translation: 'Беш (5)' },
      { word: 'Ten', translation: 'Он (10)' },
      { word: 'Fifty', translation: 'Илүү (50)' },
      { word: 'Hundred', translation: 'Жүз (100)' },
      { word: 'Thousand', translation: 'Миң (1000)' },
    ]}
  },

  // 4. Colors and Shapes (Түстөр жана формалар)
  {
    title: '4. Түстөр жана формалар / Colors & Shapes 🎨',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Red', translation: 'Кызыл' },
      { word: 'Blue', translation: 'Көк' },
      { word: 'Green', translation: 'Жашыл' },
      { word: 'Circle', translation: 'Тегерек' },
      { word: 'Square', translation: 'Квадрат' },
      { word: 'Star', translation: 'Жылдыз' },
    ]}
  },

  // 5. Body and Health (Дене жана ден соолук)
  {
    title: '5. Дене мүчөлөрү / Body & Health 🧍',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Head', translation: 'Баш' },
      { word: 'Eye', translation: 'Көз' },
      { word: 'Hand', translation: 'Кол' },
      { word: 'Leg', translation: 'Бут' },
      { word: 'Heart', translation: 'Жүрөк' },
      { word: 'Doctor', translation: 'Дарыгер' },
    ]}
  },

  // 6. Clothes (Кийимдер)
  {
    title: '6. Кийимдер / Clothes 👕',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Shirt', translation: 'Көйнөк' },
      { word: 'Pants', translation: 'Шым' },
      { word: 'Shoes', translation: 'Бут кийим' },
      { word: 'Hat', translation: 'Баш кийим / Калпак' },
      { word: 'Jacket', translation: 'Куртка' },
      { word: 'Dress', translation: 'Көйнөк (аялдар)' },
    ]}
  },

  // 7. Food and Drinks (Тамак-аш)
  {
    title: '7. Тамак-аш жана суусундуктар / Food & Drinks 🍎',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Apple', translation: 'Алма' },
      { word: 'Bread', translation: 'Нан' },
      { word: 'Water', translation: 'Суу' },
      { word: 'Milk', translation: 'Сүт' },
      { word: 'Meat', translation: 'Эт' },
      { word: 'Tea', translation: 'Чай' },
    ]}
  },

  // 8. Home (Үй)
  {
    title: '8. Үй жана эмеректер / Home 🏠',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'House', translation: 'Үй' },
      { word: 'Room', translation: 'Бөлмө' },
      { word: 'Bed', translation: 'Кербет / Төшөк' },
      { word: 'Table', translation: 'Стол' },
      { word: 'Door', translation: 'Эшик' },
      { word: 'Window', translation: 'Терезе' },
    ]}
  },

  // 9. Animals (Жаныбарлар)
  {
    title: '9. Жаныбарлар / Animals 🐾',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Cat', translation: 'Мышык' },
      { word: 'Dog', translation: 'Ит' },
      { word: 'Horse', translation: 'Жылкы' },
      { word: 'Cow', translation: 'Уй' },
      { word: 'Sheep', translation: 'Кой' },
      { word: 'Bird', translation: 'Канаттуу' },
    ]}
  },

  // 10. Nature (Табият)
  {
    title: '10. Табият жана аба ырайы / Nature 🌿',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Sun', translation: 'Күн' },
      { word: 'Moon', translation: 'Ай' },
      { word: 'Rain', translation: 'Жамгыр' },
      { word: 'Snow', translation: 'Кар' },
      { word: 'Mountain', translation: 'Тоо' },
      { word: 'River', translation: 'Дарыя' },
    ]}
  },

  // 11. City (Шаар)
  {
    title: '11. Шаар жана транспорт / City & Transport 🏙️',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'City', translation: 'Шаар' },
      { word: 'Car', translation: 'Машина' },
      { word: 'Bus', translation: 'Автобус' },
      { word: 'Shop', translation: 'Дүкөн' },
      { word: 'Street', translation: 'Көчө' },
      { word: 'Hospital', translation: 'Оорукана' },
    ]}
  },

  // 12. Hobbies (Хобби)
  {
    title: '12. Спорт жана хобби / Hobbies ⚽',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Football', translation: 'Футбол' },
      { word: 'Music', translation: 'Музыка' },
      { word: 'Dance', translation: 'Бий' },
      { word: 'Chess', translation: 'Шахмат' },
      { word: 'Game', translation: 'Оюн' },
      { word: 'Reading', translation: 'Окуу' },
    ]}
  },

  // 13. Daily Routine & Time (Күндөлүк адаттар)
  {
    title: '13. Күндөлүк режим / Daily Routine ⏰',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Wake up', translation: 'Ойгонуу' },
      { word: 'Eat', translation: 'Тамактануу' },
      { word: 'Study', translation: 'Окуу / Окуу процесси' },
      { word: 'Sleep', translation: 'Уктоо' },
      { word: 'Clock', translation: 'Саат' },
      { word: 'Schedule', translation: 'Распорядок / График' },
    ]}
  },

  // 15. Emotions (Эмоциялар)
  {
    title: '15. Эмоциялар / Emotions 😊',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Happy', translation: 'Бактылуу / Шайыр' },
      { word: 'Sad', translation: 'Капалуу / Муңайым' },
      { word: 'Angry', translation: 'Ачуулуу' },
      { word: 'Tired', translation: 'Чарчаган' },
      { word: 'Excited', translation: 'Толкунданган' },
      { word: 'Proud', translation: 'Сыймыктанган' },
    ]}
  },

  // 17. Jobs (Кесиптер)
  {
    title: '17. Кесиптер / Jobs 👨‍✈️',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Teacher', translation: 'Мугалим' },
      { word: 'Doctor', translation: 'Дарыгер' },
      { word: 'Pilot', translation: 'Учкуч' },
      { word: 'Farmer', translation: 'Дыйкан' },
      { word: 'Programmer', translation: 'Программист' },
      { word: 'Police officer', translation: 'Милиция кызматкери' },
    ]}
  },

  // 18. Technology (Технология)
  {
    title: '18. Технология / Technology 💻',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Computer', translation: 'Компьютер' },
      { word: 'Internet', translation: 'Интернет' },
      { word: 'Phone', translation: 'Телефон' },
      { word: 'Apps', translation: 'Тиркемелер' },
      { word: 'Social media', translation: 'Социалдык тармактар' },
      { word: 'AI', translation: 'Жасалма интеллект' },
    ]}
  },

  // 25. Verbs (Керектүү этиштер)
  {
    title: '25. Керектүү этиштер / Common Verbs 🏃',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Go', translation: 'Баруу' },
      { word: 'Come', translation: 'Келүү' },
      { word: 'Make', translation: 'Жасоо' },
      { word: 'Do', translation: 'Аткаруу' },
      { word: 'See', translation: 'Көрүү' },
      { word: 'Listen', translation: 'Угуу' },
      { word: 'Speak', translation: 'Сүйлөө' },
      { word: 'Write', translation: 'Жазуу' },
    ]}
  },

  // 26. Adjectives (Сын атоочтор)
  {
    title: '26. Сын атоочтор / Adjectives ⭐',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'Big', translation: 'Чоң' },
      { word: 'Small', translation: 'Кичине' },
      { word: 'Long', translation: 'Узун' },
      { word: 'Short', translation: 'Кыска' },
      { word: 'Hot', translation: 'Ысык' },
      { word: 'Cold', translation: 'Муздак' },
      { word: 'Fast', translation: 'Тез' },
      { word: 'Slow', translation: 'Жай' },
    ]}
  },

  // 27. Prepositions (Предлогдор)
  {
    title: '27. Предлогдор / Prepositions 📍',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'In', translation: 'Ичинде' },
      { word: 'On', translation: 'Үстүндө' },
      { word: 'Under', translation: 'Астында' },
      { word: 'Behind', translation: 'Артында' },
      { word: 'Next to', translation: 'Жанында' },
      { word: 'In front of', translation: 'Алдында' },
    ]}
  },

  // 29. Question Words (Суроо сөздөрү)
  {
    title: '29. Суроо сөздөрү / Question Words ❓',
    type: 'match_pairs',
    data: { pairs: [
      { word: 'What', translation: 'Эмне' },
      { word: 'Where', translation: 'Кайда' },
      { word: 'When', translation: 'Качан' },
      { word: 'Why', translation: 'Эмне үчүн' },
      { word: 'Who', translation: 'Ким' },
      { word: 'How', translation: 'Кандай' },
    ]}
  },

  // 🔤 Анаграмма (Сөздү тап)
  {
    title: 'Сөздү тап: Мектеп жана Технология 🏫',
    type: 'anagram',
    data: { words: ['school', 'pencil', 'teacher', 'computer', 'internet', 'mobile'] }
  },
  {
    title: 'Сөздү тап: Жаныбарлар дүйнөсү 🦁',
    type: 'anagram',
    data: { words: ['rabbit', 'monkey', 'tiger', 'elephant', 'dolphin', 'parrot'] }
  },

  // 📖 Тест/Квиз
  {
    title: '28. Күндөлүк фразалар / Everyday Phrases 💬',
    type: 'quiz',
    data: { questions: [
      { question: "'How are you?' фразасы эмнени билдирет?", options: ['Кандайсыз? / Иштер кандай?', 'Атыңыз ким?', 'Каяктансыз?', 'Рахмат'], answer: 0 },
      { question: "'Nice to meet you' эмнени билдирет?", options: ['Рахмат', 'Сиз менен таанышканыма кубанычтамын', 'Көрүшкөнчө', 'Кечириңиз'], answer: 1 },
      { question: "'Thank you' сөзүнө кандай жооп берилет?", options: ['Excuse me', "You're welcome (Эч нерсе эмес)", 'I am sorry', 'Goodbye'], answer: 1 },
      { question: "'I don't understand' эмнени билдирет?", options: ['Түшүндүм', 'Түшүнгөн жокмун', 'Жакшы калыңыз', 'Ооба'], answer: 1 },
    ]}
  },

  // 🎤 Туура айтуу
  {
    title: 'Апта күндөрү жана айлар / Days & Months 🗓️',
    type: 'pronunciation',
    data: { words: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'january', 'february', 'spring', 'summer'] }
  },
  {
    title: 'Эң керектүү этиштерди айтуу 🏃',
    type: 'pronunciation',
    data: { words: ['read', 'write', 'speak', 'listen', 'understand', 'learn', 'think', 'know'] }
  },
];

/**
 * Seed all 29 categorized games into all classes.
 */
const seedGamesIfNeeded = async () => {
  try {
    const classRes = await pool.query('SELECT id, name FROM classes ORDER BY created_at ASC');
    const classes = classRes.rows;
    if (classes.length === 0) return;

    for (const cls of classes) {
      console.log(`🌱 Seeding 29 full categorized games for class "${cls.name}"...`);

      // Delete old sample games to update cleanly
      await pool.query('DELETE FROM games WHERE class_id = $1', [cls.id]);

      // Insert all 29 categorized games
      for (const game of SAMPLE_GAMES) {
        await pool.query(
          'INSERT INTO games (class_id, title, type, data) VALUES ($1, $2, $3, $4)',
          [cls.id, game.title, game.type, JSON.stringify(game.data)]
        );
      }
      console.log(`✅ 29 games set for "${cls.name}"`);
    }
  } catch (err) {
    console.error('⚠️ Seed games error (non-fatal):', err.message);
  }
};

module.exports = { seedGamesIfNeeded };
