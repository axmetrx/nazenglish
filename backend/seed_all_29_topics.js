const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://neondb_owner:npg_wvC7KTQpN0Jl@ep-solitary-queen-awll96jl-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  connectionTimeoutMillis: 15000,
});

const TOPICS_DATA = [
  // 1. School (Мектеп)
  {
    category: '1. School (Мектеп)',
    words: [
      { word: 'School', translation: 'Мектеп', example: 'I go to school every day.' },
      { word: 'Teacher', translation: 'Мугалим', example: 'Our English teacher is very kind.' },
      { word: 'Student', translation: 'Окуучу', example: 'There are twenty students in our class.' },
      { word: 'Book', translation: 'Китеп', example: 'Open your English book on page 10.' },
      { word: 'Pencil', translation: 'Карандаш', example: 'I write with a pencil.' },
      { word: 'Pen', translation: 'Калем', example: 'May I borrow your blue pen?' },
      { word: 'Ruler', translation: 'Сызгыч', example: 'Use a ruler to draw a straight line.' },
      { word: 'Eraser', translation: 'Өчүргүч', example: 'Erase the mistake with an eraser.' },
      { word: 'Backpack', translation: 'Рюкзак / Мектеп баштыгы', example: 'My backpack is full of books.' },
      { word: 'Desk', translation: 'Парта', example: 'Sit at your desk and listen carefully.' },
      { word: 'Blackboard', translation: 'Доска', example: 'The teacher writes new words on the blackboard.' },
      { word: 'Mathematics', translation: 'Математика', example: 'Math is my favorite school subject.' },
      { word: 'English', translation: 'Англис тили', example: 'Learning English opens new doors.' },
      { word: 'History', translation: 'Тарых', example: 'We study world history on Mondays.' },
      { word: 'Geography', translation: 'География', example: 'We look at maps in geography class.' },
      { word: 'Monday', translation: 'Дүйшөмбү (Понедельник)', example: 'Monday is the first day of the school week.' },
      { word: 'Tuesday', translation: 'Шейшемби (Вторник)', example: 'We have English on Tuesday.' },
      { word: 'Wednesday', translation: 'Шаршемби (Среда)', example: 'Wednesday is in the middle of the week.' },
      { word: 'Thursday', translation: 'Бейшемби (Четверг)', example: 'We play sports on Thursday.' },
      { word: 'Friday', translation: 'Жума (Пятница)', example: 'Friday is the last school day.' },
      { word: 'Saturday', translation: 'Ишемби (Суббота)', example: 'Saturday is a weekend day.' },
      { word: 'Sunday', translation: 'Жекшемби (Воскресенье)', example: 'I spend Sunday with my family.' },
      { word: 'January', translation: 'Үчтүн айы / Январь', example: 'January is cold and snowy.' },
      { word: 'September', translation: 'Аяк оона / Сентябрь', example: 'School starts on September 1st.' },
    ]
  },

  // 2. Family (Үй-бүлө)
  {
    category: '2. Family (Үй-бүлө)',
    words: [
      { word: 'Family', translation: 'Үй-бүлө', example: 'I love my big and friendly family.' },
      { word: 'Father', translation: 'Ата', example: 'My father is a hard-working man.' },
      { word: 'Mother', translation: 'Эне / Апа', example: 'My mother cooks delicious food.' },
      { word: 'Parents', translation: 'Ата-эне', example: 'I always listen to my parents.' },
      { word: 'Brother', translation: 'Ага / Ини', example: 'My brother plays football with me.' },
      { word: 'Sister', translation: 'Эже / Сиңди', example: 'My younger sister likes to draw.' },
      { word: 'Grandfather', translation: 'Чоң ата / Таята', example: 'My grandfather tells interesting stories.' },
      { word: 'Grandmother', translation: 'Чоң эне / Таене', example: 'Grandmother bakes warm bread.' },
      { word: 'Uncle', translation: 'Байке / Таяке', example: 'My uncle lives in Bishkek.' },
      { word: 'Aunt', translation: 'Жеңе / Таеже', example: 'My aunt is a talented doctor.' },
      { word: 'Cousin', translation: 'Бөлө / Тууган', example: 'I play video games with my cousin.' },
      { word: 'Baby', translation: 'Ымыркай / Наристе', example: 'The baby is sleeping peacefully.' },
    ]
  },

  // 3. Numbers (Сандар)
  {
    category: '3. Numbers (Сандар)',
    words: [
      { word: 'One', translation: 'Бир (1)', example: 'I have one younger brother.' },
      { word: 'Two', translation: 'Эки (2)', example: 'There are two pencils on the desk.' },
      { word: 'Three', translation: 'Үч (3)', example: 'She has three cute cats.' },
      { word: 'Five', translation: 'Беш (5)', example: 'Give me high five!' },
      { word: 'Ten', translation: 'Он (10)', example: 'Count from one to ten.' },
      { word: 'Twenty', translation: 'Жыйырма (20)', example: 'He is twenty years old.' },
      { word: 'Fifty', translation: 'Элүү (50)', example: 'Fifty students took the exam.' },
      { word: 'Hundred', translation: 'Жүз (100)', example: 'One hundred percent correct.' },
      { word: 'Thousand', translation: 'Миң (1000)', example: 'There are one thousand meters in a kilometer.' },
      { word: 'First', translation: 'Биринчи (1st)', example: 'He won first place in the contest.' },
      { word: 'Second', translation: 'Экинчи (2nd)', example: 'I live on the second floor.' },
      { word: 'Third', translation: 'Үчүнчү (3rd)', example: 'This is my third English lesson.' },
    ]
  },

  // 4. Colors and Shapes (Түстөр жана формалар)
  {
    category: '4. Colors & Shapes (Түстөр жана формалар)',
    words: [
      { word: 'Red', translation: 'Кызыл', example: 'The ripe apple is bright red.' },
      { word: 'Blue', translation: 'Көк', example: 'The sky is clear and blue today.' },
      { word: 'Green', translation: 'Жашыл', example: 'Spring brings fresh green grass.' },
      { word: 'Yellow', translation: 'Сары', example: 'The sun shines bright yellow.' },
      { word: 'White', translation: 'Ак', example: 'White snow covers the high mountains.' },
      { word: 'Black', translation: 'Кара', example: 'He wears a black jacket.' },
      { word: 'Orange', translation: 'Кызгылт сары (Оранжевый)', example: 'Orange is a warm color.' },
      { word: 'Pink', translation: 'Кызгылт (Розовый)', example: 'She likes pink flowers.' },
      { word: 'Purple', translation: 'Кызгылт көк (Фиолетовый)', example: 'Grapes can be sweet and purple.' },
      { word: 'Circle', translation: 'Тегерек (Круг)', example: 'The round moon is a circle.' },
      { word: 'Square', translation: 'Квадрат', example: 'A window has a square frame.' },
      { word: 'Triangle', translation: 'Үч бурчтук (Треугольник)', example: 'A slice of pizza looks like a triangle.' },
      { word: 'Star', translation: 'Жылдыз', example: 'Look at the shining star in the night sky.' },
    ]
  },

  // 5. Body and Health (Дене жана ден соолук)
  {
    category: '5. Body & Health (Дене жана ден соолук)',
    words: [
      { word: 'Head', translation: 'Баш', example: 'Always protect your head with a helmet.' },
      { word: 'Eye', translation: 'Көз', example: 'She has beautiful brown eyes.' },
      { word: 'Ear', translation: 'Кулак', example: 'Listen carefully with both ears.' },
      { word: 'Nose', translation: 'Мурун', example: 'Breathe fresh air through your nose.' },
      { word: 'Mouth', translation: 'Ооз', example: 'Open your mouth and say Ah.' },
      { word: 'Hand', translation: 'Кол (кисть)', example: 'Wash your hands before eating.' },
      { word: 'Arm', translation: 'Кол (плечо-кисть)', example: 'He has strong arms.' },
      { word: 'Leg', translation: 'Бут (бут бүтүндөй)', example: 'Running strengthens your legs.' },
      { word: 'Foot', translation: 'Бут (таман)', example: 'He kicked the ball with his right foot.' },
      { word: 'Heart', translation: 'Жүрөк', example: 'My heart beats fast when I run.' },
      { word: 'Health', translation: 'Ден соолук', example: 'Health is the greatest wealth.' },
      { word: 'Doctor', translation: 'Дарыгер / Врач', example: 'The doctor gave helpful advice.' },
      { word: 'Medicine', translation: 'Дары-дармек', example: 'Take this medicine after meals.' },
    ]
  },

  // 6. Clothes (Кийимдер)
  {
    category: '6. Clothes (Кийимдер)',
    words: [
      { word: 'Shirt', translation: 'Көйнөк (эркектер)', example: 'He wears a clean white shirt.' },
      { word: 'Pants', translation: 'Шым (Брюки)', example: 'Dark blue pants look neat.' },
      { word: 'Shoes', translation: 'Бут кийим (Обувь)', example: 'Put on your running shoes.' },
      { word: 'Boots', translation: 'Өтүк (Сапоги)', example: 'Wear warm boots in winter.' },
      { word: 'Hat', translation: 'Баш кийим / Калпак', example: 'A hat protects from the hot sun.' },
      { word: 'Jacket', translation: 'Куртка / Пиджак', example: 'Put on your jacket, it is cold outside.' },
      { word: 'Coat', translation: 'Пальто / Тон', example: 'A heavy winter coat keeps you warm.' },
      { word: 'Dress', translation: 'Көйнөк (кыздар)', example: 'She wore a pretty blue dress.' },
      { word: 'Socks', translation: 'Байпак (Носки)', example: 'Clean warm socks for winter.' },
      { word: 'Gloves', translation: 'Мээлей (Перчатки)', example: 'Wear gloves when playing in snow.' },
      { word: 'Scarf', translation: 'Шарф / Моюн орогуч', example: 'Wrap a warm scarf around your neck.' },
      { word: 'Belt', translation: 'Кур / Ремень', example: 'Fasten your leather belt.' },
    ]
  },

  // 7. Food and Drinks (Тамак-аш жана суусундуктар)
  {
    category: '7. Food & Drinks (Тамак-аш жана суусундуктар)',
    words: [
      { word: 'Food', translation: 'Тамак-аш', example: 'Healthy food gives energy.' },
      { word: 'Water', translation: 'Суу', example: 'Drink plenty of clean water.' },
      { word: 'Bread', translation: 'Нан', example: 'Fresh bread smells amazing.' },
      { word: 'Milk', translation: 'Сүт', example: 'Warm milk before bed helps sleep.' },
      { word: 'Apple', translation: 'Алма', example: 'An apple a day keeps the doctor away.' },
      { word: 'Banana', translation: 'Банан', example: 'Monkeys love sweet bananas.' },
      { word: 'Meat', translation: 'Эт', example: 'Cooked meat is rich in protein.' },
      { word: 'Fish', translation: 'Балык', example: 'Fish is delicious and healthy.' },
      { word: 'Egg', translation: 'Жумуртка', example: 'Boiled eggs for breakfast.' },
      { word: 'Rice', translation: 'Күрүч', example: 'Rice is eaten all over the world.' },
      { word: 'Tea', translation: 'Чай', example: 'Hot black tea with lemon.' },
      { word: 'Juice', translation: 'Шире (Сок)', example: 'Fresh orange juice in the morning.' },
      { word: 'Breakfast', translation: 'Эртең мененки тамак (Завтрак)', example: 'Never skip your breakfast.' },
      { word: 'Lunch', translation: 'Түшкү тамак (Обед)', example: 'We have lunch at one o’clock.' },
      { word: 'Dinner', translation: 'Кечки тамак (Ужин)', example: 'Family dinner in the evening.' },
    ]
  },

  // 8. Home (Үй жана эмеректер)
  {
    category: '8. Home (Үй жана эмеректер)',
    words: [
      { word: 'House', translation: 'Үй (Дом)', example: 'Our house has a cozy green garden.' },
      { word: 'Home', translation: 'Үй (Очок / Жайлуу үй)', example: 'Home is where the heart is.' },
      { word: 'Room', translation: 'Бөлмө (Комната)', example: 'My room is bright and clean.' },
      { word: 'Kitchen', translation: 'Ашкана (Кухня)', example: 'Mom cooks tasty soup in the kitchen.' },
      { word: 'Bedroom', translation: 'Уктоочу бөлмө (Спальня)', example: 'I sleep peacefully in my bedroom.' },
      { word: 'Living room', translation: 'Мейманкана / Зал', example: 'We watch movies in the living room.' },
      { word: 'Door', translation: 'Эшик', example: 'Please close the door quietly.' },
      { word: 'Window', translation: 'Терезе', example: 'Open the window for fresh air.' },
      { word: 'Table', translation: 'Стол', example: 'Books and pens are on the table.' },
      { word: 'Chair', translation: 'Отургуч (Стул)', example: 'Sit comfortably on the chair.' },
      { word: 'Bed', translation: 'Кербет / Төшөк', example: 'A soft bed for a good night sleep.' },
      { word: 'Sofa', translation: 'Диван', example: 'Relax on the living room sofa.' },
    ]
  },

  // 9. Animals (Жаныбарлар)
  {
    category: '9. Animals (Жаныбарлар)',
    words: [
      { word: 'Cat', translation: 'Мышык', example: 'The kitten loves to play with yarn.' },
      { word: 'Dog', translation: 'Ит', example: 'A dog is a loyal human friend.' },
      { word: 'Horse', translation: 'Жылкы / Ат', example: 'Nomads ride beautiful swift horses.' },
      { word: 'Cow', translation: 'Уй', example: 'The cow gives fresh nutritious milk.' },
      { word: 'Sheep', translation: 'Кой', example: 'Sheep graze on green mountain pastures.' },
      { word: 'Bird', translation: 'Канаттуу / Куш', example: 'Birds sing sweetly in the morning.' },
      { word: 'Eagle', translation: 'Бүркүт', example: 'The golden eagle flies high in the mountains.' },
      { word: 'Wolf', translation: 'Карышкыр', example: 'Wolves live in packs in the wild.' },
      { word: 'Bear', translation: 'Аюу', example: 'The brown bear sleeps all winter.' },
      { word: 'Lion', translation: 'Арстан', example: 'The lion is known as king of the jungle.' },
      { word: 'Fish', translation: 'Балык', example: 'Colorful fish swim in deep waters.' },
      { word: 'Dolphin', translation: 'Дельфин', example: 'Dolphins are very smart sea animals.' },
    ]
  },

  // 10. Nature (Табият)
  {
    category: '10. Nature (Табият)',
    words: [
      { word: 'Sun', translation: 'Күн (Солнце)', example: 'The sun warms the whole earth.' },
      { word: 'Moon', translation: 'Ай (Луна)', example: 'The full moon lights up the night.' },
      { word: 'Sky', translation: 'Асман', example: 'White clouds float in the blue sky.' },
      { word: 'Mountain', translation: 'Тоо', example: 'Kyrgyzstan is famous for majestic mountains.' },
      { word: 'River', translation: 'Дарыя', example: 'Cold clean water flows in the mountain river.' },
      { word: 'Lake', translation: 'Көл', example: 'Issyk-Kul is a world-famous pearl lake.' },
      { word: 'Tree', translation: 'Дарак', example: 'Big green trees provide cool shade.' },
      { word: 'Flower', translation: 'Гүл', example: 'Spring brings colorful blooming flowers.' },
      { word: 'Rain', translation: 'Жамгыр', example: 'Rain helps plants and trees grow.' },
      { word: 'Snow', translation: 'Кар', example: 'Winter brings fluffy white snow.' },
      { word: 'Wind', translation: 'Шамал', example: 'A fresh gentle breeze is blowing.' },
      { word: 'Weather', translation: 'Аба ырайы', example: 'What is the weather forecast for today?' },
    ]
  },

  // 11. City and Transport (Шаар жана транспорт)
  {
    category: '11. City & Transport (Шаар жана транспорт)',
    words: [
      { word: 'City', translation: 'Шаар', example: 'Bishkek is a green and beautiful city.' },
      { word: 'Street', translation: 'Көчө', example: 'Trees grow along the wide street.' },
      { word: 'Building', translation: 'Имарат', example: 'Modern tall buildings in downtown.' },
      { word: 'Hospital', translation: 'Оорукана (Больница)', example: 'Doctors help patients in the hospital.' },
      { word: 'Park', translation: 'Парк', example: 'Families walk and play in the green park.' },
      { word: 'Market', translation: 'Базар', example: 'You can buy fresh fruit at the bazaar.' },
      { word: 'Car', translation: 'Машина', example: 'He drives an electric car.' },
      { word: 'Bus', translation: 'Автобус', example: 'Take bus number 10 to reach the center.' },
      { word: 'Train', translation: 'Поезд', example: 'The train travels across the country.' },
      { word: 'Airplane', translation: 'Учак (Самолёт)', example: 'The airplane flew high into the clouds.' },
      { word: 'Bicycle', translation: 'Велосипед', example: 'Riding a bicycle is great exercise.' },
      { word: 'Airport', translation: 'Аэропорт', example: 'Manas Airport welcomes guests from all countries.' },
    ]
  },

  // 12. Hobbies and Sports (Хобби жана спорт)
  {
    category: '12. Hobbies & Sports (Хобби жана спорт)',
    words: [
      { word: 'Hobby', translation: 'Хобби / Кызыгуу', example: 'What is your favorite hobby?' },
      { word: 'Sport', translation: 'Спорт', example: 'Sport keeps your body fit and healthy.' },
      { word: 'Football', translation: 'Футбол', example: 'Boys love playing football after school.' },
      { word: 'Basketball', translation: 'Баскетбол', example: 'He shoots a high basketball goal.' },
      { word: 'Swimming', translation: 'Сүзүү (Плавание)', example: 'Swimming in the lake feels refreshing.' },
      { word: 'Running', translation: 'Чуркоо (Бег)', example: 'Morning running gives fresh energy.' },
      { word: 'Music', translation: 'Музыка', example: 'Listening to calm relaxing music.' },
      { word: 'Drawing', translation: 'Сүрөт тартуу (Рисование)', example: 'She expresses her creativity through drawing.' },
      { word: 'Reading', translation: 'Китеп окуу (Чтение)', example: 'Reading books expands your worldview.' },
      { word: 'Chess', translation: 'Шахмат', example: 'Chess trains logical thinking.' },
    ]
  },

  // 13. Daily Routine (Күндөлүк режим)
  {
    category: '13. Daily Routine (Күндөлүк режим)',
    words: [
      { word: 'Wake up', translation: 'Ойгонуу (Просыпаться)', example: 'I wake up at seven in the morning.' },
      { word: 'Wash face', translation: 'Бетти жуу', example: 'Wash face and brush teeth daily.' },
      { word: 'Get dressed', translation: 'Кийинүү', example: 'Get dressed neatly for school.' },
      { word: 'Have breakfast', translation: 'Тамактануу (Завтракать)', example: 'Have a nutritious healthy breakfast.' },
      { word: 'Go to school', translation: 'Мектепке баруу', example: 'I walk to school with my classmates.' },
      { word: 'Do homework', translation: 'Үй тапшырмасын аткаруу', example: 'Do your English homework carefully.' },
      { word: 'Help parents', translation: 'Ата-энеге жардам берүү', example: 'Help mom clean the kitchen.' },
      { word: 'Go to bed', translation: 'Уктоого жатуу', example: 'Go to bed early to feel rested.' },
    ]
  },

  // 14. Time (Убакыт)
  {
    category: '14. Time (Убакыт)',
    words: [
      { word: 'Time', translation: 'Убакыт (Время)', example: 'Time is the most valuable resource.' },
      { word: 'Clock', translation: 'Саат (Часы)', example: 'Look at the wall clock.' },
      { word: 'Hour', translation: 'Саат (1 саат убакыт)', example: 'The lesson lasts for one hour.' },
      { word: 'Minute', translation: 'Мүнөт', example: 'Wait for just one minute, please.' },
      { word: 'Second', translation: 'Секунд', example: 'Count ten seconds.' },
      { word: 'Morning', translation: 'Эртең менен (Утро)', example: 'Good morning, have a great day!' },
      { word: 'Afternoon', translation: 'Түштөн кийин (День)', example: 'Good afternoon, students.' },
      { word: 'Evening', translation: 'Кечинде (Вечер)', example: 'We gather for dinner in the evening.' },
      { word: 'Night', translation: 'Түн (Ночь)', example: 'Good night and sweet dreams.' },
      { word: 'Today', translation: 'Бүгүн', example: 'Today is a wonderful sunny day.' },
      { word: 'Tomorrow', translation: 'Эртең', example: 'Tomorrow we have an English test.' },
      { word: 'Yesterday', translation: 'Кечээ', example: 'Yesterday was a relaxing Sunday.' },
    ]
  },

  // 15. Emotions (Эмоциялар)
  {
    category: '15. Emotions (Эмоциялар)',
    words: [
      { word: 'Happy', translation: 'Бактылуу / Шайыр (Счастливый)', example: 'He feels happy with his good grades.' },
      { word: 'Sad', translation: 'Капалуу / Муңайым (Грустный)', example: 'Do not be sad, everything will be fine.' },
      { word: 'Angry', translation: 'Ачуулуу (Злой)', example: 'Take a deep breath when you feel angry.' },
      { word: 'Excited', translation: 'Толкунданган / Кубанган', example: 'Children are excited for the summer holidays.' },
      { word: 'Tired', translation: 'Чарчаган (Уставший)', example: 'I feel tired after long sports practice.' },
      { word: 'Nervous', translation: 'Тынчсызданган (Нервный)', example: 'She was nervous before her speaking test.' },
      { word: 'Proud', translation: 'Сыймыктанган (Гордый)', example: 'Parents are proud of their children’s success.' },
      { word: 'Surprised', translation: 'Таң калган (Удивлённый)', example: 'He was surprised by the birthday party.' },
    ]
  },

  // 16. Appearance (Тышкы көрүнүш)
  {
    category: '16. Appearance (Тышкы көрүнүш)',
    words: [
      { word: 'Hair', translation: 'Чач (Волосы)', example: 'She has long shiny black hair.' },
      { word: 'Eyes', translation: 'Көздөр', example: 'Kind and smiling eyes.' },
      { word: 'Tall', translation: 'Узун бойлуу (Высокий)', example: 'The basketball player is very tall.' },
      { word: 'Short', translation: 'Пас бойлуу / Кыска (Низкий)', example: 'He is shorter than his older brother.' },
      { word: 'Beautiful', translation: 'Сулуу / Көркөм (Красивый)', example: 'A beautiful traditional dress.' },
      { word: 'Handsome', translation: 'Келбеттүү (Красивый эркек)', example: 'A handsome young student.' },
      { word: 'Young', translation: 'Жаш (Молодой)', example: 'Young students learn very fast.' },
      { word: 'Old', translation: 'Кары / Байыркы (Старый)', example: 'An old wise teacher.' },
      { word: 'Friendly', translation: 'Ынтымактуу / Достук мамиледеги', example: 'Friendly people make good friends.' },
    ]
  },

  // 17. Jobs (Кесиптер)
  {
    category: '17. Jobs (Кесиптер)',
    words: [
      { word: 'Job', translation: 'Кесип / Жумуш (Профессия)', example: 'Choose a job that you love.' },
      { word: 'Teacher', translation: 'Мугалим', example: 'A teacher guides students to knowledge.' },
      { word: 'Doctor', translation: 'Дарыгер', example: 'Doctors cure illnesses and save lives.' },
      { word: 'Nurse', translation: 'Медайым (Медсестра)', example: 'The nurse cared kindly for patients.' },
      { word: 'Engineer', translation: 'Инженер', example: 'Engineers design safe modern bridges.' },
      { word: 'Pilot', translation: 'Учкуч (Пилот)', example: 'The pilot flies airplanes safely.' },
      { word: 'Police officer', translation: 'Милиция кызматкери', example: 'Police officers protect city safety.' },
      { word: 'Farmer', translation: 'Дыйкан / Чарбакер', example: 'Farmers grow fresh organic vegetables.' },
      { word: 'Programmer', translation: 'Программист', example: 'Programmers create useful software.' },
      { word: 'Chef', translation: 'Ашпозчу (Повар)', example: 'The chef cooked a master dish.' },
    ]
  },

  // 18. Technology (Технология)
  {
    category: '18. Technology (Технология)',
    words: [
      { word: 'Computer', translation: 'Компьютер', example: 'Use computer for learning and programming.' },
      { word: 'Internet', translation: 'Интернет', example: 'The internet connects the whole world.' },
      { word: 'Phone', translation: 'Телефон', example: 'Call your parents on the phone.' },
      { word: 'Screen', translation: 'Экран', example: 'Do not sit too close to the screen.' },
      { word: 'Keyboard', translation: 'Клавиатура', example: 'Type quickly on the keyboard.' },
      { word: 'Mouse', translation: 'Чычкан (Мышь)', example: 'Click the button with the computer mouse.' },
      { word: 'Application', translation: 'Тиркеме (Приложение)', example: 'Nazenglish is a great educational app.' },
      { word: 'Social media', translation: 'Социалдык тармактар', example: 'Use social media wisely and safely.' },
      { word: 'Artificial Intelligence', translation: 'Жасалма интеллект (AI)', example: 'AI helps people solve complex problems.' },
    ]
  },

  // 19. Holidays (Майрамдар)
  {
    category: '19. Holidays (Майрамдар)',
    words: [
      { word: 'Holiday', translation: 'Майрам (Праздник)', example: 'Happy holiday to you and your family!' },
      { word: 'Birthday', translation: 'Туулган күн (День рождения)', example: 'Happy Birthday, may all wishes come true!' },
      { word: 'New Year', translation: 'Жаңы жыл (Новый год)', example: 'We celebrate New Year on December 31st.' },
      { word: 'Nooruz', translation: 'Нооруз майрамы', example: 'Nooruz brings spring and tasty sumolok.' },
      { word: 'Gift', translation: 'Белек (Подарок)', example: 'Giving gifts brings immense joy.' },
      { word: 'Celebration', translation: 'Майрамдоо (Празднование)', example: 'A grand celebration with music and dance.' },
    ]
  },

  // 20. Shopping (Дүкөн жана соода)
  {
    category: '20. Shopping (Дүкөн жана соода)',
    words: [
      { word: 'Shop', translation: 'Дүкөн (Магазин)', example: 'Let us buy bread at the corner shop.' },
      { word: 'Supermarket', translation: 'Супермаркет', example: 'A supermarket sells everything you need.' },
      { word: 'Money', translation: 'Акча (Деньги)', example: 'Spend money carefully and save some.' },
      { word: 'Price', translation: 'Баа (Цена)', example: 'What is the price of this dictionary?' },
      { word: 'Cash', translation: 'Накталай акча (Наличные)', example: 'You can pay with card or cash.' },
      { word: 'Cheap', translation: 'Арзан (Дешёвый)', example: 'Fresh apples are very cheap today.' },
      { word: 'Expensive', translation: 'Кымбат (Дорогой)', example: 'The new laptop is quite expensive.' },
    ]
  },

  // 21. Travel (Саякат)
  {
    category: '21. Travel (Саякат)',
    words: [
      { word: 'Travel', translation: 'Саякат / Саякаттоо (Путешествие)', example: 'I love to travel and explore new cities.' },
      { word: 'Hotel', translation: 'Мейманкана (Отель)', example: 'We stayed at a comfortable hotel.' },
      { word: 'Passport', translation: 'Паспорт', example: 'Keep your passport in a safe place.' },
      { word: 'Ticket', translation: 'Билет', example: 'Show your train ticket to the conductor.' },
      { word: 'Luggage', translation: 'Жүк (Багаж)', example: 'Pack light luggage for your trip.' },
      { word: 'Tourist', translation: 'Турист / Саякатчы', example: 'Tourists enjoy our mountain nature.' },
    ]
  },

  // 22. Environment (Айлана-чөйрө)
  {
    category: '22. Environment (Айлана-чөйрө)',
    words: [
      { word: 'Nature', translation: 'Табият (Природа)', example: 'Protect nature for future generations.' },
      { word: 'Clean', translation: 'Таза (Чистый)', example: 'Keep our city clean and green.' },
      { word: 'Recycling', translation: 'Кайра иштетүү (Переработка)', example: 'Recycling plastic saves the planet.' },
      { word: 'Save water', translation: 'Сууну үнөмдөө', example: 'Always turn off the tap to save water.' },
      { word: 'Energy', translation: 'Энергия', example: 'Solar panels generate clean green energy.' },
      { word: 'Plant a tree', translation: 'Дарак отургузуу', example: 'Students plant trees every spring.' },
    ]
  },

  // 23. Education (Билим берүү)
  {
    category: '23. Education (Билим берүү)',
    words: [
      { word: 'Education', translation: 'Билим берүү (Образование)', example: 'Education is the key to a bright future.' },
      { word: 'Knowledge', translation: 'Билим (Знания)', example: 'Knowledge is real power.' },
      { word: 'Rule', translation: 'Эреже (Правило)', example: 'Follow the classroom rules politely.' },
      { word: 'Exam', translation: 'Сынак / Экзамен', example: 'Prepare well to pass the English exam.' },
      { word: 'Homework', translation: 'Үй тапшырмасы', example: 'Finish your homework before playing.' },
      { word: 'Practice', translation: 'Машыгуу / Практика', example: 'Practice speaking English every single day.' },
    ]
  },

  // 24. Communication (Байланыш жана таанышуу)
  {
    category: '24. Communication (Байланыш жана таанышуу)',
    words: [
      { word: 'Hello', translation: 'Саламатсызбы / Салам (Привет)', example: 'Hello! Nice to meet you today.' },
      { word: 'Goodbye', translation: 'Көрүшкөнчө / Жакшы калыңыз (Пока)', example: 'Goodbye, see you tomorrow at school.' },
      { word: 'Please', translation: 'Сураныч / Өтүнөмүн (Пожалуйста)', example: 'Please speak slowly and clearly.' },
      { word: 'Thank you', translation: 'Ыраазычылык / Рахмат (Спасибо)', example: 'Thank you so much for your kind help.' },
      { word: 'Welcome', translation: 'Кош келиңиз (Добро пожаловать)', example: 'Welcome to our friendly English class.' },
      { word: 'Introduce', translation: 'Тааныштыруу (Представить)', example: 'Let me introduce my best friend.' },
    ]
  },

  // 25. Verbs (Эң керектүү этиштер - 40+ verbs)
  {
    category: '25. Common Verbs (Эң керектүү этиштер)',
    words: [
      { word: 'Go', translation: 'Баруу (Идти / Ехать)', example: 'I go to school by bus.' },
      { word: 'Come', translation: 'Келүү (Приходить)', example: 'Come here and look at this picture.' },
      { word: 'Make', translation: 'Жасоо (Делать / Создавать)', example: 'Make a sentence with a new word.' },
      { word: 'Do', translation: 'Аткаруу (Делать / Выполнять)', example: 'Do your best in every task.' },
      { word: 'Have', translation: 'Ээ болуу / Бар (Иметь)', example: 'I have an English dictionary.' },
      { word: 'Get', translation: 'Алуу / Жетишүү (Получать)', example: 'You will get points for correct answers.' },
      { word: 'Take', translation: 'Алуу / Алып кетүү (Брать)', example: 'Take your notebook and pen.' },
      { word: 'Bring', translation: 'Алып келүү (Приносить)', example: 'Bring your English book to class.' },
      { word: 'See', translation: 'Көрүү (Видеть)', example: 'I can see tall mountains from my window.' },
      { word: 'Watch', translation: 'Көрүү / Кароо (Смотреть)', example: 'Watch the video lesson carefully.' },
      { word: 'Hear', translation: 'Угуу (Слышать)', example: 'Can you hear the birds singing?' },
      { word: 'Listen', translation: 'Угуу / Кулак салуу (Слушать)', example: 'Listen to the native pronunciation.' },
      { word: 'Speak', translation: 'Сүйлөө (Говорить)', example: 'I can speak basic English.' },
      { word: 'Tell', translation: 'Айтып берүү (Рассказывать)', example: 'Tell me a story about your pet.' },
      { word: 'Say', translation: 'Айтуу (Сказать)', example: 'Say the word out loud.' },
      { word: 'Read', translation: 'Окуу (Читать)', example: 'Read one English story every week.' },
      { word: 'Write', translation: 'Жазуу (Писать)', example: 'Write down new words in your notebook.' },
      { word: 'Eat', translation: 'Жөө / Тамактануу (Кушать)', example: 'Eat fresh fruits for good health.' },
      { word: 'Drink', translation: 'Ичүү (Пить)', example: 'Drink warm tea with honey.' },
      { word: 'Sleep', translation: 'Уктоо (Спать)', example: 'Sleep at least eight hours at night.' },
      { word: 'Buy', translation: 'Сатып алуу (Покупать)', example: 'Buy a new interesting book.' },
      { word: 'Sell', translation: 'Сатуу (Продавать)', example: 'They sell fresh bread at the bakery.' },
      { word: 'Open', translation: 'Ачуу (Открыть)', example: 'Open your books to page 25.' },
      { word: 'Close', translation: 'Жабуу (Закрыть)', example: 'Close the window when it rains.' },
      { word: 'Clean', translation: 'Тазалоо (Чистить)', example: 'Clean your room every Saturday.' },
      { word: 'Wash', translation: 'Жуу (Мыть)', example: 'Wash your hands with warm water.' },
      { word: 'Help', translation: 'Жардам берүү (Помогать)', example: 'Always help your friends in need.' },
      { word: 'Call', translation: 'Чалуу / Атоо (Звонить / Называть)', example: 'Call me when you arrive home.' },
      { word: 'Play', translation: 'Ойноо (Играть)', example: 'Play interactive English games.' },
      { word: 'Study', translation: 'Окуу / Үйрөнүү (Учиться)', example: 'Study English fifteen minutes a day.' },
      { word: 'Learn', translation: 'Үйрөнүү (Учить)', example: 'Learn five new words daily.' },
      { word: 'Think', translation: 'Ойлонуу (Думать)', example: 'Think carefully before answering.' },
      { word: 'Know', translation: 'Билүү (Знать)', example: 'I know the correct answer!' },
      { word: 'Understand', translation: 'Түшүнүү (Понимать)', example: 'Now I understand this grammar rule.' },
      { word: 'Answer', translation: 'Жооп берүү (Отвечать)', example: 'Answer the teacher’s question.' },
      { word: 'Ask', translation: 'Суроо (Спрашивать)', example: 'Feel free to ask questions anytime.' },
      { word: 'Find', translation: 'Табуу (Находить)', example: 'Find the matching pair of words.' },
      { word: 'Use', translation: 'Колдонуу (Использовать)', example: 'Use new vocabulary in conversation.' },
      { word: 'Work', translation: 'Иштөө (Работать)', example: 'Work hard to achieve your goals.' },
      { word: 'Live', translation: 'Жашоо (Жить)', example: 'We live in a beautiful peaceful country.' },
    ]
  },

  // 26. Adjectives (Сын атоочтор)
  {
    category: '26. Adjectives (Сын атоочтор)',
    words: [
      { word: 'Big', translation: 'Чоң (Большой)', example: 'An elephant is a big animal.' },
      { word: 'Small', translation: 'Кичине (Маленький)', example: 'A mouse is very small.' },
      { word: 'Long', translation: 'Узун (Длинный)', example: 'The river is very long.' },
      { word: 'Short', translation: 'Кыска (Короткий)', example: 'A short and simple story.' },
      { word: 'Young', translation: 'Жаш (Молодой)', example: 'Young students learn quickly.' },
      { word: 'Old', translation: 'Кары / Эски (Старый)', example: 'An old wise teacher.' },
      { word: 'Beautiful', translation: 'Сулуу / Көркөм (Красивый)', example: 'A beautiful sunny day.' },
      { word: 'Ugly', translation: 'Көрксүз (Некрасивый)', example: 'The ugly monster turned into a prince.' },
      { word: 'Easy', translation: 'Жеңил / Оңой (Лёгкий)', example: 'This English game is fun and easy.' },
      { word: 'Difficult', translation: 'Оор / Татаал (Трудный)', example: 'With practice, difficult tasks become simple.' },
      { word: 'Hot', translation: 'Ысык (Горячий / Жаркий)', example: 'Summer days are bright and hot.' },
      { word: 'Cold', translation: 'Муздак / Суук (Холодный)', example: 'Winter in the mountains is cold.' },
      { word: 'Clean', translation: 'Таза (Чистый)', example: 'A clean room brings peace of mind.' },
      { word: 'Dirty', translation: 'Кир (Грязный)', example: 'Wash dirty hands with soap.' },
      { word: 'Strong', translation: 'Күчтүү (Сильный)', example: 'Sport makes you healthy and strong.' },
      { word: 'Weak', translation: 'Алсыз (Слабый)', example: 'Eat well so you do not feel weak.' },
      { word: 'Kind', translation: 'Боорукер / Ак көңүл (Добрый)', example: 'A kind heart is always appreciated.' },
      { word: 'Friendly', translation: 'Ынтымактуу (Дружелюбный)', example: 'Friendly classmates help each other.' },
    ]
  },

  // 27. Prepositions (Предлогдор)
  {
    category: '27. Prepositions (Предлогдор)',
    words: [
      { word: 'In', translation: 'Ичинде (Внутри / В)', example: 'The book is in my backpack.' },
      { word: 'On', translation: 'Үстүндө (На)', example: 'The notebook is on the desk.' },
      { word: 'Under', translation: 'Астында (Под)', example: 'The cat sleeps under the warm chair.' },
      { word: 'Behind', translation: 'Артында (Сзади)', example: 'The garden is behind our house.' },
      { word: 'Between', translation: 'Ортосунда (Между)', example: 'Kyrgyzstan is between Kazakhstan and Tajikistan.' },
      { word: 'Next to', translation: 'Жанында (Рядом с)', example: 'The bank is next to the school.' },
      { word: 'In front of', translation: 'Алдында (Перед)', example: 'Stand in front of the blackboard.' },
      { word: 'Near', translation: 'Жакын (Около / Вблизи)', example: 'We live near a quiet park.' },
      { word: 'Opposite', translation: 'Каршысында (Напротив)', example: 'The library is opposite the stadium.' },
    ]
  },

  // 28. Everyday Phrases (Күндөлүк фразалар)
  {
    category: '28. Everyday Phrases (Күндөлүк фразалар)',
    words: [
      { word: 'How are you?', translation: 'Кандайсыз? / Иштер кандай?', example: 'Hello! How are you doing today?' },
      { word: 'Nice to meet you', translation: 'Таанышканыма кубанычтамын', example: 'Nice to meet you, my name is Nurgazy.' },
      { word: 'Can I help you?', translation: 'Жардам берейинби?', example: 'Excuse me, can I help you find the room?' },
      { word: 'Excuse me', translation: 'Кечиресиз (Извините / Простите)', example: 'Excuse me, where is the English classroom?' },
      { word: 'Thank you', translation: 'Рахмат / Ыраазычылык', example: 'Thank you for your valuable lesson.' },
      { word: "You're welcome", translation: 'Эч нерсе эмес / Арзыбайт', example: 'You’re welcome! Always glad to help.' },
      { word: "I'm sorry", translation: 'Кечирип коюңуз / Кечиресиз', example: 'I’m sorry for being late.' },
      { word: "I don't understand", translation: 'Түшүнгөн жокмун (Я не понимаю)', example: 'Could you please explain again? I don’t understand.' },
      { word: 'Could you repeat, please?', translation: 'Кайталап коёсузбу, сураныч?', example: 'Could you repeat the word pronunciation, please?' },
      { word: 'What does it mean?', translation: 'Бул эмнени билдирет?', example: 'What does this English word mean?' },
    ]
  },

  // 29. Question Words (Суроо сөздөрү)
  {
    category: '29. Question Words (Суроо сөздөрү)',
    words: [
      { word: 'What', translation: 'Эмне (Что / Какой)', example: 'What is your favorite subject?' },
      { word: 'Where', translation: 'Кайда / Каяктан (Где / Куда)', example: 'Where do you live?' },
      { word: 'When', translation: 'Качан (Когда)', example: 'When does the English lesson begin?' },
      { word: 'Why', translation: 'Эмне үчүн (Почему / Зачем)', example: 'Why do you study English?' },
      { word: 'Who', translation: 'Ким (Кто)', example: 'Who is your English teacher?' },
      { word: 'Which', translation: 'Кайсы (Который / Какой)', example: 'Which game do you want to play?' },
      { word: 'How', translation: 'Кандай / Кантип (Как)', example: 'How do you pronounce this word?' },
      { word: 'How much', translation: 'Канча турат / Канча (Сколько)', example: 'How much is this book?' },
      { word: 'How many', translation: 'Канча даана / Саны канча (Сколько шт.)', example: 'How many students are in your class?' },
    ]
  }
];

async function seedAllTopics() {
  console.log('🚀 Начинаем полную быструю загрузку всех 29 тем в словарь и игры...');
  
  try {
    // Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS dictionary_words (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
        word VARCHAR(255) NOT NULL,
        translation VARCHAR(255) NOT NULL,
        category VARCHAR(255) DEFAULT 'Жалпы / Общий',
        example TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const classRes = await pool.query('SELECT id, name FROM classes ORDER BY created_at ASC');
    const classes = classRes.rows;
    if (classes.length === 0) {
      console.log('⚠️ Классы не найдены');
      return;
    }

    for (const cls of classes) {
      console.log(`\n📚 Обработка класса: "${cls.name}" (${cls.id})`);

      // ── 1. Заполняем словарь (dictionary_words) пакетно ──
      // Удаляем старые записи этого класса и вставляем актуальные
      await pool.query('DELETE FROM dictionary_words WHERE class_id = $1', [cls.id]);

      const allWordsList = [];
      for (const topic of TOPICS_DATA) {
        for (const item of topic.words) {
          allWordsList.push({
            class_id: cls.id,
            word: item.word,
            translation: item.translation,
            category: topic.category,
            example: item.example || ''
          });
        }
      }

      // Batch insert in chunks of 50
      for (let i = 0; i < allWordsList.length; i += 50) {
        const chunk = allWordsList.slice(i, i + 50);
        const valueStrings = [];
        const params = [];
        let paramIdx = 1;

        for (const w of chunk) {
          valueStrings.push(`($${paramIdx}, $${paramIdx+1}, $${paramIdx+2}, $${paramIdx+3}, $${paramIdx+4})`);
          params.push(w.class_id, w.word, w.translation, w.category, w.example);
          paramIdx += 5;
        }

        await pool.query(
          `INSERT INTO dictionary_words (class_id, word, translation, category, example) VALUES ${valueStrings.join(', ')}`,
          params
        );
      }
      console.log(`  ✅ В словарь загружено ${allWordsList.length} слов с переводом и примерами`);

      // ── 2. Создаем интерактивные игры для всех 29 тем ──
      // Удаляем старые игры и перезаписываем полным списком
      await pool.query('DELETE FROM games WHERE class_id = $1', [cls.id]);

      const gamesToInsert = [];

      // 29 Match Pairs игр
      for (const topic of TOPICS_DATA) {
        const pairs = topic.words.slice(0, 8).map(w => ({
          word: w.word,
          translation: w.translation
        }));
        gamesToInsert.push({
          title: `${topic.category} 🃏`,
          type: 'match_pairs',
          data: { pairs }
        });
      }

      // 5 Anagram игр
      const anagramTopics = [
        {
          title: '🔤 Анаграмма: Мектеп буюмдары (School)',
          words: [
            { word: 'school', translation: 'Мектеп' },
            { word: 'teacher', translation: 'Мугалим' },
            { word: 'pencil', translation: 'Карандаш' },
            { word: 'eraser', translation: 'Өчүргүч' },
            { word: 'backpack', translation: 'Рюкзак' },
          ]
        },
        {
          title: '🔤 Анаграмма: Үй-бүлө (Family)',
          words: [
            { word: 'father', translation: 'Ата' },
            { word: 'mother', translation: 'Эне / Апа' },
            { word: 'brother', translation: 'Ага / Ини' },
            { word: 'sister', translation: 'Эже / Сиңди' },
            { word: 'family', translation: 'Үй-бүлө' },
          ]
        },
        {
          title: '🔤 Анаграмма: Жаныбарлар (Animals)',
          words: [
            { word: 'eagle', translation: 'Бүркүт' },
            { word: 'dolphin', translation: 'Дельфин' },
            { word: 'rabbit', translation: 'Коён' },
            { word: 'monkey', translation: 'Маймыл' },
            { word: 'horse', translation: 'Жылкы' },
          ]
        },
        {
          title: '🔤 Анаграмма: Тамак-аш (Food & Drinks)',
          words: [
            { word: 'apple', translation: 'Алма' },
            { word: 'banana', translation: 'Банан' },
            { word: 'bread', translation: 'Нан' },
            { word: 'water', translation: 'Суу' },
            { word: 'juice', translation: 'Шире (Сок)' },
          ]
        },
        {
          title: '🔤 Анаграмма: Технология (Technology)',
          words: [
            { word: 'computer', translation: 'Компьютер' },
            { word: 'internet', translation: 'Интернет' },
            { word: 'phone', translation: 'Телефон' },
            { word: 'screen', translation: 'Экран' },
          ]
        },
      ];
      for (const a of anagramTopics) {
        gamesToInsert.push({ title: a.title, type: 'anagram', data: { words: a.words } });
      }

      // 3 Pronunciation игры
      const pronunTopics = [
        {
          title: '🎤 Произношение: Апта күндөрү (Days of the week)',
          words: [
            { word: 'Monday', translation: 'Дүйшөмбү' },
            { word: 'Tuesday', translation: 'Шейшемби' },
            { word: 'Wednesday', translation: 'Шаршемби' },
            { word: 'Thursday', translation: 'Бейшемби' },
            { word: 'Friday', translation: 'Жума' },
            { word: 'Saturday', translation: 'Ишемби' },
            { word: 'Sunday', translation: 'Жекшемби' },
          ]
        },
        {
          title: '🎤 Произношение: Эң керектүү этиштер (Top Verbs)',
          words: [
            { word: 'Speak', translation: 'Сүйлөө' },
            { word: 'Listen', translation: 'Угуу' },
            { word: 'Read', translation: 'Окуу' },
            { word: 'Write', translation: 'Жазуу' },
            { word: 'Understand', translation: 'Түшүнүү' },
            { word: 'Learn', translation: 'Үйрөнүү' },
          ]
        },
        {
          title: '🎤 Произношение: Сын атоочтор (Adjectives)',
          words: [
            { word: 'Beautiful', translation: 'Сулуу / Көркөм' },
            { word: 'Difficult', translation: 'Оор / Татаал' },
            { word: 'Friendly', translation: 'Ынтымактуу' },
            { word: 'Strong', translation: 'Күчтүү' },
            { word: 'Clean', translation: 'Таза' },
          ]
        }
      ];
      for (const p of pronunTopics) {
        gamesToInsert.push({ title: p.title, type: 'pronunciation', data: { words: p.words } });
      }

      // 2 Quiz игры
      const quizGames = [
        {
          title: '📖 Тест: 28. Күндөлүк фразалар (Everyday Phrases)',
          questions: [
            { question: "'How are you?' фразасы эмнени билдирет?", options: ['Кандайсыз? / Иштер кандай?', 'Атыңыз ким?', 'Каяктансыз?', 'Рахмат'], answer: 0 },
            { question: "'Nice to meet you' эмнени билдирет?", options: ['Рахмат', 'Сиз менен таанышканыма кубанычтамын', 'Көрүшкөнчө', 'Кечириңиз'], answer: 1 },
            { question: "'Thank you' сөзүнө кандай жооп берилет?", options: ['Excuse me', "You're welcome (Арзыбайт)", 'I am sorry', 'Goodbye'], answer: 1 },
            { question: "'I don't understand' эмнени билдирет?", options: ['Түшүндүм', 'Түшүнгөн жокмун', 'Жакшы калыңыз', 'Ооба'], answer: 1 },
          ]
        },
        {
          title: '📖 Тест: 29. Суроо сөздөрү (Question Words)',
          questions: [
            { question: "'Where' сөзү кыргызчага кандай которулат?", options: ['Качан', 'Кайда / Каяктан', 'Эмне үчүн', 'Ким'], answer: 1 },
            { question: "'When' суроосу эмнени сурайт?", options: ['Убакытты (Качан)', 'Адамды (Ким)', 'Ордун (Кайда)', 'Баасын (Канча)'], answer: 0 },
            { question: "'Why' суроосу эмнени билдирет?", options: ['Кандай', 'Эмне үчүн / Себебин', 'Ким', 'Кайсы'], answer: 1 },
            { question: "'How many' эмнени билдирет?", options: ['Канча даана / Саны канча', 'Кандай', 'Качан', 'Ким'], answer: 0 },
          ]
        },
      ];
      for (const q of quizGames) {
        gamesToInsert.push({ title: q.title, type: 'quiz', data: { questions: q.questions } });
      }

      // Batch insert games
      for (let i = 0; i < gamesToInsert.length; i += 20) {
        const chunk = gamesToInsert.slice(i, i + 20);
        const valueStrings = [];
        const params = [];
        let paramIdx = 1;

        for (const g of chunk) {
          valueStrings.push(`($${paramIdx}, $${paramIdx+1}, $${paramIdx+2}, $${paramIdx+3})`);
          params.push(cls.id, g.title, g.type, JSON.stringify(g.data));
          paramIdx += 4;
        }

        await pool.query(
          `INSERT INTO games (class_id, title, type, data) VALUES ${valueStrings.join(', ')}`,
          params
        );
      }

      console.log(`  ✅ Создано ${gamesToInsert.length} интерактивных игр (29 категорий + анаграммы + произношение + тесты)`);
    }

    console.log('\n🎉 ВСЕ 29 ТЕМ УСПЕШНО ЗАГРУЖЕНЫ В ИГРЫ И СЛОВАРЬ!');
  } catch (err) {
    console.error('❌ Ошибка загрузки:', err);
  } finally {
    process.exit(0);
  }
}

seedAllTopics();
