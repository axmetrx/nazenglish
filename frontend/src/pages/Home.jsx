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
      setError('Атыңызды жана кодду киргизиңиз / Введите имя и код класса');
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
      setError(err.response?.data?.message || 'Ошибка входа / Кирүү катасы. Кодду текшериңиз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar role="guest" />
      <div className="page-center">
        <div className="home-wrapper fade-in">
          {/* Hero left */}
          <div className="home-hero">
            <div className="home-badge badge badge-purple">
              <i className="ph ph-graduation-cap"></i> Англис тили / Английский язык
            </div>
            <h1>
              Англис тилин үйрөнүңүз<br />
              <span className="gradient-text">Nazenglish менен</span>
            </h1>
            <p className="home-sub">
              Мугалим берген кодду киргизип, видео сабакдарга жана оюндарга дароо кириңиз.
            </p>

            <div className="home-features">
              {[
                { icon: <i className="ph ph-video"></i>, text: 'Видео сабактар жана интерактивдүү оюндар' },
                { icon: <i className="ph ph-device-mobile"></i>, text: 'Телефондо жана компьютерде иштейт' },
                { icon: <i className="ph ph-lightning"></i>, text: 'Код аркылуу тез кирүү' },
              ].map((f, i) => (
                <div key={i} className="home-feature">
                  <span>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Login card right */}
          <div className="home-card card slide-up">
            <div className="home-card-header">
              <h2>{t('joinClass')}</h2>
              <p>{t('enterCode')} жана {t('enterName')}</p>
            </div>

            <form onSubmit={handleJoin} className="modal-form">
              <div className="form-group">
                <label className="form-label">{t('enterName')}</label>
                <input
                  id="student-name"
                  className="form-input"
                  type="text"
                  placeholder="Мисалы: Айгүл Бакыт кызы"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('enterCode')}</label>
                <input
                  id="class-code"
                  className="form-input code-input"
                  type="text"
                  placeholder="ABC123"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  maxLength={10}
                  autoComplete="off"
                />
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <button
                id="join-btn"
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                disabled={loading}
              >
                {loading ? 'Кирүүдө...' : <><i className="ph ph-sign-in"></i> {t('joinClass')}</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
