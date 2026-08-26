const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://neondb_owner:npg_wvC7KTQpN0Jl@ep-solitary-queen-awll96jl-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const GRADE6_VIDEOS = [
  { "name": "6-1.MOV", "url": "https://drive.google.com/file/d/12Wyev9nkfDhX6cCSk_rI2H58F2g86WAh/view" },
  { "name": "6-2.MOV", "url": "https://drive.google.com/file/d/1vfPoVZc2WkGieglQUwNdGLOirnN4NWiw/view" },
  { "name": "6-3.MOV", "url": "https://drive.google.com/file/d/1epvBOtpVjcJALk5YJJBBRTBWX49Kgkk9/view" },
  { "name": "6-4.MOV", "url": "https://drive.google.com/file/d/1mZN9Gfgz76u16VF-nvNCv_HCj1vf_GaV/view" },
  { "name": "6-5.MOV", "url": "https://drive.google.com/file/d/1ldqd5R-HGx1kyumcotWbQ-U3dFvsStQC/view" },
  { "name": "6-6.MOV", "url": "https://drive.google.com/file/d/1srDnnFS2pZsNIQlE80F2nrf6fIHMFnON/view" },
  { "name": "6-7.MOV", "url": "https://drive.google.com/file/d/198bafngw65ZeyfewM6aWwRvOm4tm2Zzi/view" },
  { "name": "6-8.MOV", "url": "https://drive.google.com/file/d/1TSQRCLqjjBcPQC1f6WJxx5MF_kxYSBzM/view" },
  { "name": "6-9.MOV", "url": "https://drive.google.com/file/d/1CbfKEV0CVuQNIVzzYJ0ad9WrsdlE3p_k/view" },
  { "name": "6-10.MOV", "url": "https://drive.google.com/file/d/1CMJdoJJsLyLHgIr-o_jbnC54M4T2Swe_/view" },
  { "name": "6-11.MOV", "url": "https://drive.google.com/file/d/1rk8nQr7C7QbOJSUSavrNk4QjlgvJRbqn/view" },
  { "name": "6-12.MOV", "url": "https://drive.google.com/file/d/1VN1N9TsHR0ar724EMP0coXS7Ziibm1FZ/view" },
  { "name": "6-13.MOV", "url": "https://drive.google.com/file/d/19fAUvTofNquEV2CSqlzGCIs7NhqXA4m8/view" },
  { "name": "6-14.MOV", "url": "https://drive.google.com/file/d/10acZ3ZRZmG2dYmbUehqk6Rw_RHGHNrQ_/view" },
  { "name": "6-15.MOV", "url": "https://drive.google.com/file/d/1vGOJ5tT7Qsz4oFXJjNW91LAoAY5AOpO9/view" },
  { "name": "6-16.MOV", "url": "https://drive.google.com/file/d/137-7xhRGveQ_gNEXPE5jXhFNexsSmNjb/view" },
  { "name": "6-17.MOV", "url": "https://drive.google.com/file/d/1K7YoxMOAmC5ThleCPsj9FxsIi35U5_DR/view" },
  { "name": "6-18.MOV", "url": "https://drive.google.com/file/d/1y7qzCWhVQRFqNXEO6fmTLwo8vJUuQuU6/view" },
  { "name": "6-19.MOV", "url": "https://drive.google.com/file/d/1Ap2r4OwCGqRQirq1NxwkrdvILcmpsXuO/view" },
  { "name": "6-20.MOV", "url": "https://drive.google.com/file/d/1yrE-upLsSkuTHaQLBHm1kvH5Q-Yka6Mf/view" },
  { "name": "6-21.MOV", "url": "https://drive.google.com/file/d/1ZjVqtfRyv56w6Rx_5iAJ7rkhQCsUaZe5/view" },
  { "name": "6-22.MOV", "url": "https://drive.google.com/file/d/1wWp9s65YQLjDoZEZPVQfcxGE07EefWt0/view" },
  { "name": "6-23.MOV", "url": "https://drive.google.com/file/d/1j3p6WdCySch5XWyEqn1PjYs_GSKooEnq/view" },
  { "name": "6-24.MOV", "url": "https://drive.google.com/file/d/1HV8Hqi_MG7E1mB-xGP1xhY5yPweHS7C2/view" },
  { "name": "6-25.MOV", "url": "https://drive.google.com/file/d/1Lq3IxMF76h6vj7TyVdjYwlAwRDGMw2jI/view" },
  { "name": "6-26.MOV", "url": "https://drive.google.com/file/d/1hpNletP1dLwFTIDj4dHUd26cpUnVvYa_/view" },
  { "name": "6-27.MOV", "url": "https://drive.google.com/file/d/191C8sWqCIG3liGMxOuoREINek6jqAISF/view" },
  { "name": "6-28.MOV", "url": "https://drive.google.com/file/d/1_HVQU0jCOFdQfLp1Rs_DSDWocaCf5Ptk/view" },
  { "name": "6-29.MOV", "url": "https://drive.google.com/file/d/1rsNvIG_Iiydcl92_lbGEJZwZSdRELpu2/view" },
  { "name": "6-30.MOV", "url": "https://drive.google.com/file/d/1ixA_Yz0ACFwMF5zwcpoX19XN5tyZzUbo/view" },
  { "name": "6-31.MOV", "url": "https://drive.google.com/file/d/1AoCPZ0PJXfhHQGr1WqogZvIPhHkt7SMl/view" },
  { "name": "6-32.MOV", "url": "https://drive.google.com/file/d/1Iak2ULK0vcaI_27S0-QMw5OzmrM3c6wx/view" },
  { "name": "6-33.MOV", "url": "https://drive.google.com/file/d/1q_jfSmmA7AkVXYURZkqN4509wq-8kxrd/view" }
];

async function updateGrade6() {
  console.log('🚀 Обновляем 6-класс всеми 33 уроками...');

  const classRes = await pool.query("SELECT id FROM classes WHERE name LIKE '%6-класс%'");
  if (classRes.rows.length === 0) {
    console.error('❌ 6-класс не найден!');
    return;
  }
  const classId = classRes.rows[0].id;

  // Очищаем старые видео 6 класса
  await pool.query('DELETE FROM videos WHERE class_id = $1', [classId]);

  // Дедупликация
  const seen = new Set();
  const unique = [];
  for (const v of GRADE6_VIDEOS) {
    if (!seen.has(v.url)) {
      seen.add(v.url);
      unique.push(v);
    }
  }

  for (const item of unique) {
    const rawName = item.name.replace('.MOV', '').replace('.mp4', '').trim();
    const match = rawName.match(/^6[-_](\d+)(.*)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      const title = `${num}-сабак`;
      await pool.query(
        `INSERT INTO videos (class_id, title, description, url, order_index)
         VALUES ($1, $2, $3, $4, $5)`,
        [classId, title, '6-класс үчүн видео сабак', item.url, num]
      );
      console.log(`  ✅ 6-класс -> ${title}`);
    }
  }

  const finalCheck = await pool.query(
    'SELECT c.name, COUNT(v.id) as count FROM classes c LEFT JOIN videos v ON c.id = v.class_id GROUP BY c.name ORDER BY c.name ASC'
  );

  console.log('\n📊 ТЕКУЩЕЕ СОСТОЯНИЕ ВСЕХ КЛАССОВ:');
  finalCheck.rows.forEach(r => console.log(`  ⭐ ${r.name}: ${r.count} уроков`));
}

updateGrade6()
  .catch(err => console.error(err))
  .finally(() => pool.end());
