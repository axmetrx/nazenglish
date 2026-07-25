import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ role = 'guest' }) {
  const navigate = useNavigate();

  const teacherName = (() => {
    try {
      const t = localStorage.getItem('teacher_data');
      return t ? JSON.parse(t).name : null;
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
        {role === 'teacher' && teacherName && (
          <>
            <span className="navbar-user"><i className="ph ph-chalkboard-teacher"></i> {teacherName}</span>
            <Link to="/admin/dashboard" className="btn btn-ghost btn-sm">Классы</Link>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Выйти</button>
          </>
        )}
        {role === 'student' && studentName && (
          <>
            <span className="navbar-user"><i className="ph ph-student"></i> {studentName}</span>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Выйти</button>
          </>
        )}
        {role === 'guest' && (
          <Link to="/admin/login" className="btn btn-secondary btn-sm">
            Войти как учитель
          </Link>
        )}
      </div>
    </nav>
  );
}
