import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/api';

export default function AdminLogin() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('teacher_token')) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!code.trim()) { setError('Введите код'); setLoading(false); return; }
      const res = await authAPI.guestLogin({ code: code.trim() });
      const { token, teacher } = res.data;
      localStorage.setItem('teacher_token', token);
      localStorage.setItem('teacher_data', JSON.stringify(teacher));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="login-wrap fade-in">
        {/* Logo */}
        <div className="login-logo">
          <span style={{ fontSize: '3rem', color: 'var(--accent)' }}><i className="ph ph-graduation-cap"></i></span>
          <h1 style={{ fontSize: '1.8rem' }}>
            Naz<span className="gradient-text">english</span>
          </h1>
          <p>Панель управления учителя</p>
        </div>

        {/* Form */}
        <div className="card login-card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            Введите секретный код для доступа к панели управления.
          </p>

          <div className="form-group" style={{ textAlign: 'left', marginBottom: 20 }}>
            <label className="form-label">Секретный код</label>
            <input
              type="password"
              className="form-input"
              placeholder="Введите код"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
            />
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}><i className="ph ph-warning"></i> {error}</div>}

          <button
            id="auth-submit"
            className="btn btn-primary btn-lg btn-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Вхожу...</>
            ) : <><i className="ph ph-chalkboard-teacher"></i> Войти как Учитель</>}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 16 }}>
          <Link to="/"><i className="ph ph-arrow-left"></i> Вернуться на главную страницу</Link>
        </p>
      </div>

      <style>{`
        .login-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          width: 100%;
          max-width: 440px;
        }
        .login-logo { text-align: center; }
        .login-logo p { color: var(--text-muted); margin-top: 4px; }
        .login-card { width: 100%; padding: 32px; }
        .auth-tabs {
          display: flex;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 4px;
          width: 100%;
        }
        .auth-tab {
          flex: 1;
          padding: 10px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 10px;
          transition: all var(--transition);
        }
        .auth-tab.active {
          background: var(--accent);
          color: #fff;
          box-shadow: var(--shadow-sm);
        }
      `}</style>
    </div>
  );
}
