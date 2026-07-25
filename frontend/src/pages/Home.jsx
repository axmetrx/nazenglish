import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentsAPI } from '../api/api';
import Navbar from '../components/Navbar';

export default function Home() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('student_token')) {
      navigate('/student');
    }
  }, [navigate]);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setError('Введите имя и код класса');
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
      setError(err.response?.data?.message || 'Ошибка входа. Проверьте код класса.');
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
              <i className="ph ph-graduation-cap"></i> Онлайн обучение
            </div>
            <h1>
              Учи английский<br />
              <span className="gradient-text">с лучшим учителем</span>
            </h1>
            <p className="home-sub">
              Вводи код класса, который дал тебе учитель, и получай мгновенный доступ к видеоурокам.
            </p>

            <div className="home-features">
              {[
                { icon: <i className="ph ph-video"></i>, text: 'Видеоуроки в удобное время' },
                { icon: <i className="ph ph-device-mobile"></i>, text: 'Работает на любом устройстве' },
                { icon: <i className="ph ph-lightning"></i>, text: 'Быстрый доступ по коду' },
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
              <h2>Войти в класс</h2>
              <p>Введите своё имя и код, который дал вам учитель</p>
            </div>

            <form onSubmit={handleJoin} className="modal-form">
              <div className="form-group">
                <label className="form-label">Ваше имя</label>
                <input
                  id="student-name"
                  className="form-input"
                  type="text"
                  placeholder="Например: Айгерим Сейткали"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Код класса</label>
                <input
                  id="class-code"
                  className="form-input code-input"
                  type="text"
                  placeholder="ABC123"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  autoComplete="off"
                />
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <button
                id="join-btn"
                type="submit"
                className="btn btn-primary btn-lg btn-full"
                disabled={loading}
              >
                {loading ? (
                  <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Вхожу...</>
                ) : (
                  <><i className="ph ph-rocket"></i> Войти в класс</>
                )}
              </button>
            </form>
          </div>
        </div>

        <style>{`
          .home-wrapper {
            display: grid;
            grid-template-columns: 1fr 420px;
            gap: 60px;
            align-items: center;
            max-width: 1000px;
            width: 100%;
            padding: 24px;
          }
          .home-hero { display: flex; flex-direction: column; gap: 24px; }
          .home-badge { align-self: flex-start; font-size: 0.85rem; }
          .home-sub { font-size: 1.1rem; color: var(--text-secondary); max-width: 440px; line-height: 1.7; }
          .home-features { display: flex; flex-direction: column; gap: 12px; }
          .home-feature {
            display: flex; align-items: center; gap: 12px;
            color: var(--text-secondary); font-size: 0.95rem;
          }
          .home-feature span:first-child { font-size: 1.2rem; }
          .home-card { padding: 36px; }
          .home-card-header { margin-bottom: 28px; }
          .home-card-header h2 { margin-bottom: 8px; }
          @media (max-width: 900px) {
            .home-wrapper { grid-template-columns: 1fr; gap: 32px; }
            .home-hero { text-align: center; align-items: center; }
          }
        `}</style>
      </div>
    </>
  );
}
