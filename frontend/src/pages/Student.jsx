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
import { t } from '../utils/translations';

export default function Student() {
  const [classData, setClassData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [games, setGames] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [activeGame, setActiveGame] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [, setLangTick] = useState(0);

  useEffect(() => {
    const handleLangChange = () => setLangTick(n => n + 1);
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const GAME_CATEGORIES = [
    { type: 'match_pairs', label: t('matchPairs'), emoji: '🃏', xp: '+15 XP', desc: t('matchPairsDesc') },
    { type: 'anagram', label: t('anagram'), emoji: '🔤', xp: '+10 XP', desc: t('anagramDesc') },
    { type: 'quiz', label: t('quiz'), emoji: '📖', xp: '+20 XP', desc: t('quizDesc') },
    { type: 'pronunciation', label: t('pronunciation'), emoji: '🎤', xp: '+25 XP', desc: t('pronunciationDesc') },
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
                <i className="ph ph-check-circle"></i> {t('inClass')}
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
                  {t('hello')}, {studentData?.name}! 👋
                </div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', marginTop: 4 }}>
                  {videos.length} {t('lessonsAvailable')}
                </div>
                <div className="xp-pill">
                  <i className="ph-fill ph-star"></i>
                  {t('yourRating')}: {leaderboard.find(s => s.id === studentData?.id)?.points || 0} XP
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="cp-tabs" style={{ marginTop: 32 }}>
            <button className={`tab ${tab === 'videos' ? 'active' : ''}`} onClick={() => { setTab('videos'); setActiveGame(null); }}>
              <i className="ph ph-video"></i> {t('lessons')}
            </button>
            <button className={`tab ${tab === 'games' ? 'active' : ''}`} onClick={() => { setTab('games'); setActiveGame(null); }}>
              <i className="ph ph-game-controller"></i> {t('games')}
            </button>
            <button className={`tab ${tab === 'leaderboard' ? 'active' : ''}`} onClick={() => { setTab('leaderboard'); setActiveGame(null); }}>
              <i className="ph ph-trophy"></i> {t('leaderboard')}
            </button>
          </div>

          {/* Videos Tab */}
          {tab === 'videos' && (
            <div className="fade-in">
              <div className="section-header">
                <h2><i className="ph ph-video"></i> {t('videoLessons')}</h2>
                <span className="badge badge-blue">{videos.length}</span>
              </div>

          {videos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><i className="ph ph-film-strip"></i></div>
              <h3>{t('noLessons')}</h3>
              <p>{t('teacherNotAdded')}</p>
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
              {/* Level 1: Category Folders */}
              {!selectedCategory ? (
                <div>
                  <div className="section-header" style={{ marginBottom: 24 }}>
                    <div>
                      <h2><i className="ph ph-game-controller"></i> {t('gameCategories')}</h2>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{t('selectGameCategory')}</p>
                    </div>
                  </div>

                  <div className="grid-2">
                    {GAME_CATEGORIES.map(cat => {
                      const count = games.filter(g => g.type === cat.type).length;
                      return (
                        <div
                          key={cat.type}
                          className="card slide-up"
                          onClick={() => setSelectedCategory(cat.type)}
                          style={{
                            padding: '24px 28px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justify: 'space-between',
                            gap: 16,
                            border: '1.5px solid var(--border)',
                            transition: 'all 0.25s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'var(--tiffany)';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(10,186,181,0.18)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{
                              width: 56, height: 56, borderRadius: 16,
                              background: 'var(--tiffany-xlight)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '1.8rem', border: '1px solid var(--border)'
                            }}>
                              {cat.emoji}
                            </div>
                            <span className="badge badge-purple" style={{ fontSize: '0.85rem' }}>{cat.xp}</span>
                          </div>

                          <div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                              {cat.label}
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                              {cat.desc}
                            </p>
                          </div>

                          <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            paddingTop: 14, borderTop: '1px solid var(--border)', marginTop: 4
                          }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--tiffany-dark)' }}>
                              {count}
                            </span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--tiffany)' }}>
                              {t('open')} →
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Level 2: Games inside selected category */
                <div>
                  {(() => {
                    const catInfo = GAME_CATEGORIES.find(c => c.type === selectedCategory);
                    const catGames = games.filter(g => g.type === selectedCategory);

                    return (
                      <div>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedCategory(null)}
                          style={{ marginBottom: 20 }}
                        >
                          <i className="ph ph-arrow-left"></i> {t('backToCategories')}
                        </button>

                        <div className="section-header" style={{ marginBottom: 24 }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                              <span style={{ fontSize: '1.8rem' }}>{catInfo?.emoji}</span>
                              <h2 style={{ margin: 0 }}>{catInfo?.label}</h2>
                              <span className="badge badge-purple">{catInfo?.xp}</span>
                            </div>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{catInfo?.desc}</p>
                          </div>
                        </div>

                        {catGames.length === 0 ? (
                          <div className="empty-state">
                            <div className="empty-state-icon">{catInfo?.emoji}</div>
                            <h3>{t('noGames')}</h3>
                            <p>{t('teacherWillAddGames')}</p>
                          </div>
                        ) : (
                          <div className="grid-3">
                            {catGames.map((game) => (
                              <div key={game.id} className="card slide-up" style={{ padding: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                  <div className="badge badge-purple" style={{ marginBottom: 12, display: 'inline-flex' }}>{catInfo?.emoji} {catInfo?.label}</div>
                                  <h3 style={{ fontSize: '1.25rem', marginBottom: 12, color: 'var(--text-primary)' }}>{game.title}</h3>
                                </div>
                                <button
                                  className="btn btn-primary"
                                  style={{ width: '100%', marginTop: 16 }}
                                  onClick={() => setActiveGame(game)}
                                >
                                  <i className="ph-fill ph-play"></i> {t('play')}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
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
              <ActivityChart data={weeklyActivity || []} />
              <div className="section-header" style={{ marginTop: 32 }}>
                <h2><i className="ph ph-trophy"></i> {t('classLeaderboard')}</h2>
              </div>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {(Array.isArray(leaderboard) ? leaderboard : []).map((student, index) => (
                  <div 
                    key={student.id || index} 
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
                      {student.name} {student.id === studentData?.id ? '(Сиз / Вы)' : ''}
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
      `}</style>
    </>
  );
}
