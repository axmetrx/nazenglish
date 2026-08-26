import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentsAPI } from '../api/api';
import Navbar from '../components/Navbar';
import { t } from '../utils/translations';

export default function Home() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setLangTick] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('student_token')) {
      navigate('/student');
    }
  }, [navigate]);

  useEffect(() => {
    const handleLangChange = () => setLangTick(n => n + 1);
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setError('Атыңызды жана кодду киргизиңиз');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await studentsAPI.join({ name: name.trim(), code: code.trim() });
      const { token, student, class: cls } = res.data;
      localStorage.setItem('student_token', token);
      localStorage.setItem('student_data', JSON.stringify({ ...student, className: cls.name }));
      navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Кирүү катасы. Кодду текшериңиз.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: '🎬', text: 'Видео сабактар жана кызыктуу оюндар' },
    { icon: '📱', text: 'Телефондо жана компьютерде иштейт' },
    { icon: '⚡', text: 'Код аркылуу бат кирүү жана упай топтоо' },
  ];

  return (
    <>
      <Navbar role="guest" />

      <div className="home-page">
        {/* ── Hero Section ── */}
        <div className="home-hero-section">
          <div className="home-badge-row">
            <div className="home-badge-pill">
              <span className="home-badge-pulse"></span>
              🎓 Англис тили
            </div>
            <div className="home-badge-pill home-badge-light">
              🇬🇧 3–9 класстар
            </div>
          </div>

          <h1 className="home-title">
            Англис тилин оңой<br />
            жана кызыктуу <span className="gradient-text">үйрөнүңүз!</span>
          </h1>

          <p className="home-subtitle">
            Мугалим берген класс кодун киргизип, 238 видео сабакка жана интерактивдүү оюндарга дароо кириңиз.
          </p>

          {/* Quick Highlight Cards */}
          <div className="home-highlights-row">
            <div className="home-highlight-chip">
              <span className="hh-icon">🎬</span>
              <span><strong>238</strong> видео</span>
            </div>
            <div className="home-highlight-chip">
              <span className="hh-icon">🎮</span>
              <span><strong>15</strong> оюн</span>
            </div>
            <div className="home-highlight-chip">
              <span className="hh-icon">🏆</span>
              <span><strong>XP</strong> рейтинг</span>
            </div>
          </div>

          <div className="home-features-list">
            {features.map((f, i) => (
              <div key={i} className="home-feature-item">
                <span className="home-feature-icon">{f.icon}</span>
                <span className="home-feature-text">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Login Card ── */}
        <div className="home-login-card">
          <div className="home-login-header">
            <h2>{t('joinClass')}</h2>
            <p>Класс кодун жана атыңызды жазыңыз</p>
          </div>

          <form onSubmit={handleJoin}>
            <div className="hf-group">
              <label className="hf-label">{t('enterName')}</label>
              <input
                id="student-name"
                className="hf-input"
                type="text"
                placeholder="Мисалы: Айгүл Бакыт кызы"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="hf-group">
              <label className="hf-label">Класс кодун киргизиңиз</label>
              <input
                id="class-code"
                className="hf-input hf-code"
                type="text"
                placeholder="ABC123"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={10}
                autoComplete="off"
              />
            </div>

            {error && (
              <div className="hf-error">
                ⚠️ {error}
              </div>
            )}

            <button
              id="join-btn"
              type="submit"
              className="hf-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="hf-loading">
                  <span className="hf-spinner" /> Кирүүдө...
                </span>
              ) : (
                <>→ {t('joinClass')}</>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        /* ── Page wrapper ── */
        .home-page {
          min-height: 100vh;
          padding: 82px 16px 36px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          max-width: 480px;
          margin: 0 auto;
          width: 100%;
        }

        /* ── Hero ── */
        .home-hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
          padding-top: 8px;
        }

        .home-badge-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .home-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          background: var(--tiffany-xlight);
          color: var(--tiffany-dark);
          border: 1px solid var(--border);
          border-radius: 100px;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .home-badge-light {
          background: rgba(10, 186, 181, 0.08);
          border-color: rgba(10, 186, 181, 0.2);
        }

        .home-badge-pulse {
          width: 8px;
          height: 8px;
          background: #059669;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 1.8s infinite;
        }

        .home-title {
          font-size: clamp(1.75rem, 6.5vw, 2.5rem);
          font-weight: 800;
          line-height: 1.2;
          color: var(--text-primary);
          letter-spacing: -0.03em;
          margin: 0;
        }

        .home-subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 360px;
          margin: 0 auto;
        }

        /* ── Highlights Row ── */
        .home-highlights-row {
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
          margin: 4px 0;
          flex-wrap: wrap;
        }

        .home-highlight-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: #ffffff;
          border: 1.5px solid var(--border);
          border-radius: 100px;
          font-size: 0.84rem;
          color: var(--text-primary);
          box-shadow: var(--shadow-sm);
        }

        .hh-icon {
          font-size: 1rem;
        }

        /* ── Features list ── */
        .home-features-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          max-width: 380px;
        }

        .home-feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 14px;
          text-align: left;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s;
        }

        .home-feature-item:hover {
          transform: translateY(-2px);
          border-color: var(--tiffany);
        }

        .home-feature-icon {
          font-size: 1.35rem;
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--tiffany-xlight);
          border-radius: 10px;
        }

        .home-feature-text {
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--text-primary);
          line-height: 1.4;
        }

        /* ── Login card ── */
        .home-login-card {
          background: #ffffff;
          border: 1.5px solid var(--border);
          border-radius: 24px;
          padding: 28px 24px 32px;
          box-shadow: 0 12px 40px rgba(10, 186, 181, 0.15);
        }

        .home-login-header {
          margin-bottom: 20px;
          text-align: left;
        }

        .home-login-header h2 {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--tiffany-dark);
          margin: 0 0 4px;
        }

        .home-login-header p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 0;
        }

        /* ── Form fields ── */
        .hf-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .hf-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.01em;
          text-align: left;
        }

        .hf-input {
          width: 100%;
          padding: 13px 16px;
          background: var(--bg-primary);
          border: 1.5px solid var(--border);
          border-radius: 14px;
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.95rem;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          -webkit-appearance: none;
        }

        .hf-input::placeholder {
          color: var(--text-muted);
        }

        .hf-input:focus {
          outline: none;
          border-color: var(--tiffany);
          box-shadow: 0 0 0 3px rgba(10, 186, 181, 0.15);
          background: #fff;
        }

        .hf-code {
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-align: center;
          text-transform: uppercase;
          background: var(--tiffany-xlight);
          border-color: var(--border);
          color: var(--tiffany-dark);
        }

        /* ── Error ── */
        .hf-error {
          background: var(--danger-light);
          color: var(--danger);
          border: 1px solid #fca5a5;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 14px;
        }

        /* ── Submit button ── */
        .hf-submit {
          width: 100%;
          padding: 15px 20px;
          background: linear-gradient(135deg, var(--tiffany), var(--tiffany-dark));
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(10, 186, 181, 0.35);
          letter-spacing: 0.01em;
        }

        .hf-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(10, 186, 181, 0.45);
        }

        .hf-submit:active {
          transform: scale(0.98);
        }

        .hf-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .hf-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .hf-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        /* ── Desktop layout ── */
        @media (min-width: 800px) {
          .home-page {
            max-width: 1050px;
            padding: 110px 32px 60px;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 64px;
          }

          .home-hero-section {
            flex: 1.1;
            align-items: flex-start;
            text-align: left;
          }

          .home-badge-row {
            justify-content: flex-start;
          }

          .home-subtitle {
            margin: 0;
            max-width: 440px;
          }

          .home-highlights-row {
            justify-content: flex-start;
          }

          .home-features-list {
            max-width: 100%;
          }

          .home-login-card {
            flex: 0 0 390px;
            padding: 36px 32px;
          }

          .hf-submit {
            padding: 15px 20px;
          }
        }
      `}</style>
    </>
  );
}
