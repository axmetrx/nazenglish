import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { classesAPI, videosAPI, studentsAPI, gamesAPI } from '../api/api';
import VideoCard from '../components/VideoCard';
import Navbar from '../components/Navbar';

export default function ClassPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return 'Никогда';
    const date = new Date(dateStr);
    const diffMins = Math.floor((new Date() - date) / 60000);
    if (diffMins < 2) return 'В сети 🟢';
    if (diffMins < 60) return `Был(а) ${diffMins} мин. назад`;
    if (diffMins < 1440) return `Был(а) ${Math.floor(diffMins / 60)} ч. назад`;
    return `Был(а) ${Math.floor(diffMins / 1440)} дн. назад`;
  };

  const [cls, setCls] = useState(null);
  const [videos, setVideos] = useState([]);
  const [students, setStudents] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('videos'); // 'videos' | 'students' | 'games'

  const [showAddVideo, setShowAddVideo] = useState(false);
  const [editVideo, setEditVideo] = useState(null);
  const [videoForm, setVideoForm] = useState({ title: '', description: '', url: '' });
  
  const [showAddGame, setShowAddGame] = useState(false);
  const [gameForm, setGameForm] = useState({ title: '', pairs: [{ word: '', translation: '' }] });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('teacher_token')) { navigate('/admin/login'); return; }
    loadAll();

    const interval = setInterval(() => {
      loadAll(true); // silent reload
    }, 15000);
    return () => clearInterval(interval);
  }, [id]);

  const loadAll = async (silent = false) => {
    try {
      const [clsRes, vidRes, stuRes, gamRes] = await Promise.all([
        classesAPI.getOne(id),
        videosAPI.getByClass(id),
        studentsAPI.getByClass(id),
        gamesAPI.getByClass(id),
      ]);
      setCls(clsRes.data);
      setVideos(vidRes.data);
      setStudents(stuRes.data);
      setGames(gamRes.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin/login');
      else if (err.response?.status === 404) navigate('/admin/dashboard');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const openAddVideo = () => {
    setEditVideo(null);
    setVideoForm({ title: '', description: '', url: '' });
    setError('');
    setShowAddVideo(true);
  };
  const openEditVideo = (video) => {
    setEditVideo(video);
    setVideoForm({ title: video.title, description: video.description, url: video.url });
    setError('');
    setShowAddVideo(true);
  };

  const handleSaveVideo = async (e) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.url) { setError('Введите название и ссылку'); return; }
    setSaving(true);
    setError('');
    try {
      if (editVideo) {
        const res = await videosAPI.update(editVideo.id, videoForm);
        setVideos((v) => v.map((x) => (x.id === editVideo.id ? res.data : x)));
      } else {
        const res = await videosAPI.create(id, videoForm);
        setVideos((v) => [...v, res.data]);
      }
      setShowAddVideo(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Точно удалить видео?')) return;
    try {
      await videosAPI.delete(id);
      loadAll(true);
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Вы уверены, что хотите удалить ученика "${studentName}"?`)) return;
    try {
      await studentsAPI.delete(studentId);
      loadAll(true);
    } catch (err) {
      alert('Ошибка при удалении ученика');
    }
  };

  const handleAddPair = () => {
    setGameForm({ ...gameForm, pairs: [...gameForm.pairs, { word: '', translation: '' }] });
  };

  const handleRemovePair = (index) => {
    setGameForm({ ...gameForm, pairs: gameForm.pairs.filter((_, i) => i !== index) });
  };

  const handlePairChange = (index, field, value) => {
    const newPairs = [...gameForm.pairs];
    newPairs[index][field] = value;
    setGameForm({ ...gameForm, pairs: newPairs });
  };

  const handleSaveGame = async (e) => {
    e.preventDefault();
    if (!gameForm.title.trim() || gameForm.pairs.some(p => !p.word.trim() || !p.translation.trim())) {
      setError('Заполните название и все пары слов');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await gamesAPI.create(id, {
        title: gameForm.title.trim(),
        type: 'match_pairs',
        data: { pairs: gameForm.pairs.map(p => ({ word: p.word.trim(), translation: p.translation.trim() })) }
      });
      setShowAddGame(false);
      loadAll(true);
    } catch (err) {
      setError('Ошибка при сохранении игры');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGame = async (gameId) => {
    if (!window.confirm('Точно удалить игру?')) return;
    try {
      await gamesAPI.delete(gameId);
      loadAll(true);
    } catch (err) {
      alert('Ошибка при удалении игры');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(cls.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <>
      <Navbar role="teacher" />
      <div className="page loading-center"><div className="spinner" /></div>
    </>
  );

  return (
    <>
      <Navbar role="teacher" />
      <div className="page">
        <div className="container">
          {/* Breadcrumb */}
          <div className="breadcrumb fade-in">
            <Link to="/admin/dashboard" className="breadcrumb-link"><i className="ph ph-arrow-left"></i> Все классы</Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>{cls?.name}</span>
          </div>

          {/* Header */}
          <div className="section-header fade-in">
            <div>
              <h1>{cls?.name}</h1>
              {cls?.description && (
                <p style={{ marginTop: 6 }}>{cls.description}</p>
              )}
            </div>
            <div className="cp-code-block card">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <i className="ph ph-clipboard"></i> Код для учеников
              </div>
              <div className="class-code" onClick={copyCode}>
                {cls?.code}
                <span style={{ fontSize: '1.2rem', color: copied ? 'var(--success)' : 'inherit' }}>
                  {copied ? <i className="ph ph-check"></i> : <i className="ph ph-copy"></i>}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                {copied ? 'Скопировано!' : 'Нажмите чтобы скопировать'}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="cp-tabs">
            <button className={`tab ${tab === 'videos' ? 'active' : ''}`} onClick={() => setTab('videos')}>
              <i className="ph ph-video"></i> Видеоуроки <span className="badge badge-blue" style={{ marginLeft: 6, padding: '2px 8px', fontSize: '0.75rem' }}>{videos.length}</span>
            </button>
            <button className={`tab ${tab === 'games' ? 'active' : ''}`} onClick={() => setTab('games')}>
              <i className="ph ph-game-controller"></i> Игры <span className="badge badge-purple" style={{ marginLeft: 6, padding: '2px 8px', fontSize: '0.75rem' }}>{games.length}</span>
            </button>
            <button className={`tab ${tab === 'students' ? 'active' : ''}`} onClick={() => setTab('students')}>
              <i className="ph ph-users"></i> Ученики <span className="badge badge-green" style={{ marginLeft: 6, padding: '2px 8px', fontSize: '0.75rem' }}>{students.length}</span>
            </button>
          </div>

          {/* Videos Tab */}
          {tab === 'videos' && (
            <div className="fade-in">
              <div className="section-header">
                <h2>Видеоуроки класса</h2>
                <button id="add-video-btn" className="btn btn-primary" onClick={openAddVideo}>
                  + Добавить видео
                </button>
              </div>
              {videos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><i className="ph ph-film-strip"></i></div>
                  <h3>Нет видеоуроков</h3>
                  <p>Добавьте первое видео — вставьте ссылку с YouTube или Vimeo</p>
                  <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={openAddVideo}>
                    <i className="ph ph-plus"></i> Добавить видео
                  </button>
                </div>
              ) : (
                <div className="grid-3">
                  {videos.map((v, i) => (
                    <VideoCard
                      key={v.id}
                      video={v}
                      index={i}
                      showActions
                      onEdit={openEditVideo}
                      onDelete={handleDeleteVideo}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Games Tab */}
          {tab === 'games' && (
            <div className="fade-in">
              <div className="section-header">
                <h2>Интерактивные игры</h2>
                <button className="btn btn-primary" onClick={() => { setGameForm({ title: '', pairs: [{ word: '', translation: '' }] }); setShowAddGame(true); }}>
                  <i className="ph ph-plus"></i> Создать игру
                </button>
              </div>
              {games.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><i className="ph ph-game-controller"></i></div>
                  <h3>Нет игр</h3>
                  <p>Создайте игру "Найди пару", чтобы ученики могли зарабатывать баллы!</p>
                </div>
              ) : (
                <div className="grid-3">
                  {games.map(game => (
                    <div key={game.id} className="card slide-up" style={{ padding: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div className="badge badge-purple" style={{ marginBottom: 8 }}>Найди пару</div>
                          <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>{game.title}</h3>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Слов: {game.data.pairs?.length || 0}
                          </p>
                        </div>
                        <button className="btn btn-icon" style={{ color: 'var(--error)' }} onClick={() => handleDeleteGame(game.id)}>
                          <i className="ph ph-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Students Tab */}
          {tab === 'students' && (
            <div className="fade-in">
              <div className="section-header">
                <h2>Список учеников</h2>
                <span className="badge badge-blue">{students.length} чел.</span>
              </div>
              {students.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><i className="ph ph-student"></i></div>
                  <h3>Нет учеников</h3>
                  <p>
                    Поделитесь кодом <strong style={{ color: 'var(--accent)' }}>{cls?.code}</strong> с учениками
                  </p>
                </div>
              ) : (
                <div className="students-list">
                  {students.map((s, i) => (
                    <div key={s.id} className="student-row card">
                      <div className="student-avatar">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="student-name" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {s.name}
                          <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>
                            {getRelativeTime(s.lastActiveAt)}
                          </span>
                        </div>
                        <div className="student-date">
                          Присоединился: {new Date(s.joinedAt).toLocaleDateString('ru-RU', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className="student-progress" style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Прогресс</div>
                        <div className="badge badge-purple" style={{ fontSize: '0.8rem' }}>
                          <i className="ph-fill ph-video"></i> {s.watchedVideos || 0} / {videos.length}
                        </div>
                        <div className="badge badge-orange" style={{ fontSize: '0.8rem', marginLeft: 8 }}>
                          <i className="ph-fill ph-star"></i> {s.points || 0} XP
                        </div>
                      </div>
                      <div className="student-actions" style={{ marginLeft: 16 }}>
                        <button 
                          className="btn btn-icon" 
                          onClick={() => handleDeleteStudent(s.id, s.name)}
                          title="Удалить ученика"
                          style={{ color: 'var(--error)', background: 'rgba(255, 71, 87, 0.1)' }}
                        >
                          <i className="ph ph-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Video Modal */}
      {showAddVideo && (
        <div className="modal-overlay" onClick={() => setShowAddVideo(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editVideo ? <><i className="ph ph-pencil-simple"></i> Редактировать видео</> : <><i className="ph ph-video"></i> Добавить видео</>}
              </h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAddVideo(false)}><i className="ph ph-x"></i></button>
            </div>
            <form onSubmit={handleSaveVideo} className="modal-form">
              <div className="form-group">
                <label className="form-label">Название урока *</label>
                <input
                  id="video-title"
                  className="form-input"
                  type="text"
                  placeholder="Например: Урок 1 — Present Simple"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm((f) => ({ ...f, title: e.target.value }))}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Ссылка на видео (YouTube / Vimeo) *</label>
                <input
                  id="video-url"
                  className="form-input"
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoForm.url}
                  onChange={(e) => setVideoForm((f) => ({ ...f, url: e.target.value }))}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  Поддерживаются ссылки YouTube и Vimeo
                </small>
              </div>
              <div className="form-group">
                <label className="form-label">Описание (необязательно)</label>
                <input
                  id="video-desc"
                  className="form-input"
                  type="text"
                  placeholder="Краткое описание урока..."
                  value={videoForm.description}
                  onChange={(e) => setVideoForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary btn-full" onClick={() => setShowAddVideo(false)}>
                  Отмена
                </button>
                <button id="save-video-btn" type="submit" className="btn btn-primary btn-full" disabled={saving}>
                  {saving ? 'Сохраняю...' : editVideo ? <><i className="ph ph-floppy-disk"></i> Сохранить</> : <><i className="ph ph-plus"></i> Добавить</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Game Modal */}
      {showAddGame && (
        <div className="modal-overlay" onClick={() => setShowAddGame(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <h3>Создать игру "Найди пару"</h3>
              <button className="btn btn-icon" onClick={() => setShowAddGame(false)}><i className="ph ph-x"></i></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSaveGame} className="modal-form">
                <div className="form-group">
                  <label className="form-label">Название игры</label>
                  <input
                    className="form-input"
                    value={gameForm.title}
                    onChange={(e) => setGameForm({ ...gameForm, title: e.target.value })}
                    placeholder="Например: Фрукты и Овощи"
                  />
                </div>
                
                <div className="form-label" style={{ marginBottom: 12 }}>Пары слов (Английский - Русский)</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                  {gameForm.pairs.map((pair, index) => (
                    <div key={index} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <input
                        className="form-input"
                        placeholder="Apple"
                        value={pair.word}
                        onChange={(e) => handlePairChange(index, 'word', e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <input
                        className="form-input"
                        placeholder="Яблоко"
                        value={pair.translation}
                        onChange={(e) => handlePairChange(index, 'translation', e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <button type="button" className="btn btn-icon" style={{ color: 'var(--error)' }} onClick={() => handleRemovePair(index)} disabled={gameForm.pairs.length === 1}>
                        <i className="ph ph-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
                
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddPair} style={{ marginBottom: 24, width: 'fit-content' }}>
                  <i className="ph ph-plus"></i> Добавить пару
                </button>

                {error && <div className="alert alert-error">{error}</div>}

                <div className="modal-actions" style={{ marginTop: 'auto' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddGame(false)}>Отмена</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Сохранение...' : 'Создать игру'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .breadcrumb { display: flex; gap: 8px; align-items: center; margin-bottom: 24px; font-size: 0.9rem; }
        .breadcrumb-link { color: var(--accent); }
        .breadcrumb-link:hover { opacity: 0.7; }
        .cp-header {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 24px; margin-bottom: 32px; flex-wrap: wrap;
        }
        .cp-code-block { padding: 16px 20px; text-align: center; min-width: 200px; }
        .cp-tabs {
          display: flex; gap: 4px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 4px;
          width: fit-content;
          margin-bottom: 28px;
        }
        .cp-tab {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 20px;
          border: none; background: transparent;
          color: var(--text-muted);
          font-family: inherit; font-size: 0.9rem; font-weight: 600;
          cursor: pointer; border-radius: 10px;
          transition: all var(--transition);
        }
        .cp-tab.active { background: var(--accent); color: #fff; box-shadow: var(--shadow-sm); }
        .cp-tab-count {
          background: rgba(255,255,255,0.15); color: inherit;
          padding: 1px 7px; border-radius: 100px; font-size: 0.75rem;
        }
        .students-list { display: flex; flex-direction: column; gap: 10px; }
        .student-row {
          display: flex; align-items: center; gap: 16px; padding: 16px 20px;
        }
        .student-avatar {
          width: 42px; height: 42px; border-radius: 50%;
          background: var(--accent-light);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; font-weight: 700; color: #a78bfa;
          flex-shrink: 0;
        }
        .student-name { font-weight: 600; font-size: 0.95rem; }
        .student-date { font-size: 0.78rem; color: var(--text-muted); margin-top: 2px; }
        .student-num { margin-left: auto; color: var(--text-muted); font-size: 0.85rem; }
      `}</style>
    </>
  );
}
