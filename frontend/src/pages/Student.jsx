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

function VideoPlayerFrame({ url, title }) {
  if (!url) return null;
  let embedUrl = null;

  let match = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/);
  if (match) embedUrl = `https://drive.google.com/file/d/${match[1]}/preview`;

  if (!embedUrl) {
    match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
    if (match) embedUrl = `https://www.youtube.com/embed/${match[1]}?rel=0`;
  }
  if (!embedUrl) {
    match = url.match(/youtube\.com\/shorts\/([^?&\s]+)/);
    if (match) embedUrl = `https://www.youtube.com/embed/${match[1]}`;
  }
  if (!embedUrl && url.includes('drive.google.com') && url.includes('preview')) embedUrl = url;
  if (!embedUrl && (url.includes('youtube.com/embed') || url.includes('player.vimeo.com'))) embedUrl = url;

  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'linear-gradient(135deg, var(--tiffany), var(--tiffany-darker))', color: '#fff', padding: 24, textAlign: 'center' }}>
      <i className="ph-fill ph-video-camera" style={{ fontSize: '3rem', marginBottom: 12, opacity: 0.85 }}></i>
      <h4 style={{ color: '#fff', marginBottom: 12, fontSize: '1.1rem' }}>{title}</h4>
      <a href={url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ background: '#fff', color: 'var(--tiffany-dark)', fontWeight: 600 }}>
        <i className="ph ph-arrow-square-out"></i> {t('openVideo')}
      </a>
    </div>
  );
}

export default function Student() {
  const [classData, setClassData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [games, setGames] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [activeGame, setActiveGame] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
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
    loadData();

    const interval = setInterval(() => {
      loadData(true);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async (silent = false) => {
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
          {/* Premium Hero Banner */}
          <div className="student-hero-banner fade-in">
            <div className="sh-glow-1"></div>
            <div className="sh-glow-2"></div>

            <div className="sh-content">
              {/* Left Column: Class Info & Badges */}
              <div className="sh-left">
                <div className="sh-tags-row">
                  <span className="sh-pill-badge sh-pill-active">
                    <span className="sh-pulse-dot"></span>
                    <i className="ph ph-check-circle"></i> {classData?.name || t('inClass')}
                  </span>
                  <span className="sh-pill-badge sh-pill-glass">
                    {t('englishCourse')}
                  </span>
                </div>

                <h1 className="sh-title">
                  {classData?.name}
                </h1>
                
                <p className="sh-subtitle">
                  {classData?.description || t('homeHeroSubtitle')}
                </p>

                {/* Quick Stats Chips */}
                <div className="sh-stats-grid">
                  <div className="sh-stat-card">
                    <span className="sh-stat-icon">🎬</span>
                    <div>
                      <div className="sh-stat-val">{videos.length}</div>
                      <div className="sh-stat-lbl">{t('lessons')}</div>
                    </div>
                  </div>

                  <div className="sh-stat-card">
                    <span className="sh-stat-icon">🎮</span>
                    <div>
                      <div className="sh-stat-val">{games.length || 15}</div>
                      <div className="sh-stat-lbl">{t('games')}</div>
                    </div>
                  </div>

                  <div className="sh-stat-card">
                    <span className="sh-stat-icon">⭐</span>
                    <div>
                      <div className="sh-stat-val">{leaderboard.find(s => s.id === studentData?.id)?.points || 0} XP</div>
                      <div className="sh-stat-lbl">{t('yourPoints')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Teacher & Student Profile Cards */}
              <div className="sh-right">
                <div className="sh-teacher-mini-badge">
                  <img src="/teacher.jpg" alt="Мугалим Nazenglish" className="sh-t-img" />
                  <div>
                    <div className="sh-t-role">{t('teacher')}</div>
                    <div className="sh-t-name">{t('teacherName')}</div>
                  </div>
                </div>

                <div className="sh-profile-card">
                  <div className="sh-avatar-wrapper">
                    <div className="sh-avatar">
                      {(studentData?.name || 'О')[0].toUpperCase()}
                    </div>
                    <span className="sh-avatar-badge">🎓</span>
                  </div>

                  <div className="sh-profile-details">
                    <div className="sh-greeting">{t('hello')}, 👋</div>
                    <div className="sh-student-name">{studentData?.name || t('student')}</div>
                    <div className="sh-class-chip">
                      <i className="ph ph-chalkboard"></i> {classData?.name}
                    </div>
                  </div>
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

          {/* Videos Tab: One by One Sequential Lesson Player */}
          {tab === 'videos' && (
            <div className="fade-in">
              <div className="section-header" style={{ marginBottom: 20 }}>
                <div>
                  <h2><i className="ph ph-video"></i> {t('videoLessons')}</h2>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    {t('watchLessonsInOrder')}
                  </p>
                </div>
                {videos.length > 0 && (
                  <div className="badge badge-purple" style={{ fontSize: '0.95rem', padding: '6px 14px' }}>
                    <i className="ph ph-film-strip"></i> {currentLessonIndex + 1} / {videos.length} {t('lessons')}
                  </div>
                )}
              </div>

              {videos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><i className="ph ph-film-strip"></i></div>
                  <h3>{t('noLessons')}</h3>
                  <p>{t('teacherNotAdded')}</p>
                </div>
              ) : (
                <div className="seq-player-container">
                  {/* Lesson Pills Switcher */}
                  <div className="seq-pills-bar">
                    {videos.map((v, i) => (
                      <button
                        key={v.id || i}
                        className={`seq-pill-btn ${i === currentLessonIndex ? 'active' : ''}`}
                        onClick={() => {
                          setCurrentLessonIndex(i);
                          studentsAPI.markVideoWatched(v.id).catch(() => {});
                        }}
                      >
                        <i className={`ph ${i === currentLessonIndex ? 'ph-play-circle' : 'ph-video'}`}></i>
                        <span>{i + 1}-{t('lesson')}</span>
                      </button>
                    ))}
                  </div>

                  {/* Main Active Lesson Player Card */}
                  {videos[currentLessonIndex] && (
                    <div className="seq-active-card">
                      <div className="seq-video-frame">
                        <VideoPlayerFrame
                          url={videos[currentLessonIndex].url}
                          title={videos[currentLessonIndex].title}
                        />
                      </div>

                      <div className="seq-card-body">
                        <div className="seq-meta-row">
                          <div className="badge badge-green" style={{ fontSize: '0.85rem' }}>
                            <i className="ph ph-check-circle"></i> {t('lesson')} {currentLessonIndex + 1}
                          </div>
                          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                            {currentLessonIndex + 1} {t('ofTotal')} {videos.length}
                          </span>
                        </div>

                        <h3 className="seq-title">
                          {videos[currentLessonIndex].title}
                        </h3>

                        {videos[currentLessonIndex].description && (
                          <p className="seq-description">
                            {videos[currentLessonIndex].description}
                          </p>
                        )}

                        {/* Navigation Buttons: Previous / Next */}
                        <div className="seq-nav-actions">
                          <button
                            className="btn btn-secondary"
                            disabled={currentLessonIndex === 0}
                            onClick={() => setCurrentLessonIndex(prev => Math.max(0, prev - 1))}
                            style={{ minWidth: 160 }}
                          >
                            <i className="ph ph-arrow-left"></i> {t('prevLesson')}
                          </button>

                          {currentLessonIndex < videos.length - 1 ? (
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                const nextIdx = currentLessonIndex + 1;
                                setCurrentLessonIndex(nextIdx);
                                if (videos[nextIdx]) {
                                  studentsAPI.markVideoWatched(videos[nextIdx].id).catch(() => {});
                                }
                              }}
                              style={{ minWidth: 160 }}
                            >
                              {t('nextLesson')} <i className="ph ph-arrow-right"></i>
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary"
                              style={{ minWidth: 160, background: 'linear-gradient(135deg, #059669, #047857)' }}
                              onClick={() => setTab('games')}
                            >
                              {t('goToGames')} <i className="ph ph-game-controller"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
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
        .student-hero-banner {
          position: relative;
          background: linear-gradient(135deg, #074744 0%, #087f7b 40%, #0abab5 75%, #15c7c2 100%);
          border-radius: 24px;
          padding: 32px 36px;
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(10, 186, 181, 0.25), 0 4px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.25);
          margin-bottom: 8px;
        }

        .sh-glow-1 {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 70%);
          top: -100px;
          right: 15%;
          pointer-events: none;
        }

        .sh-glow-2 {
          position: absolute;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(10, 186, 181, 0.4) 0%, rgba(0, 0, 0, 0) 70%);
          bottom: -80px;
          left: 10%;
          pointer-events: none;
        }

        .sh-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
        }

        .sh-left {
          flex: 1.2;
          min-width: 280px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sh-tags-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .sh-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .sh-pill-active {
          background: rgba(255, 255, 255, 0.95);
          color: #067370;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .sh-pill-glass {
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(8px);
        }

        .sh-pulse-dot {
          width: 8px;
          height: 8px;
          background: #059669;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }

        .sh-title {
          font-size: clamp(1.8rem, 3.5vw, 2.3rem);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin: 0;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .sh-subtitle {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.88);
          line-height: 1.5;
          margin: 0;
          max-width: 500px;
        }

        .sh-stats-grid {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 6px;
          flex-wrap: wrap;
        }

        .sh-stat-card {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.28);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 14px;
          transition: transform 0.2s, background 0.2s;
        }

        .sh-stat-card:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.26);
        }

        .sh-stat-icon {
          font-size: 1.4rem;
        }

        .sh-stat-val {
          font-size: 1.1rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
        }

        .sh-stat-lbl {
          font-size: 0.72rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.82);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .sh-right {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .sh-teacher-mini-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.18);
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(12px);
          padding: 8px 14px 8px 8px;
          border-radius: 100px;
        }

        .sh-t-img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #ffffff;
        }

        .sh-t-role {
          font-size: 0.7rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .sh-t-name {
          font-size: 0.95rem;
          font-weight: 800;
          color: #ffffff;
        }

        .sh-profile-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.22);
          border: 1.5px solid rgba(255, 255, 255, 0.38);
          backdrop-filter: blur(14px);
          padding: 16px 22px;
          border-radius: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .sh-avatar-wrapper {
          position: relative;
        }

        .sh-avatar {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          background: linear-gradient(135deg, #ffffff, #e0f7f6);
          color: #087f7b;
          font-size: 1.6rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
        }

        .sh-avatar-badge {
          position: absolute;
          bottom: -4px;
          right: -4px;
          font-size: 1.1rem;
          background: #ffffff;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .sh-profile-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sh-greeting {
          font-size: 0.82rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
        }

        .sh-student-name {
          font-size: 1.2rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
        }

        .sh-class-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #d0f5f4;
          margin-top: 4px;
        }

        @media (max-width: 768px) {
          .student-hero-banner {
            padding: 22px 18px;
            border-radius: 18px;
          }
          .sh-content {
            flex-direction: column;
            align-items: stretch;
            gap: 18px;
          }
          .sh-stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }
          .sh-stat-card {
            padding: 8px 6px;
            flex-direction: column;
            text-align: center;
            gap: 2px;
          }
          .sh-stat-icon {
            font-size: 1.2rem;
          }
          .sh-stat-val {
            font-size: 0.95rem;
          }
          .sh-stat-lbl {
            font-size: 0.65rem;
          }
          .sh-profile-card {
            padding: 14px 16px;
          }
        }

        .seq-player-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .seq-pills-bar {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 8px;
          scrollbar-width: thin;
        }

        .seq-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 100px;
          border: 1.5px solid var(--border);
          background: #fff;
          color: var(--text-primary);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .seq-pill-btn:hover {
          border-color: var(--tiffany);
          background: var(--tiffany-xlight);
        }

        .seq-pill-btn.active {
          background: linear-gradient(135deg, var(--tiffany), var(--tiffany-dark));
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 14px rgba(10, 186, 181, 0.35);
        }

        .seq-active-card {
          background: #ffffff;
          border: 1.5px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .seq-video-frame {
          width: 100%;
          aspect-ratio: 16/9;
          background: #000;
        }

        .seq-card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .seq-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .seq-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .seq-description {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .seq-nav-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 8px;
          padding-top: 18px;
          border-top: 1px solid var(--border);
          flex-wrap: wrap;
        }
      `}</style>
    </>
  );
}
