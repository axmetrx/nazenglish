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
    const handleLangChange = () => setLangTick((n) => n + 1);
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

      <div className="home-page-container">
        {/* Decorative ambient background glows */}
        <div className="home-ambient-glow glow-1"></div>
        <div className="home-ambient-glow glow-2"></div>
        <div className="home-ambient-glow glow-3"></div>

        <div className="home-page">
          {/* ── Left Column: Hero Section ── */}
          <div className="home-hero-section">
            {/* Teacher Intro Banner */}
            <div className="home-teacher-card slide-up">
              <div className="ht-avatar-wrap">
                <img src="/teacher.jpg" alt="Мугалим Nazenglish" className="ht-avatar-img" />
                <span className="ht-badge" title="Verified Teacher">
                  <i className="ph-fill ph-seal-check"></i>
                </span>
              </div>
              <div className="ht-info">
                <div className="ht-role">
                  <span className="ht-role-dot"></span>
                  {t('teacher')}
                </div>
                <div className="ht-name">{t('teacherName')}</div>
                <div className="ht-tag">{t('teacherCourseTag')}</div>
              </div>
            </div>

            <div className="home-badge-row">
              <div className="home-badge-pill home-badge-primary">
                <span className="home-badge-pulse"></span>
                {t('englishCourse')}
              </div>
              <div className="home-badge-pill home-badge-secondary">
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
                <span className="hh-icon hh-icon-video">
                  <i className="ph-fill ph-video-camera"></i>
                </span>
                <span className="hh-text"><strong>238</strong> {t('lessonsCountChip')}</span>
              </div>
              <div className="home-highlight-chip">
                <span className="hh-icon hh-icon-game">
                  <i className="ph-fill ph-game-controller"></i>
                </span>
                <span className="hh-text"><strong>15</strong> {t('gamesCountChip')}</span>
              </div>
              <div className="home-highlight-chip">
                <span className="hh-icon hh-icon-xp">
                  <i className="ph-fill ph-trophy"></i>
                </span>
                <span className="hh-text"><strong>XP</strong> {t('ratingChip')}</span>
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

          {/* ── Right Column: Auth Card with Segmented Switcher ── */}
          <div className="home-login-card slide-up">
            {/* Segmented Tab Switcher */}
            <div className="auth-tabs-segmented">
              <button
                type="button"
                className={`auth-tab-btn ${authTab === 'register' ? 'active' : ''}`}
                onClick={() => { setAuthTab('register'); setError(''); }}
              >
                <i className="ph-bold ph-user-plus"></i>
                <span>{t('register')}</span>
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${authTab === 'login' ? 'active' : ''}`}
                onClick={() => { setAuthTab('login'); setError(''); }}
              >
                <i className="ph-bold ph-sign-in"></i>
                <span>{t('login')}</span>
              </button>
            </div>

            {authTab === 'register' ? (
              /* ── Register Form ── */
              <form onSubmit={handleRegister} className="auth-form">
                <div className="home-login-header">
                  <h2>{t('register')}</h2>
                  <p>{t('registerDesc')}</p>
                </div>

                <div className="hf-group">
                  <label className="hf-label">
                    <i className="ph-bold ph-user"></i>
                    {t('enterName')}
                  </label>
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
                  <label className="hf-label">
                    <i className="ph-bold ph-key"></i>
                    {t('enterCode')}
                  </label>
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
                  <label className="hf-label">
                    <i className="ph-bold ph-envelope-simple"></i>
                    Email
                  </label>
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
                  <label className="hf-label">
                    <i className="ph-bold ph-lock-key"></i>
                    {t('password')}
                  </label>
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
                  <div className="hf-error">
                    <i className="ph-fill ph-warning-circle"></i>
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" className="hf-submit" disabled={loading}>
                  {loading ? (
                    <span className="hf-loading">
                      <span className="hf-spinner" /> {t('loggingIn')}
                    </span>
                  ) : (
                    <>
                      <i className="ph-bold ph-sparkle"></i>
                      <span>{t('register')}</span>
                    </>
                  )}
                </button>

                <div className="auth-switch">
                  <span>{t('alreadyHaveAccount')}</span>
                  <button type="button" className="auth-switch-btn" onClick={() => { setAuthTab('login'); setError(''); }}>
                    {t('login')} →
                  </button>
                </div>
              </form>
            ) : (
              /* ── Login Form ── */
              <form onSubmit={handleLogin} className="auth-form">
                <div className="home-login-header">
                  <h2>{t('login')}</h2>
                  <p>{t('loginDesc')}</p>
                </div>

                <div className="hf-group">
                  <label className="hf-label">
                    <i className="ph-bold ph-envelope-simple"></i>
                    Email
                  </label>
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
                  <label className="hf-label">
                    <i className="ph-bold ph-lock-key"></i>
                    {t('password')}
                  </label>
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
                  <div className="hf-error">
                    <i className="ph-fill ph-warning-circle"></i>
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" className="hf-submit" disabled={loading}>
                  {loading ? (
                    <span className="hf-loading">
                      <span className="hf-spinner" /> {t('loggingIn')}
                    </span>
                  ) : (
                    <>
                      <i className="ph-bold ph-sign-in"></i>
                      <span>{t('login')}</span>
                    </>
                  )}
                </button>

                <div className="auth-switch">
                  <span>{t('noAccount')}</span>
                  <button type="button" className="auth-switch-btn" onClick={() => { setAuthTab('register'); setError(''); }}>
                    {t('register')} →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        /* ── Container with modern ambient gradient canvas ── */
        .home-page-container {
          position: relative;
          min-height: 100vh;
          overflow-x: hidden;
          background: #f8fafc;
          background-image: 
            radial-gradient(at 15% 15%, rgba(13, 148, 136, 0.08) 0px, transparent 50%),
            radial-gradient(at 85% 25%, rgba(14, 165, 233, 0.07) 0px, transparent 50%),
            radial-gradient(at 50% 85%, rgba(16, 185, 129, 0.06) 0px, transparent 50%);
        }

        .home-ambient-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          z-index: 0;
        }
        .glow-1 {
          top: 8%;
          left: -6%;
          width: 440px;
          height: 440px;
          background: rgba(20, 184, 166, 0.12);
        }
        .glow-2 {
          bottom: 12%;
          right: -6%;
          width: 480px;
          height: 480px;
          background: rgba(14, 165, 233, 0.09);
        }
        .glow-3 {
          top: 42%;
          left: 45%;
          width: 380px;
          height: 380px;
          background: rgba(16, 185, 129, 0.07);
        }

        /* ── Page Layout ── */
        .home-page {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          padding: 96px 20px 48px;
          display: flex;
          flex-direction: column;
          gap: 36px;
          max-width: 480px;
          margin: 0 auto;
          width: 100%;
        }

        /* ── Hero Section ── */
        .home-hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 18px;
          padding-top: 4px;
        }

        /* ── Teacher Card ── */
        .home-teacher-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 20px;
          padding: 12px 20px 12px 14px;
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(13, 148, 136, 0.05);
          margin-bottom: 4px;
          text-align: left;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .home-teacher-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 34px -5px rgba(13, 148, 136, 0.14);
          border-color: rgba(13, 148, 136, 0.35);
        }

        .ht-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .ht-avatar-img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 2.5px solid #ffffff;
          box-shadow: 0 0 0 2px #0d9488, 0 4px 12px rgba(13, 148, 136, 0.25);
          display: block;
        }

        .ht-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          background: #ffffff;
          color: #0284c7;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
        }

        .ht-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .ht-role {
          font-size: 0.72rem;
          font-weight: 700;
          color: #0d9488;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ht-role-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          display: inline-block;
        }

        .ht-name {
          font-size: 1.18rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
        }

        .ht-tag {
          font-size: 0.82rem;
          color: #64748b;
          font-weight: 500;
        }

        /* ── Badge Row ── */
        .home-badge-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .home-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 0.84rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          transition: transform 0.2s;
        }

        .home-badge-primary {
          background: rgba(13, 148, 136, 0.08);
          color: #0f766e;
          border: 1px solid rgba(13, 148, 136, 0.2);
        }

        .home-badge-secondary {
          background: #ffffff;
          color: #475569;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .home-badge-pulse {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          animation: badgePulse 2s infinite;
        }

        @keyframes badgePulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        /* ── Title & Subtitle ── */
        .home-title {
          font-size: clamp(2rem, 5.5vw, 2.75rem);
          font-weight: 900;
          line-height: 1.18;
          color: #0f172a;
          letter-spacing: -0.035em;
          margin: 4px 0 0;
        }

        .home-subtitle {
          font-size: 1rem;
          color: #64748b;
          line-height: 1.65;
          max-width: 440px;
          margin: 0 auto;
          font-weight: 400;
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
          gap: 8px;
          padding: 8px 16px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 100px;
          font-size: 0.86rem;
          color: #334155;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          transition: all 0.2s ease;
        }

        .home-highlight-chip:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border-color: #cbd5e1;
        }

        .hh-icon {
          font-size: 1.1rem;
          display: inline-flex;
        }
        .hh-icon-video { color: #0d9488; }
        .hh-icon-game { color: #8b5cf6; }
        .hh-icon-xp { color: #f59e0b; }

        /* ── Features list ── */
        .home-features-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          max-width: 420px;
        }

        .home-feature-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 18px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          text-align: left;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
          transition: all 0.25s ease;
        }

        .home-feature-item:hover {
          transform: translateY(-2px);
          border-color: #0d9488;
          box-shadow: 0 8px 20px -4px rgba(13, 148, 136, 0.12);
        }

        .home-feature-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(13, 148, 136, 0.1), rgba(16, 185, 129, 0.12));
          border-radius: 12px;
        }

        .home-feature-text {
          font-size: 0.92rem;
          font-weight: 500;
          color: #1e293b;
          line-height: 1.4;
        }

        /* ── Auth Card ── */
        .home-login-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 28px;
          padding: 28px 24px;
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.02);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        /* Segmented Tab Switcher */
        .auth-tabs-segmented {
          display: flex;
          background: #f1f5f9;
          padding: 5px;
          border-radius: 14px;
          margin-bottom: 22px;
          gap: 4px;
        }

        .auth-tab-btn {
          flex: 1;
          padding: 10px 14px;
          border: none;
          border-radius: 10px;
          font-size: 0.92rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          color: #64748b;
          background: transparent;
        }

        .auth-tab-btn.active {
          background: #ffffff;
          color: #0f172a;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
        }

        .auth-tab-btn:hover:not(.active) {
          color: #1e293b;
        }

        .home-login-header {
          margin-bottom: 20px;
          text-align: left;
        }

        .home-login-header h2 {
          font-size: 1.45rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0 0 4px;
        }

        .home-login-header p {
          font-size: 0.88rem;
          color: #64748b;
          margin: 0;
        }

        /* Form fields */
        .hf-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
          text-align: left;
        }

        .hf-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
          letter-spacing: 0.01em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .hf-label i {
          color: #0d9488;
          font-size: 1.05em;
        }

        .hf-input {
          width: 100%;
          padding: 13px 16px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          color: #0f172a;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s ease;
          -webkit-appearance: none;
        }

        .hf-input::placeholder {
          color: #94a3b8;
        }

        .hf-input:focus {
          outline: none;
          background: #ffffff;
          border-color: #0d9488;
          box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.12);
        }

        .hf-input.hf-code {
          background: linear-gradient(135deg, rgba(13, 148, 136, 0.04), rgba(5, 150, 105, 0.05));
          border: 2px dashed #99f6e4;
          color: #0f766e;
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: 0.25em;
          text-align: center;
          text-transform: uppercase;
        }

        .hf-input.hf-code:focus {
          background: #ffffff;
          border: 2px solid #0d9488;
          box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.12);
        }

        /* Error message */
        .hf-error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 11px 14px;
          font-size: 0.86rem;
          font-weight: 500;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          text-align: left;
        }

        /* Submit button */
        .hf-submit {
          width: 100%;
          padding: 15px 20px;
          background: linear-gradient(135deg, #0d9488 0%, #059669 100%);
          color: #ffffff;
          border: none;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 25px -4px rgba(13, 148, 136, 0.45);
          letter-spacing: 0.01em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 4px;
        }

        .hf-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px -4px rgba(13, 148, 136, 0.55);
          filter: brightness(1.04);
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
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        .auth-switch {
          text-align: center;
          font-size: 0.88rem;
          color: #64748b;
          margin-top: 20px;
          padding-top: 18px;
          border-top: 1px solid #f1f5f9;
        }

        .auth-switch-btn {
          background: none;
          border: none;
          color: #0d9488;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.88rem;
          margin-left: 6px;
          transition: all 0.15s;
        }

        .auth-switch-btn:hover {
          color: #047857;
          text-decoration: underline;
        }

        /* ── Desktop 2-column layout ── */
        @media (min-width: 900px) {
          .home-page {
            max-width: 1120px;
            padding: 120px 32px 70px;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 64px;
          }

          .home-hero-section {
            flex: 1.15;
            align-items: flex-start;
            text-align: left;
          }

          .home-badge-row {
            justify-content: flex-start;
          }

          .home-subtitle {
            margin: 0;
            max-width: 480px;
          }

          .home-highlights-row {
            justify-content: flex-start;
          }

          .home-features-list {
            max-width: 100%;
          }

          .home-login-card {
            flex: 0 0 420px;
            max-width: 420px;
            padding: 36px 32px;
          }
        }
      `}</style>
    </>
  );
}
