import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLang, setLang, t } from '../utils/translations';

export default function Navbar({ role = 'guest' }) {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState(getLang());

  useEffect(() => {
    const handleLangChange = () => setCurrentLang(getLang());
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const toggleLanguage = () => {
    const nextLang = currentLang === 'kg' ? 'ru' : 'kg';
    setLang(nextLang);
  };

  const teacherName = (() => {
    try {
      const tData = localStorage.getItem('teacher_data');
      return tData ? JSON.parse(tData).name : null;
    } catch { return null; }
  })();

  const studentName = (() => {
    try {
      const s = localStorage.getItem('student_data');
      return s ? JSON.parse(s).name : null;
    } catch { return null; }
  })();

  const handleLogout = () => {
    if (role === 'teacher') {
      localStorage.removeItem('teacher_token');
      localStorage.removeItem('teacher_data');
      navigate('/admin/login');
    } else {
      localStorage.removeItem('student_token');
      localStorage.removeItem('student_data');
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <i className="ph ph-graduation-cap"></i> Nazenglish
      </Link>

      <div className="navbar-actions">
        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="btn btn-secondary btn-sm"
          style={{
            background: 'rgba(255,255,255,0.25)',
            color: '#fff',
            borderColor: 'rgba(255,255,255,0.4)',
            fontWeight: 700,
            fontSize: '0.85rem',
            padding: '4px 10px',
            borderRadius: '100px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title="Тилди алмаштыруу / Сменить язык"
        >
          {currentLang === 'kg' ? '🇰🇬 Кыр' : '🇷🇺 Рус'}
        </button>

        {role === 'teacher' && teacherName && (
          <>
            <span className="navbar-user"><i className="ph ph-chalkboard-teacher"></i> {teacherName}</span>
            <Link to="/admin/dashboard" className="btn btn-ghost btn-sm" style={{ color: '#fff' }}>{t('classes')}</Link>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>{t('logout')}</button>
          </>
        )}
        {role === 'student' && studentName && (
          <>
            <span className="navbar-user"><i className="ph ph-student"></i> {studentName}</span>
          </>
        )}
        {role === 'guest' && (
          <Link to="/admin/login" className="btn btn-secondary btn-sm navbar-teacher-btn">
            <i className="ph ph-chalkboard-teacher"></i>
            <span className="navbar-teacher-label">{t('loginAsTeacher')}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

