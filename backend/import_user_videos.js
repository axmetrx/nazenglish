const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://neondb_owner:npg_wvC7KTQpN0Jl@ep-solitary-queen-awll96jl-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Список видео от пользователя
const RAW_VIDEOS = [
  { "name": "6-28.MOV", "url": "https://drive.google.com/file/d/1_HVQU0jCOFdQfLp1Rs_DSDWocaCf5Ptk/view" },
  { "name": "6-29.MOV", "url": "https://drive.google.com/file/d/1rsNvIG_Iiydcl92_lbGEJZwZSdRELpu2/view" },
  { "name": "6-30.MOV", "url": "https://drive.google.com/file/d/1ixA_Yz0ACFwMF5zwcpoX19XN5tyZzUbo/view" },
  { "name": "6-31.MOV", "url": "https://drive.google.com/file/d/1AoCPZ0PJXfhHQGr1WqogZvIPhHkt7SMl/view" },
  { "name": "6-32.MOV", "url": "https://drive.google.com/file/d/1Iak2ULK0vcaI_27S0-QMw5OzmrM3c6wx/view" },
  { "name": "6-33.MOV", "url": "https://drive.google.com/file/d/1q_jfSmmA7AkVXYURZkqN4509wq-8kxrd/view" },
  { "name": "7-1.MOV", "url": "https://drive.google.com/file/d/1uR_gz3xNan1YPHvYCAi7Fvtxl_VPCf55/view" },
  { "name": "7-2.MOV", "url": "https://drive.google.com/file/d/1zXoqpXNOjqCL7W-TzIFbw1O-Jgn_j41B/view" },
  { "name": "7-3.MOV", "url": "https://drive.google.com/file/d/1liA5lTQhPfrZBPMV4zNc3E-jIi7cqgvk/view" },
  { "name": "7-4.MOV", "url": "https://drive.google.com/file/d/1auxOgnFuOZQP_sfJ_VhGtIV6NEWMkYOf/view" },
  { "name": "7-5.MOV", "url": "https://drive.google.com/file/d/12Wk06bYpALdDLZKYSK_7nhkiupIihMry/view" },
  { "name": "7-6.MOV", "url": "https://drive.google.com/file/d/1WFfoMfaTyt0Jxh-6wht1FMABH3blx8Ay/view" },
  { "name": "7-7.MOV", "url": "https://drive.google.com/file/d/1IRQIB0AzVAN618xVNdCP3iSuos02PO9L/view" },
  { "name": "7-8.MOV", "url": "https://drive.google.com/file/d/1Ep19W5AXowM4KGs0RsOreDfwacy2yfhz/view" },
  { "name": "7-9.MOV", "url": "https://drive.google.com/file/d/1SAOmF4iidFyJBuj1xlMPtYvDwjQOnBau/view" },
  { "name": "7-10.MOV", "url": "https://drive.google.com/file/d/1hc3xkMta9I_DBn6An6ugwMn-FvfF93Fc/view" },
  { "name": "7-11.MOV", "url": "https://drive.google.com/file/d/1wSzlyO7fitmr-8Y7SaRs-Dt9E9DJ99He/view" },
  { "name": "7-12.MOV", "url": "https://drive.google.com/file/d/1XuW52lruIla484bRLsVWqyWrVlvcIIoc/view" },
  { "name": "7-13.MOV", "url": "https://drive.google.com/file/d/1ZjFplJUE_CffxgwzMKDmT03gzYombWx5/view" },
  { "name": "7-14.MOV", "url": "https://drive.google.com/file/d/1tDUMX3s8b-aQOJNOndkepzGl9xjLxe2s/view" },
  { "name": "7-15.MOV", "url": "https://drive.google.com/file/d/1tfm-rxC9CyMwjkltJq98MmeGUCftpIpt/view" },
  { "name": "7-16.MOV", "url": "https://drive.google.com/file/d/18BFMyA5rsBRp6T2Ly1rAOEinJQJLSTTA/view" },
  { "name": "7-17.MOV", "url": "https://drive.google.com/file/d/1cMLPhcDBWP4-LiQTaF1m0RWfxECXUwZm/view" },
  { "name": "7-18.MOV", "url": "https://drive.google.com/file/d/1cKsX6yiIfzjo89hCV3nCA6Tru8-_r7b2/view" },
  { "name": "7-19.MOV", "url": "https://drive.google.com/file/d/1Q_0_ZhhcQmnpMHu4obTfOMnUUzLS5wX5/view" },
  { "name": "7-20.MOV", "url": "https://drive.google.com/file/d/167UwxZYTHruTN8Jg0TJG2cnML6DjHfmY/view" },
  { "name": "7-21.MOV", "url": "https://drive.google.com/file/d/1fOBT60GMRGKEhjMKQN5aWgKHxc7GnNO5/view" },
  { "name": "7-22.MOV", "url": "https://drive.google.com/file/d/1o7vvdwFliP_ec5erxbe-DmyYXYUkhtLJ/view" },
  { "name": "7-23.MOV", "url": "https://drive.google.com/file/d/1grL2Wjz6snU7ad5-8UuYbNM66VjXJJnE/view" },
  { "name": "7-24.MOV", "url": "https://drive.google.com/file/d/1ZXRtYn1LNoos0oigjPvd1c00EhDkqfEP/view" },
  { "name": "7-25.MOV", "url": "https://drive.google.com/file/d/1rwolXZ-1sJaIZQg9nZIIOD42DCHvwGSK/view" },
  { "name": "7-26.MOV", "url": "https://drive.google.com/file/d/177jy5LfgBBi9przqEVJdfN2mWQCsh9O6/view" },
  { "name": "7-27.MOV", "url": "https://drive.google.com/file/d/1ZzAT6zAMV0ridY3ucEv86ys31R12LR9l/view" },
  { "name": "7-28.MOV", "url": "https://drive.google.com/file/d/1wnV5GhygNkZG1cbGu7mW4Btez9O_V-Ux/view" },
  { "name": "7-29.MOV", "url": "https://drive.google.com/file/d/1AD2JHvlVM05EOagoHMrXaWLKGODJy3Bn/view" },
  { "name": "7-30.MOV", "url": "https://drive.google.com/file/d/1NrhnckLgE1eZiD9WdJJVLezKYpy1JDzw/view" },
  { "name": "7-31.MOV", "url": "https://drive.google.com/file/d/17Cq9iviPG9lvBdIUdIiTmnDCUWWpgTiE/view" },
  { "name": "7-32.MOV", "url": "https://drive.google.com/file/d/1H-nVvxheRlgi0qm5pEf9wvbdJPl5tdlm/view" },
  { "name": "7-33.MOV", "url": "https://drive.google.com/file/d/1S1nfieWdI-JQR6BB3XoS9tR6YQDdPFMn/view" },
  { "name": "8-1.MOV", "url": "https://drive.google.com/file/d/1hgUeVwf43zUmlrIJzJJqMckUIEpqIY08/view" },
  { "name": "8-2.MOV", "url": "https://drive.google.com/file/d/1RtmVKamXCtXzgQRQe62eQoSO6b3mMUVd/view" },
  { "name": "8-3.MOV", "url": "https://drive.google.com/file/d/1LLY1NI7EvM99ygGrAnQBsHbymSe7PuOk/view" },
  { "name": "8-4.MOV", "url": "https://drive.google.com/file/d/1-L9ycGA56Vlc0OBjQ4awF7X5F8xtTf1E/view" },
  { "name": "8-5.MOV", "url": "https://drive.google.com/file/d/1iAcg7u9FeZbUrKBK3XhKDb7vMmZPRKqi/view" },
  { "name": "8-6.MOV", "url": "https://drive.google.com/file/d/1AWnDj76xTCXr9NGWqbnHm98N_eh20RPs/view" },
  { "name": "8-7.MOV", "url": "https://drive.google.com/file/d/1jdUhTsrRHu2imiOP2YnOExtQT09CQ5kW/view" },
  { "name": "8-8.MOV", "url": "https://drive.google.com/file/d/1emAoQkUwMAyvFHkfl94vfU52TblPbiwj/view" },
  { "name": "8-9.MOV", "url": "https://drive.google.com/file/d/1nmMyzM76H2jEpzqhkntiZj2FxqYNySbz/view" },
  { "name": "8-10.MOV", "url": "https://drive.google.com/file/d/1bWYlwDIrh39HxNq1GEIi_XGylo5Ircc_/view" },
  { "name": "8-11.MOV", "url": "https://drive.google.com/file/d/1rF3v88dIJYVZXCXs0fZwqqswU0QDpckS/view" },
  { "name": "8-12.MOV", "url": "https://drive.google.com/file/d/1Eghvifrgal3sJQpc_iUsd1Yfavs_easW/view" },
  { "name": "8-13.MOV", "url": "https://drive.google.com/file/d/1Cv1ARZDGYppEDocEeZakl5IJeeyZOi4_/view" },
  { "name": "8-14.MOV", "url": "https://drive.google.com/file/d/1DtEICsaRw-77fgDXyJRE31skllrWQtzO/view" },
  { "name": "8-15.MOV", "url": "https://drive.google.com/file/d/1ROMN2L4k9Cy_8LjmbtrTV7mA1Pv4n7sE/view" },
  { "name": "8-16.MOV", "url": "https://drive.google.com/file/d/1tYspsxhc5oBUeDHZZWlExd3cUkWaHBFc/view" },
  { "name": "8-17.MOV", "url": "https://drive.google.com/file/d/1Oi3OXZzoXl5FqfQlcibQ3YtaVDNO8i18/view" },
  { "name": "8-18.MOV", "url": "https://drive.google.com/file/d/159yXf3bTAN6o7Z9A-DDB71cam8lS-_Wk/view" },
  { "name": "8-19.MOV", "url": "https://drive.google.com/file/d/1T3nWH2LpSyLXD09Y7MYOoftf9Sz_yWDc/view" },
  { "name": "8-20.MOV", "url": "https://drive.google.com/file/d/1rtqX1wLWmsQcpvlhRtj3F7mjwkUHEmRS/view" },
  { "name": "8-21.MOV", "url": "https://drive.google.com/file/d/1nRM69N2IVzB62RFeCzpiVUlpIiq4Ga3r/view" },
  { "name": "8-22.MOV", "url": "https://drive.google.com/file/d/1_8ruFY7G4E1ez9UqYZC96YIrP3oFDQIs/view" },
  { "name": "8-23.MOV", "url": "https://drive.google.com/file/d/1dQRMLnQEIseJBkLBDqw0dK6-oEVKfjOr/view" },
  { "name": "8-24.MOV", "url": "https://drive.google.com/file/d/1YIcXjCTZwol1Rv9a_jJpEsl4_RRzP7hg/view" },
  { "name": "8-25.MOV", "url": "https://drive.google.com/file/d/1SPv5jMI_RdY4pf0Zrq4S5wTWEo7JRBfy/view" },
  { "name": "8-26.MOV", "url": "https://drive.google.com/file/d/1C8I3Vv4l2WfAE69xt_9mHWqqFzhXPgAY/view" },
  { "name": "8-27.MOV", "url": "https://drive.google.com/file/d/1MXnOnu4BF3GwZdgMRhMwxcrQXRj7_-Gk/view" },
  { "name": "8-28.MOV", "url": "https://drive.google.com/file/d/1UjGMuBwlSYecba87pdwiBLJOP7mCJCEl/view" },
  { "name": "8-29.MOV", "url": "https://drive.google.com/file/d/1kGeiqfD0cY6QOwUfNWp11ySLX-cNnWp4/view" },
  { "name": "8-30.MOV", "url": "https://drive.google.com/file/d/1HWkCEKig-ygExCDruHfDu7zWAgzBfB_R/view" },
  { "name": "8-31.MOV", "url": "https://drive.google.com/file/d/1Xb56K3MXHRNLCcIRwP8ILiV3FEVoNyFr/view" },
  { "name": "8-32.MOV", "url": "https://drive.google.com/file/d/1MgdEEwUg8vf457qxNiqQWm0GXCpFw0K-/view" },
  { "name": "8-33.MOV", "url": "https://drive.google.com/file/d/1Gk1DLXEqEzRAMfoGMopGlW1-7zml-mMS/view" },
  { "name": "8-34.MOV", "url": "https://drive.google.com/file/d/12F7vcMW9ho7_duk6BvwSgkUyIU4BM0VP/view" },
  { "name": "8-35.MOV", "url": "https://drive.google.com/file/d/1m6t6-Jh7kuE_wWBpXT2JIpXFg0ym0R96/view" },
  { "name": "9-1 1ч.MOV", "url": "https://drive.google.com/file/d/1uPmFG3xu_5IWifN8IZovkOq-emsPDULT/view" },
  { "name": "9-1 2-ч.MOV", "url": "https://drive.google.com/file/d/1d6HBfYjm5eNaK6-Ae4xEn_vfBOIpY3Bv/view" },
  { "name": "9-2.MOV", "url": "https://drive.google.com/file/d/10NTuwFP8sw5lAjvdtliwNgsV4pr3ICJ5/view" },
  { "name": "9-3.MOV", "url": "https://drive.google.com/file/d/1S4TOc5EbE5wgJteCgWV1EOwnzdcoU97B/view" },
  { "name": "9-4.MOV", "url": "https://drive.google.com/file/d/1trKiuRykzquTFm7Gmf1ttS6S3z8VtRSj/view" },
  { "name": "9-5.MOV", "url": "https://drive.google.com/file/d/1V1zkXPHfkUccejCwJ7pmsXT9wA0OE82n/view" },
  { "name": "9-6.MOV", "url": "https://drive.google.com/file/d/1G99T6D8nJK0mCV-2a1v3eJyLQbR-0dBl/view" },
  { "name": "9-7.MOV", "url": "https://drive.google.com/file/d/1M5-EdX7SBXXAs07CrV5G-11YPkrucHlD/view" },
  { "name": "9-8.MOV", "url": "https://drive.google.com/file/d/1TGPAJ9GJbmqSGZf4zD8epRQDkwd8WztN/view" },
  { "name": "9-9.MOV", "url": "https://drive.google.com/file/d/1dlTtQq4a3CbDRaZxGy7pFIm5KGk344zV/view" },
  { "name": "9-10.MOV", "url": "https://drive.google.com/file/d/1rctycS-YNG_RUd6INd24qvBEZGMgw7iu/view" },
  { "name": "9-11.MOV", "url": "https://drive.google.com/file/d/148XPQu6MuPJud-IiJFMB2T8s3t904s5t/view" },
  { "name": "9-12.MOV", "url": "https://drive.google.com/file/d/1UYK9SxPZQ5EUPkxgeHGOYgxzs70px96t/view" },
  { "name": "9-13.MOV", "url": "https://drive.google.com/file/d/1jzqbUHH9Uhl6y7thdOZJAytBaT5h5yVH/view" },
  { "name": "9-14.MOV", "url": "https://drive.google.com/file/d/1avYIkB0_yTVNxqoGp2B35WdEfQ8dt1lv/view" },
  { "name": "9-15.MOV", "url": "https://drive.google.com/file/d/1EtjtGr4cBtQ-60gkKATCNo2dULJb24Oz/view" },
  { "name": "9-16.MOV", "url": "https://drive.google.com/file/d/1phRobDMZdnQVfdryaqIZePgwmfsRTN2-/view" },
  { "name": "9-18.MOV", "url": "https://drive.google.com/file/d/1_mNySCUOWf7OwNXKOCc3qwI_13dlx4TK/view" },
  { "name": "9-19.MOV", "url": "https://drive.google.com/file/d/1uIuPPzPyhczvLFZmODvk65477yqb3-WK/view" },
  { "name": "9-20.MOV", "url": "https://drive.google.com/file/d/1EIYSWKibUialQl69SWUJKF13ujfXUXFG/view" },
  { "name": "9-21.MOV", "url": "https://drive.google.com/file/d/1qFVAuwmVplWWMABPI1YuF6j8lkf-pjtV/view" },
  { "name": "9-22.MOV", "url": "https://drive.google.com/file/d/1_TacPD_CQOg2AWulxJzgsUohdM3rIzri/view" },
  { "name": "9-24.MOV", "url": "https://drive.google.com/file/d/1ro4JorktjcMf_shQyleVdNRQajxfVj70/view" },
  { "name": "9-25.MOV", "url": "https://drive.google.com/file/d/1q8kINWY7xo-WlD4Dqb-v8-pRyKQsoNYP/view" },
  { "name": "9-26.MOV", "url": "https://drive.google.com/file/d/1Ay07p69sKDpulr0NjpAEFHq2kRMpUtoq/view" },
  { "name": "9-27.MOV", "url": "https://drive.google.com/file/d/1gwe8LgEmiAmvG8Sq5hfO171FDzZmUIfm/view" },
  { "name": "9-28.MOV", "url": "https://drive.google.com/file/d/1Mv4BN4ejEHqJoL2qEl2j5S4j6MXnxraL/view" },
  { "name": "9-29.MOV", "url": "https://drive.google.com/file/d/1r9FjZhpvZTvEvTr82_n9f8s0XzdINzNV/view" },
  { "name": "9-30.MOV", "url": "https://drive.google.com/file/d/1NiOkSL0ajpblPsfylYazgdG8cVueHV37/view" },
  { "name": "9-31.MOV", "url": "https://drive.google.com/file/d/189PwCOP_-qhlPC3QYExdreYOTZD61kCu/view" },
  { "name": "9-32.MOV", "url": "https://drive.google.com/file/d/1rKxKKmLVMwME4g8NMzhqCFMYX3TGcPRI/view" },
  { "name": "бонус 1-ч.MOV", "url": "https://drive.google.com/file/d/1_40o6a5VmGVq824hbi-lW_sqgbDI3kye/view" },
  { "name": "бонус 2-ч.MOV", "url": "https://drive.google.com/file/d/1tuRlcv_lePwsuX2zPckYyMVho5RVCJBd/view" },
  { "name": "бонус+.MOV", "url": "https://drive.google.com/file/d/1nfDSd_N38eaXXINdS3joGv8AuA27QldZ/view" },
  { "name": "бонус++.MOV", "url": "https://drive.google.com/file/d/1Y0-5kwaUJpgl2de5ZS36Kqw30i3zS1Vl/view" },
  { "name": "тест для первый урок.mp4", "url": "https://drive.google.com/file/d/1iCp05CDF8ycbUGwsxiP7mL238RcaQKZi/view" }
];

async function importVideos() {
  console.log('🚀 Начинаем импорт реальных видеоуроков в Neon DB...\n');

  // Дедупликация по URL
  const seenUrls = new Set();
  const uniqueVideos = [];
  for (const v of RAW_VIDEOS) {
    if (!v.url || v.url.includes('_gd') || seenUrls.has(v.url)) continue;
    seenUrls.add(v.url);
    uniqueVideos.push(v);
  }
  console.log(`📊 Уникальных видеофайлов: ${uniqueVideos.length}`);

  // Получаем существующие классы
  const classesRes = await pool.query('SELECT id, name FROM classes');
  const classMap = {};
  classesRes.rows.forEach(c => {
    classMap[c.name] = c.id;
  });

  // Удаляем старые видео-плейсхолдеры
  await pool.query("DELETE FROM videos WHERE url LIKE '%PLACEHOLDER%'");
  console.log('🧹 Очищены старые временные плейсхолдеры');

  let importedCount = 0;

  for (const item of uniqueVideos) {
    const rawName = item.name.replace('.MOV', '').replace('.mp4', '').trim();
    let gradeNumber = null;
    let lessonNumber = null;

    // Проверяем паттерн "X-Y" (например "7-12" -> 7 класс, 12 урок)
    const match = rawName.match(/^(\d+)[-_](\d+)(.*)$/);
    if (match) {
      gradeNumber = match[1];
      lessonNumber = match[2];
      const extra = match[3]?.trim();
      const className = `${gradeNumber}-класс (Англис тили)`;
      const classId = classMap[className];

      if (classId) {
        let title = `${lessonNumber}-сабак`;
        if (extra) title += ` (${extra})`;

        await pool.query(
          `INSERT INTO videos (class_id, title, description, url, order_index)
           VALUES ($1, $2, $3, $4, $5)`,
          [classId, title, `${gradeNumber}-класс үчүн видео сабак`, item.url, parseInt(lessonNumber, 10)]
        );
        importedCount++;
        console.log(`  ✅ [${className}] -> ${title}`);
      }
    } else {
      // Бонусы и тесты - добавляем в 9-класс или во все классы
      const classId = classMap['9-класс (Англис тили)'];
      if (classId) {
        await pool.query(
          `INSERT INTO videos (class_id, title, description, url, order_index)
           VALUES ($1, $2, $3, $4, $5)`,
          [classId, rawName, 'Кошумча / Бонус сабак', item.url, 999]
        );
        importedCount++;
        console.log(`  ⭐ [9-класс] -> ${rawName}`);
      }
    }
  }

  console.log(`\n🎉 Успешно импортировано ${importedCount} реальных видеоуроков в базу Neon!`);
}

importVideos()
  .catch(err => console.error('Error:', err))
  .finally(() => pool.end());
