import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentsAPI, gamesAPI } from '../api/api';
import VideoCard from '../components/VideoCard';
import Navbar from '../components/Navbar';
import MatchGame from '../components/MatchGame';
import ActivityChart from '../components/ActivityChart';

export default function Student() {
  const [classData, setClassData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [games, setGames] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [activeGame, setActiveGame] = useState(null);
  const [tab, setTab] = useState('videos'); // 'videos' | 'games' | 'leaderboard'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const studentData = (() => {
    try { return JSON.parse(localStorage.getItem('student_data')); }
    catch { return null; }
  })();

  useEffect(() => {
    if (!localStorage.getItem('student_token')) {
      navigate('/');
      return;
    }
    loadClass();

    // Отправляем активность каждые 60 секунд
    const pingActivity = () => studentsAPI.sendActivity().catch(() => {});
    pingActivity(); // сразу при входе
    const interval = setInterval(pingActivity, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadClass = async () => {
    try {
      const [classRes, gamesRes, leadRes, actRes] = await Promise.all([
        studentsAPI.getClass(),
        gamesAPI.getForStudent(),
        studentsAPI.getLeaderboard(),
        studentsAPI.getWeeklyActivity()
      ]);
      setClassData(classRes.data.class);
      setVideos(classRes.data.videos);
      setGames(gamesRes.data);
      setLeaderboard(leadRes.data);
      setWeeklyActivity(actRes.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        localStorage.removeItem('student_token');
        localStorage.removeItem('student_data');
        navigate('/');
      } else {
        setError('Ошибка загрузки данных');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar role="student" />
        <div className="page loading-center"><div className="spinner" /></div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar role="student" />
        <div className="page-center">
          <div className="alert alert-error">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar role="student" />
      <div className="page">
        <div className="container">
          {/* Header */}
          <div className="section-header fade-in">
            <div>
              <div className="badge badge-green" style={{ marginBottom: 12 }}>
                <i className="ph ph-check-circle"></i> Вы в классе
              </div>
              <h1>{classData?.name}</h1>
              {classData?.description && (
                <p style={{ marginTop: 8, fontSize: '1rem', color: 'var(--text-secondary)' }}>
                  {classData.description}
                </p>
              )}
            </div>
            <div className="student-welcome card">
              <div style={{ fontSize: '2rem', marginBottom: 8, color: 'var(--accent)' }}><i className="ph ph-hand-waving"></i></div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                Привет, {studentData?.name}!
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 8 }}>
                {videos.length} урок{videos.length === 1 ? '' : videos.length < 5 ? 'а' : 'ов'} доступно
              </div>
              <div className="badge badge-orange" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem' }}>
                <i className="ph-fill ph-star"></i> Ваш рейтинг: {leaderboard.find(s => s.id === studentData?.id)?.points || 0} XP
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Tabs */}
          <div className="cp-tabs">
            <button className={`tab ${tab === 'videos' ? 'active' : ''}`} onClick={() => { setTab('videos'); setActiveGame(null); }}>
              <i className="ph ph-video"></i> Уроки
            </button>
            <button className={`tab ${tab === 'games' ? 'active' : ''}`} onClick={() => { setTab('games'); setActiveGame(null); }}>
              <i className="ph ph-game-controller"></i> Игры
            </button>
            <button className={`tab ${tab === 'leaderboard' ? 'active' : ''}`} onClick={() => { setTab('leaderboard'); setActiveGame(null); }}>
              <i className="ph ph-trophy"></i> Рейтинг
            </button>
          </div>

          {/* Videos Tab */}
          {tab === 'videos' && (
            <div className="fade-in">
              <div className="section-header">
                <h2><i className="ph ph-video"></i> Видеоуроки</h2>
                <span className="badge badge-blue">{videos.length} урок{videos.length === 1 ? '' : videos.length < 5 ? 'а' : 'ов'}</span>
              </div>

          {videos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><i className="ph ph-film-strip"></i></div>
              <h3>Уроков пока нет</h3>
              <p>Учитель ещё не добавил видеоуроки. Загляни позже!</p>
            </div>
          ) : (
            <div className="grid-3">
              {videos.map((video, i) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  index={i}
                  showActions={false}
                  onPlay={() => studentsAPI.markVideoWatched(video.id).catch(() => {})}
                />
              ))}
            </div>
          )}
          </div>
          )}

          {/* Games Tab */}
          {tab === 'games' && !activeGame && (
            <div className="fade-in">
              <div className="section-header">
                <h2><i className="ph ph-game-controller"></i> Интерактивные игры</h2>
              </div>
              {games.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><i className="ph ph-game-controller"></i></div>
                  <h3>Игр пока нет</h3>
                  <p>Учитель скоро добавит новые игры!</p>
                </div>
              ) : (
                <div className="grid-3">
                  {games.map((game) => (
                    <div key={game.id} className="card slide-up" style={{ padding: 20, textAlign: 'center' }}>
                      <div className="badge badge-purple" style={{ marginBottom: 12, display: 'inline-flex' }}>Найди пару</div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>{game.title}</h3>
                      <button 
                        className="btn btn-primary" 
                        style={{ width: '100%' }}
                        onClick={() => setActiveGame(game)}
                      >
                        <i className="ph-fill ph-play"></i> Играть
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Active Game */}
          {activeGame && (
            <div className="fade-in">
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveGame(null)} style={{ marginBottom: 20 }}>
                <i className="ph ph-arrow-left"></i> К списку игр
              </button>
              <h2 style={{ marginBottom: 12 }}>{activeGame.title}</h2>
              <MatchGame 
                game={activeGame} 
                onComplete={async (score) => {
                  try {
                    const res = await gamesAPI.complete(activeGame.id, score);
                    if (res.data.pointsAwarded > 0) {
                      // refresh points in leaderboard silently
                      studentsAPI.getLeaderboard().then(r => setLeaderboard(r.data)).catch(()=>{});
                    }
                  } catch(e) {}
                }} 
              />
            </div>
          )}

          {/* Leaderboard Tab */}
          {tab === 'leaderboard' && (
            <div className="fade-in">
              <ActivityChart data={weeklyActivity} />
              <div className="section-header" style={{ marginTop: 32 }}>
                <h2><i className="ph ph-trophy"></i> Рейтинг класса</h2>
              </div>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {leaderboard.map((student, index) => (
                  <div 
                    key={student.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '16px 24px',
                      borderBottom: index < leaderboard.length - 1 ? '1px solid var(--border)' : 'none',
                      background: student.id === studentData?.id ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent'
                    }}
                  >
                    <div style={{ width: 40, fontSize: '1.5rem', fontWeight: 'bold', color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'var(--text-secondary)' }}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                    </div>
                    <div style={{ flex: 1, fontSize: '1.1rem', fontWeight: student.id === studentData?.id ? 'bold' : 'normal' }}>
                      {student.name} {student.id === studentData?.id ? '(Вы)' : ''}
                    </div>
                    <div className="badge badge-orange" style={{ fontSize: '1rem', padding: '6px 12px' }}>
                      <i className="ph-fill ph-star"></i> {student.points || 0} XP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .student-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .student-welcome {
          text-align: center;
          min-width: 180px;
          padding: 20px 24px;
        }
      `}</style>
    </>
  );
}
