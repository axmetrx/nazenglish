const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_wvC7KTQpN0Jl@ep-solitary-queen-awll96jl-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

async function main() {
  const res = await pool.query('SELECT id, title, url FROM videos ORDER BY id ASC');
  const fileIds = [];
  res.rows.forEach(r => {
    let match = r.url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/);
    if (match) fileIds.push(match[1]);
  });
  const uniqueIds = [...new Set(fileIds)];

  const scriptContent = `/**
 * Google Apps Script для автоматического открытия доступа к видео на Google Диске
 * 
 * 📋 ИНСТРУКЦИЯ (займет 1 минуту):
 * 1. Откройте в браузере: https://script.google.com (под тем Google-аккаунтом, где хранятся видео)
 * 2. Нажмите синюю кнопку "+ Новый проект" (+ New project)
 * 3. Сотрите весь существующий текст, вставьте весь этот код целиком
 * 4. Нажмите сверху кнопку "Выполнить" (Run) ▶
 * 5. Google запросит доступ к Google Диску:
 *    - Нажмите "Проверить разрешения" (Review Permissions)
 *    - Выберите свой Google аккаунт
 *    - Нажмите "Дополнительно" (Advanced) снизу слева -> "Перейти к проекту (небезопасно)"
 *    - Нажмите "Разрешить" (Allow)
 * 6. Скрипт за несколько секунд откроет доступ ко всем вашим видео!
 */

function openAccessToAllVideos() {
  var fileIds = ` + JSON.stringify(uniqueIds, null, 2) + `;

  var successCount = 0;
  var errorCount = 0;

  for (var i = 0; i < fileIds.length; i++) {
    var id = fileIds[i];
    try {
      var file = DriveApp.getFileById(id);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      successCount++;
      Logger.log((i + 1) + '/' + fileIds.length + ' [✅ ДОСТУП ОТКРЫТ]: ' + file.getName());
    } catch (e) {
      errorCount++;
      Logger.log((i + 1) + '/' + fileIds.length + ' [⚠️ ПРОПУСК ID: ' + id + ']: ' + e.message);
    }
  }

  Logger.log('==============================================');
  Logger.log('🎉 ГОТОВО! Успешно открыт доступ к ' + successCount + ' видео.');
  if (errorCount > 0) {
    Logger.log('ℹ️ Пропущено ' + errorCount + ' файлов (возможно, удалены или на другом Google аккаунте).');
  }
}
`;

  fs.writeFileSync('Google_Drive_Auto_Share.js', scriptContent, 'utf-8');
  console.log('Successfully generated Google_Drive_Auto_Share.js with ' + uniqueIds.length + ' files!');
  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
