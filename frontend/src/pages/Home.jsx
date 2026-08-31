import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentsAPI } from '../api/api';
import Navbar from '../components/Navbar';
import { t } from '../utils/translations';

export default function Home() {
  const [authTab, setAuthTab] = useState('register'); // 'register' | 'login'
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  // Регистрация — имя + код класса + email + пароль
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !email.trim() || !password.trim()) {
      setError(t('fillAllFields'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await studentsAPI.join({
        name: name.trim(),
        code: code.trim(),
        email: email.trim(),
        password: password,
      });
      const { token, student, class: cls } = res.data;
      localStorage.setItem('student_token', token);
      localStorage.setItem('student_data', JSON.stringify({ ...student, className: cls.name }));
      navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || t('loginError'));
    } finally {
      setLoading(false);
    }
  };

  // Вход — email + пароль
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError(t('fillAllFields'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await studentsAPI.login({
        email: email.trim(),
        password: password,
      });
      const { token, student, class: cls } = res.data;
      localStorage.setItem('student_token', token);
      localStorage.setItem('student_data', JSON.stringify({ ...student, className: cls?.name || '' }));
      navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || t('loginError'));
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: '🎬', text: t('feature1') },
    { icon: '📱', text: t('feature2') },
    { icon: '⚡', text: t('feature3') },
  ];

  return (
    <>
      <Navbar role="guest" />

      <div className="home-page">
        {/* ── Hero Section ── */}
        <div className="home-hero-section">
          {/* Teacher Intro Banner */}
          <div className="home-teacher-card slide-up">
            <div className="ht-avatar-wrap">
              <img src="/teacher.jpg" alt="Мугалим Nazenglish" className="ht-avatar-img" />
              <span className="ht-badge">🌟</span>
            </div>
            <div className="ht-info">
              <div className="ht-role">{t('teacher')}</div>
              <div className="ht-name">{t('teacherName')}</div>
              <div className="ht-tag">{t('teacherCourseTag')}</div>
            </div>
          </div>

          <div className="home-badge-row">
            <div className="home-badge-pill">
              <span className="home-badge-pulse"></span>
              {t('englishCourse')}
            </div>
            <div className="home-badge-pill home-badge-light">
              {t('grades39')}
            </div>
          </div>

          <h1 className="home-title">
            {t('homeHeroTitle')}
          </h1>

          <p className="home-subtitle">
            {t('homeHeroSubtitle')}
          </p>

          {/* Quick Highlight Cards */}
          <div className="home-highlights-row">
            <div className="home-highlight-chip">
              <span className="hh-icon">🎬</span>
              <span><strong>238</strong> {t('lessonsCountChip')}</span>
            </div>
            <div className="home-highlight-chip">
              <span className="hh-icon">🎮</span>
              <span><strong>15</strong> {t('gamesCountChip')}</span>
            </div>
            <div className="home-highlight-chip">
              <span className="hh-icon">🏆</span>
              <span><strong>XP</strong> {t('ratingChip')}</span>
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

        {/* ── Auth Card with Tabs ── */}
        <div className="home-login-card slide-up">
          {/* Tab Switcher */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${authTab === 'register' ? 'active' : ''}`}
              onClick={() => { setAuthTab('register'); setError(''); }}
            >
              📝 {t('register')}
            </button>
            <button
              className={`auth-tab ${authTab === 'login' ? 'active' : ''}`}
              onClick={() => { setAuthTab('login'); setError(''); }}
            >
              🔑 {t('login')}
            </button>
          </div>

          {authTab === 'register' ? (
            /* ── Register Form ── */
            <form onSubmit={handleRegister}>
              <div className="home-login-header">
                <h2>{t('register')}</h2>
                <p>{t('registerDesc')}</p>
              </div>

              <div className="hf-group">
                <label className="hf-label">{t('enterName')}</label>
                <input
                  className="hf-input"
                  type="text"
                  placeholder={t('namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>

              <div className="hf-group">
                <label className="hf-label">{t('enterCode')}</label>
                <input
                  className="hf-input hf-code"
                  type="text"
                  placeholder={t('codePlaceholder')}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  maxLength={10}
                  autoComplete="off"
                />
              </div>

              <div className="hf-group">
                <label className="hf-label">📧 Email</label>
                <input
                  className="hf-input"
                  type="email"
                  placeholder="student@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="hf-group">
                <label className="hf-label">🔒 {t('password')}</label>
                <input
                  className="hf-input"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <div className="hf-error">⚠️ {error}</div>
              )}

              <button type="submit" className="hf-submit" disabled={loading}>
                {loading ? (
                  <span className="hf-loading">
                    <span className="hf-spinner" /> {t('loggingIn')}
                  </span>
                ) : (
                  <>📝 {t('register')}</>
                )}
              </button>

              <div className="auth-switch">
                {t('alreadyHaveAccount')}{' '}
                <button type="button" className="auth-switch-btn" onClick={() => { setAuthTab('login'); setError(''); }}>
                  {t('login')} →
                </button>
              </div>
            </form>
          ) : (
            /* ── Login Form ── */
            <form onSubmit={handleLogin}>
              <div className="home-login-header">
                <h2>{t('login')}</h2>
                <p>{t('loginDesc')}</p>
              </div>

              <div className="hf-group">
                <label className="hf-label">📧 Email</label>
                <input
                  className="hf-input"
                  type="email"
                  placeholder="student@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="hf-group">
                <label className="hf-label">🔒 {t('password')}</label>
                <input
                  className="hf-input"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="hf-error">⚠️ {error}</div>
              )}

              <button type="submit" className="hf-submit" disabled={loading}>
                {loading ? (
                  <span className="hf-loading">
                    <span className="hf-spinner" /> {t('loggingIn')}
                  </span>
                ) : (
                  <>🔑 {t('login')}</>
                )}
              </button>

              <div className="auth-switch">
                {t('noAccount')}{' '}
                <button type="button" className="auth-switch-btn" onClick={() => { setAuthTab('register'); setError(''); }}>
                  {t('register')} →
                </button>
              </div>
            </form>
          )}
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
          padding-top: 4px;
        }

        /* ── Teacher Card ── */
        .home-teacher-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #ffffff;
          border: 1.5px solid var(--border);
          border-radius: 20px;
          padding: 12px 20px 12px 14px;
          box-shadow: 0 8px 24px rgba(10, 186, 181, 0.14);
          margin-bottom: 4px;
          text-align: left;
        }

        .ht-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .ht-avatar-img {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
          border: 2.5px solid var(--tiffany);
          box-shadow: 0 4px 12px rgba(10, 186, 181, 0.25);
          display: block;
        }

        .ht-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          font-size: 0.9rem;
          background: #ffffff;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .ht-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .ht-role {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .ht-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--tiffany-dark);
          line-height: 1.2;
        }

        .ht-tag {
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        /* ── Badge Row ── */
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
          max-width: 380px;
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
          padding: 0;
          box-shadow: 0 12px 40px rgba(10, 186, 181, 0.15);
          overflow: hidden;
        }

        .home-login-card form {
          padding: 0 24px 28px;
        }

        /* ── Auth Tabs ── */
        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1.5px solid var(--border);
        }

        .auth-tab {
          padding: 14px 10px;
          font-size: 0.95rem;
          font-weight: 700;
          font-family: inherit;
          background: #f8fafc;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .auth-tab.active {
          background: #fff;
          color: var(--tiffany-dark);
          box-shadow: inset 0 -3px 0 var(--tiffany);
        }

        .auth-tab:hover:not(.active) {
          background: #f1f5f9;
        }

        .auth-switch {
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }

        .auth-switch-btn {
          background: none;
          border: none;
          color: var(--tiffany-dark);
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.85rem;
          text-decoration: underline;
        }

        .home-login-header {
          margin-bottom: 20px;
          padding-top: 24px;
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

          .home-teacher-card {
            margin-bottom: 8px;
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
