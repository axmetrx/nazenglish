import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentsAPI, gamesAPI } from '../api/api';
import VideoCard from '../components/VideoCard';
import Navbar from '../components/Navbar';
import MatchGame from '../components/MatchGame';
import AnagramGame from '../components/AnagramGame';
import QuizGame from '../components/QuizGame';
import PronunciationGame from '../components/PronunciationGame';
import ActivityChart from '../components/ActivityChart';

export default function Student() {
  const [classData, setClassData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [games, setGames] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [gameCategory, setGameCategory] = useState('all');

  const GAME_TYPES = [
    { type: 'all', label: 'Все игры', emoji: '🌟' },
    { type: 'match_pairs', label: 'Найди пару', emoji: '🃏', xp: '+15 XP', desc: 'Сопоставьте английские слова с их переводом' },
    { type: 'anagram', label: 'Анаграмма', emoji: '🔤', xp: '+10 XP', desc: 'Соберите правильное слово из перемешанных букв' },
    { type: 'quiz', label: 'Тест / Квиз', emoji: '📖', xp: '+20 XP', desc: 'Ответьте на вопросы с вариантами ответов' },
    { type: 'pronunciation', label: 'Произношение', emoji: '🎤', xp: '+25 XP', desc: 'Произносите слова в микрофон и проверяйте себя' },
  ];
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
          {/* Hero Banner */}
          <div className="student-hero fade-in">
            <div className="student-hero-left">
              <div className="badge badge-green" style={{ marginBottom: 14 }}>
                <i className="ph ph-check-circle"></i> Вы в классе
              </div>
              <h1 style={{ color: '#fff', marginBottom: 6 }}>{classData?.name}</h1>
              {classData?.description && (
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', marginTop: 4 }}>
                  {classData.description}
                </p>
              )}
            </div>
            <div className="student-hero-right">
              <div className="student-avatar-icon">
                <i className="ph ph-student"></i>
              </div>
              <div className="student-hero-info">
                <div style={{ fontWeight: 700, fontSize: '1.15rem', color: '#fff' }}>
                  Привет, {studentData?.name}! 👋
                </div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', marginTop: 4 }}>
                  {videos.length} урок{videos.length === 1 ? '' : videos.length < 5 ? 'а' : 'ов'} доступно
                </div>
                <div className="xp-pill">
                  <i className="ph-fill ph-star"></i>
                  {leaderboard.find(s => s.id === studentData?.id)?.points || 0} XP
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="cp-tabs" style={{ marginTop: 32 }}>
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
              <div className="section-header" style={{ marginBottom: 20 }}>
                <div>
                  <h2><i className="ph ph-game-controller"></i> Интерактивные игры</h2>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Выберите категорию и учите английский весело!</p>
                </div>
              </div>

              {/* Category Filter Chips */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
                {GAME_TYPES.map(cat => {
                  const count = cat.type === 'all'
                    ? games.length
                    : games.filter(g => g.type === cat.type).length;
                  const isActive = gameCategory === cat.type;
                  return (
                    <button
                      key={cat.type}
                      onClick={() => setGameCategory(cat.type)}
                      className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{
                        borderRadius: 100,
                        padding: '8px 18px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                      <span style={{
                        background: isActive ? 'rgba(255,255,255,0.3)' : 'var(--bg-tertiary)',
                        color: isActive ? '#fff' : 'var(--tiffany-dark)',
                        padding: '2px 8px',
                        borderRadius: 100,
                        fontSize: '0.78rem'
                      }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {games.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><i className="ph ph-game-controller"></i></div>
                  <h3>Игр пока нет</h3>
                  <p>Учитель скоро добавит новые игры!</p>
                </div>
              ) : (
                <div>
                  {GAME_TYPES.filter(cat => cat.type !== 'all').map(cat => {
                    if (gameCategory !== 'all' && gameCategory !== cat.type) return null;
                    const catGames = games.filter(g => g.type === cat.type);
                    if (catGames.length === 0 && gameCategory === cat.type) {
                      return (
                        <div key={cat.type} className="empty-state">
                          <div className="empty-state-icon">{cat.emoji}</div>
                          <h3>В категории "{cat.label}" пока нет игр</h3>
                          <p>Загляните позже!</p>
                        </div>
                      );
                    }
                    if (catGames.length === 0) return null;

                    return (
                      <div key={cat.type} style={{ marginBottom: 40 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justify-content: 'space-between',
                          marginBottom: 16,
                          paddingBottom: 10,
                          borderBottom: '2px solid var(--border)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: '1.5rem' }}>{cat.emoji}</span>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{cat.label}</h3>
                            <span className="badge badge-purple">{cat.xp}</span>
                          </div>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {catGames.length} {catGames.length === 1 ? 'игра' : catGames.length < 5 ? 'игры' : 'игр'}
                          </span>
                        </div>

                        <div className="grid-3">
                          {catGames.map((game) => (
                            <div key={game.id} className="card slide-up" style={{ padding: 20, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                              <div>
                                <div className="badge badge-purple" style={{ marginBottom: 10, display: 'inline-flex' }}>{cat.emoji} {cat.label}</div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: 12, color: 'var(--text-primary)' }}>{game.title}</h3>
                              </div>
                              <button
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: 12 }}
                                onClick={() => setActiveGame(game)}
                              >
                                <i className="ph-fill ph-play"></i> Играть
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
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
              <h2 style={{ marginBottom: 24 }}>{activeGame.title}</h2>
              {(() => {
                const completeHandler = async (score) => {
                  try {
                    const res = await gamesAPI.complete(activeGame.id, score);
                    if (res.data.pointsAwarded > 0) {
                      studentsAPI.getLeaderboard().then(r => setLeaderboard(r.data)).catch(() => {});
                    }
                  } catch(e) {}
                };
                if (activeGame.type === 'anagram') return <AnagramGame game={activeGame} onComplete={completeHandler} />;
                if (activeGame.type === 'quiz') return <QuizGame game={activeGame} onComplete={completeHandler} />;
                if (activeGame.type === 'pronunciation') return <PronunciationGame game={activeGame} onComplete={completeHandler} />;
                return <MatchGame game={activeGame} onComplete={completeHandler} />;
              })()}
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
                      background: student.id === studentData?.id ? 'var(--tiffany-xlight)' : 'transparent'
                    }}
                  >
                    <div style={{ width: 40, fontSize: '1.5rem', fontWeight: 'bold', color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'var(--text-secondary)' }}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                    </div>
                    <div style={{ flex: 1, fontSize: '1.1rem', fontWeight: student.id === studentData?.id ? 'bold' : 'normal' }}>
                      {student.name} {student.id === studentData?.id ? '(Вы)' : ''}
                    </div>
                    <div className="badge badge-purple" style={{ fontSize: '0.9rem', padding: '6px 12px' }}>
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
        .student-hero {
          background: linear-gradient(135deg, #0ABAB5 0%, #089E9A 60%, #067370 100%);
          border-radius: 20px;
          padding: 36px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          box-shadow: 0 8px 32px rgba(10, 186, 181, 0.3);
          flex-wrap: wrap;
        }
          text-align: center;
          min-width: 180px;
          padding: 20px 24px;
        }
      `}</style>
    </>
  );
}
