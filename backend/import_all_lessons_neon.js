const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://neondb_owner:npg_wvC7KTQpN0Jl@ep-solitary-queen-awll96jl-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ЧАСТЬ 1: 3-й, 4-й, 5-й, 6-й классы
const PART1 = [
  { "name": "3-1.MOV", "url": "https://drive.google.com/file/d/1YNrGzwFt2uN6vCIBo3ok27eVflmWtX1N/view" },
  { "name": "3-2.MOV", "url": "https://drive.google.com/file/d/1aEhsHeLZMqwzTscGl7LOpLo62aKFZEWG/view" },
  { "name": "3-3.MOV", "url": "https://drive.google.com/file/d/1Gy_EI2NhNQvuFBWN95Z1ATcpnhc1cah8/view" },
  { "name": "3-4.MOV", "url": "https://drive.google.com/file/d/1-dS4lBoUhNS_B7aY5O5caId67ZSf45qn/view" },
  { "name": "3-5.MOV", "url": "https://drive.google.com/file/d/15NFqHTQPNxMmJBfIEs9t5Vxp_mX8QZKS/view" },
  { "name": "3-6.MOV", "url": "https://drive.google.com/file/d/1ZUa1NBhqUykl9HpdJh32pHdUXUbRV_EV/view" },
  { "name": "3-7.MOV", "url": "https://drive.google.com/file/d/16N609qzy7BUzLymzebf801WHujnTTsyw/view" },
  { "name": "3-8.MOV", "url": "https://drive.google.com/file/d/1eMnOCGcJpDf2rpmtbw6qJEvn1Hmppitt/view" },
  { "name": "3-9.MOV", "url": "https://drive.google.com/file/d/1CyAxrbhbzSk2EkJhUP5h826T7_YsPllg/view" },
  { "name": "3-10.MOV", "url": "https://drive.google.com/file/d/1eoP-ZR6T66Y4WiExRv35AaAMLazqsr7F/view" },
  { "name": "3-11.MOV", "url": "https://drive.google.com/file/d/1rkEn0H2GIqx7CeJxYfAPHpEyZ5I2AK1V/view" },
  { "name": "3-12.MOV", "url": "https://drive.google.com/file/d/1z6fWsVbyEQr2Tf9lEWbQJH8hnMazU2QQ/view" },
  { "name": "3-13.MOV", "url": "https://drive.google.com/file/d/1DBsp9AwD2hugmykcjOLD3pJD7OWs4q0T/view" },
  { "name": "3-14.MOV", "url": "https://drive.google.com/file/d/1B6VdLJatDzdemGZf5CZg5EemkXvDUHCk/view" },
  { "name": "3-15.MOV", "url": "https://drive.google.com/file/d/19dg5p18HjzQebYJDNWmUbEZV2F1kdm95/view" },
  { "name": "3-16.MOV", "url": "https://drive.google.com/file/d/1yfs9RRddJOObPFjKPt-U_wQtntrOGQ5q/view" },
  { "name": "3-17.MOV", "url": "https://drive.google.com/file/d/19Vj5ds4Y-lttNgeNgxEp5ybuIgNru84v/view" },
  { "name": "3-18.MOV", "url": "https://drive.google.com/file/d/1SQXueejNfGJ_6hbro1E5tVu01joOJJLT/view" },
  { "name": "3-19.MOV", "url": "https://drive.google.com/file/d/1OBTtz9snrQy7qcOsixMPOCuRAVGb5XF0/view" },
  { "name": "3-20.MOV", "url": "https://drive.google.com/file/d/1fv5uoXCnqafpA0nSiqhdKWclhHgoKfTw/view" },
  { "name": "3-21.MOV", "url": "https://drive.google.com/file/d/1xr5sULWHDegHAa0uH8KqWaQwN7vVq2eG/view" },
  { "name": "3-22.MOV", "url": "https://drive.google.com/file/d/1FFXiE8jqLviwPmkwPr0T1OunQtRb0Jnp/view" },
  { "name": "3-23.MOV", "url": "https://drive.google.com/file/d/1XpkysKJ9wTCns3lTV34Or6hQdG6xdcD3/view" },
  { "name": "3-24.MOV", "url": "https://drive.google.com/file/d/1YKorgowXX8zgBIDe4S70V6i5OuVBMi_7/view" },
  { "name": "3-25.MOV", "url": "https://drive.google.com/file/d/1cUn1DeFg96S0LtDhsvXxfn_yqj8MM2s3/view" },
  { "name": "3-26.MOV", "url": "https://drive.google.com/file/d/1_1ygZyKy8lwKvsVdPrWNTd5CI9TJBcWj/view" },
  { "name": "3-27.MOV", "url": "https://drive.google.com/file/d/1TQElvuMWlUeECz3Z6cZ__saDYt9EQjIB/view" },
  { "name": "3-28.MOV", "url": "https://drive.google.com/file/d/1ZMrfO4srJgcoWsDv-9FjXKHO0I_z7nCd/view" },
  { "name": "3-29.MOV", "url": "https://drive.google.com/file/d/1WrrNKOHWMTCKu9hR7JvszEhV2DJM5plP/view" },
  { "name": "3-30.MOV", "url": "https://drive.google.com/file/d/1eLCdTLrsLS-AqDK_XMu2SVM9Rx2RGdjJ/view" },
  { "name": "4-1.MOV", "url": "https://drive.google.com/file/d/1M7V9DiIDGT6d6zrVpjAEKQrc9KgMOZB0/view" },
  { "name": "4-2.MOV", "url": "https://drive.google.com/file/d/1oPXQntjFOfxsg6aXKfvYULBx9YgJjARd/view" },
  { "name": "4-3.MOV", "url": "https://drive.google.com/file/d/13SpLFqWnt11FAdQlkd5dPHu3rL6IrAGq/view" },
  { "name": "4-4.MOV", "url": "https://drive.google.com/file/d/1gyzepqF7iWVmFW2ft1g6-hjpFZkY2QYF/view" },
  { "name": "4-5.MOV", "url": "https://drive.google.com/file/d/14SClUMjg_dbyrxCaI-gIktZRHmh8auV6/view" },
  { "name": "4-6.MOV", "url": "https://drive.google.com/file/d/19GLKUq5ItU61SYEMCgTapEUg1oA1JiEw/view" },
  { "name": "4-7.MOV", "url": "https://drive.google.com/file/d/1TDX_0TxcAyLRmcuttkse520vTFUB2YTL/view" },
  { "name": "4-8.MOV", "url": "https://drive.google.com/file/d/1rgLx-0JIFiOiy21CsTA1HI_DSs2-ekb4/view" },
  { "name": "4-9.MOV", "url": "https://drive.google.com/file/d/1FRRG5Ev-Xlh-OooHWBaTnI9vS3RlO2eS/view" },
  { "name": "4-10.MOV", "url": "https://drive.google.com/file/d/11cnUpk3z1e_pDTM7T_q6PPwE7lq2isYe/view" },
  { "name": "4-11.MOV", "url": "https://drive.google.com/file/d/1R-I7TuI7W9urbuwph7oL0TJbeZ-oREnA/view" },
  { "name": "4-12.MOV", "url": "https://drive.google.com/file/d/10kUmiOOkr87LFFzskzA6uJDs6SUrEoHR/view" },
  { "name": "4-13.MOV", "url": "https://drive.google.com/file/d/1dszksSAEoywkPTJRfmK34C8kLB07cmgU/view" },
  { "name": "4-14.MOV", "url": "https://drive.google.com/file/d/1kxINuS9B5fB9pAtEJiB7ZrN8p__vpY9G/view" },
  { "name": "4-15.MOV", "url": "https://drive.google.com/file/d/1lwdjXPc0-CCBL1sNgySMLJa9ygvMDdM7/view" },
  { "name": "4-16.MOV", "url": "https://drive.google.com/file/d/1zTDQQ81GEFwiVTYDadyUj3tF39y3_4cn/view" },
  { "name": "4-17.MOV", "url": "https://drive.google.com/file/d/1dRoqEMeYl16ADLgpUThxVhssaGv2TExY/view" },
  { "name": "4-18.MOV", "url": "https://drive.google.com/file/d/15BMarpUbEV2zfMGTlrpNzkBGaOhWihRz/view" },
  { "name": "4-19.MOV", "url": "https://drive.google.com/file/d/1Of67gaM-sdBiQvJ1jbjFHwytX8EPrqvl/view" },
  { "name": "4-20.MOV", "url": "https://drive.google.com/file/d/1zxmTT172xEgUCXhWSfgVeuC10o94swkF/view" },
  { "name": "4-21.MOV", "url": "https://drive.google.com/file/d/18NDDGd0RnkvvPkh23571a79RywPOG5W9/view" },
  { "name": "4-22.MOV", "url": "https://drive.google.com/file/d/1Npv374yOMBz7wDhuEmuY060TwSejnJEE/view" },
  { "name": "4-23.MOV", "url": "https://drive.google.com/file/d/10jhKMpidI_MLKy9dT9vKpvPhrtsEMS1J/view" },
  { "name": "4-24.MOV", "url": "https://drive.google.com/file/d/1sYq8CWFAU19cT3q3qYoNulNsgsLdAvA_/view" },
  { "name": "4-25.MOV", "url": "https://drive.google.com/file/d/19n5P0a-_AlBmThi5fMjc4VMwSDN6gdGL/view" },
  { "name": "4-26.MOV", "url": "https://drive.google.com/file/d/19FlBP9QV7MOpVod6qUEsnr0-GBAHjP9k/view" },
  { "name": "4-27.MOV", "url": "https://drive.google.com/file/d/13PvsrisJiCqkjU9Xe5dTmYo2ypiKVrlP/view" },
  { "name": "4-28.MOV", "url": "https://drive.google.com/file/d/14yRcrBBJLL_xchUpL58eR8WG7qjr6dJw/view" },
  { "name": "4-29.MOV", "url": "https://drive.google.com/file/d/1POXAHIBRP2RSaSsWNr7j4_6ywFcEF0DA/view" },
  { "name": "4-30.MOV", "url": "https://drive.google.com/file/d/1YFdU26RXVYY0tuqKPSv_ff0ZBmjF5t-7/view" },
  { "name": "4-31.MOV", "url": "https://drive.google.com/file/d/1DKxrtK87_YtpnWHAydvEEfcjSCf-CD7L/view" },
  { "name": "4-32.MOV", "url": "https://drive.google.com/file/d/1YTuXDxt_ZVjkZW1m_c7WxFkxFFGNGN6I/view" },
  { "name": "4-33.MOV", "url": "https://drive.google.com/file/d/1hgVh-4xUflNS9xL1Yltc0DX7AhOIjV0f/view" },
  { "name": "4-34.MOV", "url": "https://drive.google.com/file/d/1UjEgV2gYbAQQpE3iZZSEjBqup7ixs7Vx/view" },
  { "name": "4-35.MOV", "url": "https://drive.google.com/file/d/1X-lpMOsKxSbCAzAJdq_OynJnakr8kVPD/view" },
  { "name": "5-1.MOV", "url": "https://drive.google.com/file/d/1-7HjcQKHJj1OZSBFKGnVw64A6kJEbHVj/view" },
  { "name": "5-2.MOV", "url": "https://drive.google.com/file/d/1RY1d-x6W0LvFwQmZQcPItayltCRqTkB-/view" },
  { "name": "5-3.MOV", "url": "https://drive.google.com/file/d/1hmpweV64oQRdkq2n_r3_gUY7kWhb44kl/view" },
  { "name": "5-4.MOV", "url": "https://drive.google.com/file/d/1RZ_xLusBHrX6ZxmhqvyhOhl_jlYjTELd/view" },
  { "name": "5-5.MOV", "url": "https://drive.google.com/file/d/1dY5avP1HRY71hyThBknwyyT3UZnjfDxx/view" },
  { "name": "5-6.MOV", "url": "https://drive.google.com/file/d/1O_6skSHWC7yTw74h8Dup6OuhpgRRVpQr/view" },
  { "name": "5-7.MOV", "url": "https://drive.google.com/file/d/18u2TjiTQo8QNFzdGvh7IMlWMtwCyWALh/view" },
  { "name": "5-8.MOV", "url": "https://drive.google.com/file/d/13HWpZy8oF7h6i1z84zMnGqRREGr5NV5Q/view" },
  { "name": "5-9.MOV", "url": "https://drive.google.com/file/d/1stnCy8rpjmMqvudHK0ws3SXuwzNovt91/view" },
  { "name": "5-10.MOV", "url": "https://drive.google.com/file/d/1m2f5XrRoWWpwrGiwm5AvMETrEwQv5Le6/view" },
  { "name": "5-11.MOV", "url": "https://drive.google.com/file/d/1FJSGU-w9ATNXQ6DIhLJT6iWsFjmE16GL/view" },
  { "name": "5-12.MOV", "url": "https://drive.google.com/file/d/1xjkcRNe_LGxPGS7bOCX8TgXnRdmC37Vs/view" },
  { "name": "5-13.MOV", "url": "https://drive.google.com/file/d/1yroSf7Ww25dFgJd2N_7jRcMBBQr87leu/view" },
  { "name": "5-14.MOV", "url": "https://drive.google.com/file/d/1yl0i2KFyt1ACEMP3XGV_Oz7bgOw6A47E/view" },
  { "name": "5-15.MOV", "url": "https://drive.google.com/file/d/1Ot0x7hrouVTMBsmWlv26croJhRN-chrA/view" },
  { "name": "5-16.MOV", "url": "https://drive.google.com/file/d/1JBEyYKoHzPlACUTzKkjBnPfsHPow63Mk/view" },
  { "name": "5-17.MOV", "url": "https://drive.google.com/file/d/1hhrxZsIkcaf0DCqEtZ-HDt4AGBENqBqy/view" },
  { "name": "5-18.MOV", "url": "https://drive.google.com/file/d/15YyofWQtCX5_YfirGCt-5JRMnvbqCcqD/view" },
  { "name": "5-19.MOV", "url": "https://drive.google.com/file/d/1QFnQAcPJecTpigJG4TheV3ax-zWJqkUq/view" },
  { "name": "5-20.MOV", "url": "https://drive.google.com/file/d/1jnf4QqXQ9hr6X_5yBFZVMMv9lqbpNgT6/view" },
  { "name": "5-21.MOV", "url": "https://drive.google.com/file/d/1AUbo02uh4ZP07k2Z2McxV8q8cb9YRaVr/view" },
  { "name": "5-22.MOV", "url": "https://drive.google.com/file/d/1Qp91Q71fDC9OFGB5e_j-k1gqP-SBatfa/view" },
  { "name": "5-23.MOV", "url": "https://drive.google.com/file/d/1VYoj9j7-aYXWFMjOOIjEf9XSxdaPnIS-/view" },
  { "name": "5-24.MOV", "url": "https://drive.google.com/file/d/18hXj_-6Pmmws082zwpb2L6gIfN6WqHfM/view" },
  { "name": "5-25.MOV", "url": "https://drive.google.com/file/d/1J3w3eroHkAxryL_ll9at_N62ENuA6cO8/view" },
  { "name": "5-26.MOV", "url": "https://drive.google.com/file/d/1wVWTJMNcxKv-Aauv5hLt4e5UxFtEjzQR/view" },
  { "name": "5-27.MOV", "url": "https://drive.google.com/file/d/1KrZorhhcGoEECMJxtH2PaCbftDoEt9Vr/view" },
  { "name": "5-28.MOV", "url": "https://drive.google.com/file/d/1M6RiA7PGM3N6TKrBi9cTxVdTCEr6oqCe/view" },
  { "name": "5-29.MOV", "url": "https://drive.google.com/file/d/1Bh-K6ETTQCN2iYaU9R4NZHD1-witRyWg/view" },
  { "name": "5-30.MOV", "url": "https://drive.google.com/file/d/1QAGjV-pW87HGjYiDTTHur_Fv5nwezu-L/view" },
  { "name": "5-31.MOV", "url": "https://drive.google.com/file/d/1CxWS3uTpgisFewwEC6yljCQqGqV_M_eR/view" },
  { "name": "5-32.MOV", "url": "https://drive.google.com/file/d/1EYRFdAXv2gkmwT1Z_RC6-PIKYjtIADHc/view" },
  { "name": "5-33.MOV", "url": "https://drive.google.com/file/d/1lt3Ot4czJuqTU5szr-zDfeuEJ5NUkbGi/view" },
  { "name": "6-1.MOV", "url": "https://drive.google.com/file/d/12Wyev9nkfDhX6cCSk_rI2H58F2g86WAh/view" },
  { "name": "6-2.MOV", "url": "https://drive.google.com/file/d/1vfPoVZc2WkGieglQUwNdGLOirnN4NWiw/view" },
  { "name": "6-3.MOV", "url": "https://drive.google.com/file/d/1epvBOtpVjcJALk5YJJBBRTBWX49Kgkk9/view" },
  { "name": "6-4.MOV", "url": "https://drive.google.com/file/d/1mZN9Gfgz76u16VF-nvNCv_HCj1vf_GaV/view" },
  { "name": "6-5.MOV", "url": "https://drive.google.com/file/d/1ldqd5R-HGx1kyumcotWbQ-U3dFvsStQC/view" },
  { "name": "6-6.MOV", "url": "https://drive.google.com/file/d/1srDnnFS2pZsNIQlE80F2nrf6fIHMFnON/view" },
  { "name": "6-7.MOV", "url": "https://drive.google.com/file/d/198bafngw65ZeyfewM6aWwRvOm4tm2Zzi/view" }
];

// ЧАСТЬ 2: 6, 7, 8, 9 классы + бонусы
const PART2 = [
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

async function importAll() {
  console.log('🚀 Начинаем полный импорт всех уроков в Neon DB...\n');

  // Объединяем и дедуплицируем
  const allRaw = [...PART1, ...PART2];
  const seenUrls = new Set();
  const allUnique = [];

  for (const v of allRaw) {
    if (!v.url || v.url.includes('_gd') || seenUrls.has(v.url)) continue;
    seenUrls.add(v.url);
    allUnique.push(v);
  }

  console.log(`📊 Всего уникальных видеоуроков: ${allUnique.length}\n`);

  // Удаляем все старые видео, чтобы импортировать полный чистый набор
  await pool.query("DELETE FROM videos");
  console.log('🧹 Очищены все старые видео');

  // Получаем существующие классы
  const classesRes = await pool.query('SELECT id, name FROM classes');
  const classMap = {};
  classesRes.rows.forEach(c => {
    classMap[c.name] = c.id;
  });

  let countByClass = {};

  for (const item of allUnique) {
    const rawName = item.name.replace('.MOV', '').replace('.mp4', '').trim();
    let gradeNumber = null;
    let lessonNumber = null;

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
        countByClass[className] = (countByClass[className] || 0) + 1;
      }
    } else {
      // Бонусы
      const classId = classMap['9-класс (Англис тили)'];
      if (classId) {
        await pool.query(
          `INSERT INTO videos (class_id, title, description, url, order_index)
           VALUES ($1, $2, $3, $4, $5)`,
          [classId, rawName, 'Кошумча / Бонус сабак', item.url, 999]
        );
        countByClass['9-класс (Англис тили)'] = (countByClass['9-класс (Англис тили)'] || 0) + 1;
      }
    }
  }

  console.log('\n📚 Результаты импорта по классам:');
  for (const [cls, count] of Object.entries(countByClass)) {
    console.log(`  ✅ ${cls}: ${count} видеоуроков`);
  }

  console.log(`\n🎉 ВСЕ ${allUnique.length} ВИДЕОУРОКОВ УСПЕШНО ЗАГРУЖЕНЫ В NEON DB!`);
}

importAll()
  .catch(err => console.error('Error:', err))
  .finally(() => pool.end());
