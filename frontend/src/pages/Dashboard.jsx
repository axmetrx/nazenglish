import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { classesAPI } from '../api/api';
import ClassCard from '../components/ClassCard';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState({ classesCount: 0, studentsCount: 0, videosCount: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('teacher_token')) {
      navigate('/admin/login');
      return;
    }
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const [resClasses, resStats] = await Promise.all([
        classesAPI.getAll(),
        classesAPI.getStats()
      ]);
      setClasses(resClasses.data);
      setStats(resStats.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Введите название класса'); return; }
    setCreating(true);
    setError('');
    try {
      const res = await classesAPI.create(form);
      setClasses((prev) => [res.data, ...prev]);
      setShowModal(false);
      setForm({ name: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка создания');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить класс? Все видео и ученики будут удалены.')) return;
    try {
      await classesAPI.delete(id);
      setClasses((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert('Ошибка удаления');
    }
  };

  const teacherName = (() => {
    try { return JSON.parse(localStorage.getItem('teacher_data'))?.name; }
    catch { return ''; }
  })();

  return (
    <>
      <Navbar role="teacher" />
      <div className="page">
        <div className="container">
          {/* Header */}
          <div className="section-header fade-in">
            <div>
              <h1>Мои классы</h1>
              <p style={{ marginTop: 6 }}>
                Добро пожаловать, <strong style={{ color: 'var(--text-primary)' }}>{teacherName}</strong>! 
                Управляйте своими классами и видеоуроками.
              </p>
            </div>
            <button
              id="create-class-btn"
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <i className="ph ph-plus"></i> Создать класс
            </button>
          </div>

          {/* Stats */}
          <div className="stats-row fade-in">
            {[
              { label: 'Всего классов', value: stats.classesCount, icon: <i className="ph ph-books"></i> },
              { label: 'Учеников', value: stats.studentsCount, icon: <i className="ph ph-student"></i> },
              { label: 'Видеоуроков', value: stats.videosCount, icon: <i className="ph ph-video"></i> },
            ].map((s, i) => (
              <div key={i} className="stat-card card">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="divider" />

          {/* Classes */}
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : classes.length === 0 ? (
            <div className="empty-state fade-in">
              <div className="empty-state-icon"><i className="ph ph-mailbox"></i></div>
              <h3>Нет классов</h3>
              <p>Создайте первый класс и поделитесь кодом с учениками</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: 16 }}
                onClick={() => setShowModal(true)}
              >
                <i className="ph ph-plus"></i> Создать первый класс
              </button>
            </div>
          ) : (
            <div className="grid-2">
              {classes.map((cls) => (
                <ClassCard key={cls.id} cls={cls} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Class Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title"><i className="ph ph-books"></i> Новый класс</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><i className="ph ph-x"></i></button>
            </div>
            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-group">
                <label className="form-label">Название класса *</label>
                <input
                  id="class-name-input"
                  className="form-input"
                  type="text"
                  placeholder="Например: Группа A1 — Вторник"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Описание (необязательно)</label>
                <input
                  id="class-desc-input"
                  className="form-input"
                  type="text"
                  placeholder="Уровень, расписание..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary btn-full" onClick={() => setShowModal(false)}>
                  Отмена
                </button>
                <button id="confirm-create-btn" type="submit" className="btn btn-primary btn-full" disabled={creating}>
                  {creating ? 'Создаю...' : <><i className="ph ph-sparkle"></i> Создать</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 8px;
        }
        .stat-card {
          text-align: center;
          padding: 24px 16px;
        }
        .stat-icon { font-size: 1.8rem; margin-bottom: 8px; }
        .stat-value { font-size: 2rem; font-weight: 800; color: var(--text-primary); }
        .stat-label { font-size: 0.8rem; color: var(--text-muted); margin-top: 4px; }
        @media (max-width: 600px) { .stats-row { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
