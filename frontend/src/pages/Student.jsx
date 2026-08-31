import { useEffect, useState, useRef } from 'react';
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
  const [iframeError, setIframeError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerBoxRef = useRef(null);

  let embedUrl = null;
  let directUrl = url;
  let driveFileId = null;

  // Google Drive
  let match = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/);
  if (match) {
    driveFileId = match[1];
    embedUrl = `https://drive.google.com/file/d/${driveFileId}/preview`;
    directUrl = `https://drive.google.com/file/d/${driveFileId}/view?usp=sharing`;
  }

  // YouTube
  if (!embedUrl) {
    match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
    if (match) embedUrl = `https://www.youtube.com/embed/${match[1]}?rel=0&playsinline=1`;
  }
  if (!embedUrl) {
    match = url.match(/youtube\.com\/shorts\/([^?&\s]+)/);
    if (match) embedUrl = `https://www.youtube.com/embed/${match[1]}?playsinline=1`;
  }
  if (!embedUrl && url.includes('drive.google.com') && url.includes('preview')) embedUrl = url;
  if (!embedUrl && (url.includes('youtube.com/embed') || url.includes('player.vimeo.com'))) embedUrl = url;

  // Fullscreen event listener
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange', handleFsChange);
    document.addEventListener('MSFullscreenChange', handleFsChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange', handleFsChange);
      document.removeEventListener('MSFullscreenChange', handleFsChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!playerBoxRef.current) return;
    const el = playerBoxRef.current;

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  return (
    <div ref={playerBoxRef} className={`video-player-box ${isFullscreen ? 'is-fullscreen' : ''}`}>
      {/* Video frame or fallback */}
      {embedUrl && !iframeError ? (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen={true}
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          referrerPolicy="no-referrer"
          loading="eager"
          className="video-player-frame"
          onError={() => setIframeError(true)}
        />
      ) : (
        /* Fallback: big play button that opens video directly */
        <a
          href={directUrl}
          target="_blank"
          rel="noreferrer"
          className="video-fallback-play"
        >
          <div className="vfp-icon">▶</div>
          <div className="vfp-text">{title || 'Видео'}</div>
          <div className="vfp-sub">{t('openVideo')} ↗</div>
        </a>
      )}

      {/* Floating Fullscreen Exit Button (visible only in fullscreen mode) */}
      {isFullscreen && (
        <button
          className="vdf-fs-close-btn"
          onClick={toggleFullscreen}
          title={t('exitFullscreen')}
        >
          ✕ {t('exitFullscreen')}
        </button>
      )}

      {/* Responsive Player Control Bar */}
      <div className="video-player-controls-bar">
        <button
          type="button"
          className="vdf-btn vdf-fs-btn"
          onClick={toggleFullscreen}
        >
          <i className={`ph-bold ${isFullscreen ? 'ph-corners-in' : 'ph-corners-out'}`}></i>
          <span>{isFullscreen ? t('exitFullscreen') : t('fullscreen')}</span>
        </button>

        {driveFileId && (
          <a
            href={directUrl}
            target="_blank"
            rel="noreferrer"
            className="vdf-btn vdf-drive-btn"
          >
            <i className="ph-bold ph-arrow-square-out"></i>
            <span>Google Дискте ачуу</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default function Student() {
  const [completedVideoIds, setCompletedVideoIds] = useState(new Set());
  const [lockToast, setLockToast] = useState('');
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
      if (classRes.data.watchedVideoIds) {
        setCompletedVideoIds(new Set(classRes.data.watchedVideoIds));
      }
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

  // Check if lesson at index is unlocked
  // Rule: Lesson 0 is always unlocked. Lesson N is unlocked only if all previous lessons (0..N-1) are completed!
  const isLessonUnlocked = (index) => {
    if (index === 0) return true;
    for (let k = 0; k < index; k++) {
      const prevVideo = videos[k];
      if (prevVideo && !completedVideoIds.has(prevVideo.id)) {
        return false;
      }
    }
    return true;
  };

  const handleSelectLesson = (index) => {
    if (!isLessonUnlocked(index)) {
      setLockToast(`${index + 1}-${t('lesson')} ${t('locked')}. ${t('lessonLockedDesc')}`);
      setTimeout(() => setLockToast(''), 4000);
      return;
    }
    setCurrentLessonIndex(index);
    setLockToast('');
  };

  const handleCompleteLesson = async (video) => {
    if (!video) return;
    setCompletedVideoIds(prev => {
      const next = new Set(prev);
      next.add(video.id);
      return next;
    });
    try {
      await studentsAPI.markVideoWatched(video.id);
      const leadRes = await studentsAPI.getLeaderboard().catch(() => null);
      if (leadRes) setLeaderboard(leadRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNextLesson = async () => {
    const currentVideo = videos[currentLessonIndex];
    if (currentVideo) {
      await handleCompleteLesson(currentVideo);
    }
    const nextIdx = currentLessonIndex + 1;
    if (nextIdx < videos.length) {
      setCurrentLessonIndex(nextIdx);
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

          {/* Toast Notice for Locked Lesson */}
          {lockToast && (
            <div className="seq-lock-toast fade-in">
              <i className="ph-fill ph-lock-key"></i> {lockToast}
            </div>
          )}

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
                    {videos.map((v, i) => {
                      const unlocked = isLessonUnlocked(i);
                      const completed = completedVideoIds.has(v.id);
                      const active = i === currentLessonIndex;
                      return (
                        <button
                          key={v.id || i}
                          className={`seq-pill-btn ${active ? 'active' : ''} ${!unlocked ? 'locked' : ''} ${completed ? 'completed' : ''}`}
                          onClick={() => handleSelectLesson(i)}
                          title={!unlocked ? t('lessonLocked') : completed ? t('completed') : ''}
                        >
                          {!unlocked ? (
                            <i className="ph-bold ph-lock-key" style={{ color: '#d97706' }}></i>
                          ) : completed ? (
                            <i className="ph-fill ph-check-circle" style={{ color: '#059669' }}></i>
                          ) : (
                            <i className={`ph ${active ? 'ph-play-circle' : 'ph-video'}`}></i>
                          )}
                          <span>{i + 1}-{t('lesson')}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Main Active Lesson Player Card */}
                  {videos[currentLessonIndex] && (
                    !isLessonUnlocked(currentLessonIndex) ? (
                      /* Locked Screen */
                      <div className="seq-active-card seq-locked-card">
                        <div className="seq-locked-screen">
                          <div className="seq-lock-icon">🔒</div>
                          <h3 className="seq-locked-title">{t('lessonLocked')}</h3>
                          <p className="seq-locked-desc">
                            {currentLessonIndex + 1}-{t('lesson')} {t('lessonLockedDesc')}
                          </p>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              let lastUnlocked = 0;
                              for (let k = 0; k < videos.length; k++) {
                                if (isLessonUnlocked(k)) lastUnlocked = k;
                                else break;
                              }
                              setCurrentLessonIndex(lastUnlocked);
                            }}
                            style={{ minWidth: 200 }}
                          >
                            👈 {lastUnlocked + 1}-{t('lesson')} ({t('open')})
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Unlocked Video Card */
                      <div className="seq-active-card">
                        <div className="seq-video-frame">
                          <VideoPlayerFrame
                            url={videos[currentLessonIndex].url}
                            title={videos[currentLessonIndex].title}
                          />
                        </div>

                        <div className="seq-card-body">
                          <div className="seq-meta-bar">
                            <div className="seq-meta-left">
                              <span className="badge badge-green">
                                <i className="ph ph-check-circle"></i> {t('lesson')} {currentLessonIndex + 1}
                              </span>
                              <span className="seq-counter-text">
                                {currentLessonIndex + 1} {t('ofTotal')} {videos.length}
                              </span>
                            </div>

                            <div className="seq-meta-right">
                              {completedVideoIds.has(videos[currentLessonIndex].id) ? (
                                <span className="seq-badge-done">
                                  <i className="ph-fill ph-check-circle"></i> {t('completed')} (+10 XP)
                                </span>
                              ) : (
                                <button
                                  className="seq-btn-complete"
                                  onClick={() => handleCompleteLesson(videos[currentLessonIndex])}
                                >
                                  <i className="ph-bold ph-check"></i> {t('completeLesson')}
                                </button>
                              )}
                            </div>
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
                          <div className="seq-nav-grid">
                            <button
                              className="btn btn-secondary seq-nav-btn"
                              disabled={currentLessonIndex === 0}
                              onClick={() => setCurrentLessonIndex(prev => Math.max(0, prev - 1))}
                            >
                              <i className="ph ph-arrow-left"></i> {t('prevLesson')}
                            </button>

                            {currentLessonIndex < videos.length - 1 ? (
                              <button
                                className="btn btn-primary seq-nav-btn"
                                onClick={handleNextLesson}
                              >
                                {t('nextLesson')} <i className="ph ph-arrow-right"></i>
                              </button>
                            ) : (
                              <button
                                className="btn btn-primary seq-nav-btn"
                                style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}
                                onClick={() => {
                                  handleCompleteLesson(videos[currentLessonIndex]);
                                  setTab('games');
                                }}
                              >
                                {t('goToGames')} <i className="ph ph-game-controller"></i>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
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

        .seq-pill-btn.locked {
          opacity: 0.72;
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #64748b;
          cursor: pointer;
        }

        .seq-pill-btn.locked:hover {
          border-color: #f59e0b;
          background: #fef3c7;
        }

        .seq-pill-btn.completed {
          border-color: #a7f3d0;
          background: #f0fdf4;
        }

        .seq-pill-btn.completed.active {
          background: linear-gradient(135deg, var(--tiffany), var(--tiffany-dark));
          color: #fff;
          border-color: transparent;
        }

        .seq-lock-badge {
          font-size: 0.75rem;
          margin-left: 2px;
        }

        .seq-check-badge {
          font-size: 0.8rem;
          font-weight: 800;
          color: #059669;
          margin-left: 2px;
        }

        .seq-pill-btn.active .seq-check-badge {
          color: #fff;
        }

        .seq-lock-toast {
          position: sticky;
          top: 70px;
          z-index: 99;
          background: linear-gradient(135deg, #d97706, #b45309);
          color: #fff;
          font-weight: 700;
          font-size: 0.95rem;
          padding: 12px 20px;
          border-radius: 14px;
          box-shadow: 0 8px 24px rgba(217, 119, 6, 0.35);
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        /* ── Locked Screen ── */
        .seq-locked-card {
          background: #ffffff;
          padding: 60px 24px;
          text-align: center;
        }

        .seq-locked-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          max-width: 440px;
          margin: 0 auto;
        }

        .seq-lock-icon {
          font-size: 4rem;
          animation: pulse 2s infinite;
        }

        .seq-locked-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .seq-locked-desc {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .seq-active-card {
          background: #ffffff;
          border: 1.5px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        /* ── Video Player & Fullscreen ── */
        .video-player-box {
          position: relative;
          width: 100%;
          background: #000;
          overflow: hidden;
        }

        .video-player-frame {
          width: 100%;
          aspect-ratio: 16/9;
          border: none;
          display: block;
        }

        /* ── Video Controls Bar ── */
        .video-player-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          background: #f8fafc;
          padding: 10px 16px;
          border-bottom: 1.5px solid var(--border);
          flex-wrap: wrap;
        }

        .vdf-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 0.88rem;
          font-weight: 700;
          font-family: inherit;
          padding: 8px 16px;
          border-radius: 10px;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .vdf-fs-btn {
          background: linear-gradient(135deg, var(--tiffany), var(--tiffany-dark));
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(10, 186, 181, 0.25);
        }

        .vdf-fs-btn:hover {
          background: linear-gradient(135deg, var(--tiffany-dark), #0369a1);
          transform: translateY(-1px);
        }

        .vdf-drive-btn {
          background: #ffffff;
          color: #0f766e;
          border: 1.5px solid #ccfbf1;
        }

        .vdf-drive-btn:hover {
          background: #f0fdfa;
          border-color: var(--tiffany);
        }

        /* ── Floating Fullscreen Exit Button ── */
        .vdf-fs-close-btn {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 2147483647;
          background: rgba(0, 0, 0, 0.8);
          color: #fff;
          border: 1.5px solid rgba(255, 255, 255, 0.4);
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          backdrop-filter: blur(8px);
          font-family: inherit;
        }

        /* ── Fullscreen Pseudo State (Standard & WebKit) ── */
        .video-player-box:fullscreen,
        .video-player-box:-webkit-full-screen,
        .video-player-box.is-fullscreen {
          width: 100vw !important;
          height: 100vh !important;
          background: #000000 !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          padding: 0 !important;
          margin: 0 !important;
          border-radius: 0 !important;
          z-index: 2147483646;
        }

        .video-player-box:fullscreen .video-player-frame,
        .video-player-box:-webkit-full-screen .video-player-frame,
        .video-player-box.is-fullscreen .video-player-frame {
          width: 100% !important;
          height: 100% !important;
          max-height: 100vh !important;
          aspect-ratio: auto !important;
          border-radius: 0 !important;
          object-fit: contain;
        }

        .video-player-box:fullscreen .video-player-controls-bar,
        .video-player-box:-webkit-full-screen .video-player-controls-bar,
        .video-player-box.is-fullscreen .video-player-controls-bar {
          display: none !important;
        }

        .video-fallback-play {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          aspect-ratio: 16/9;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: #fff;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s;
        }

        .video-fallback-play:hover {
          background: linear-gradient(135deg, #334155, #1e293b);
        }

        .vfp-icon {
          font-size: 3.5rem;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          margin-bottom: 16px;
          transition: transform 0.2s;
        }

        .video-fallback-play:hover .vfp-icon {
          transform: scale(1.1);
          background: rgba(10, 186, 181, 0.4);
        }

        .vfp-text {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .vfp-sub {
          font-size: 0.85rem;
          opacity: 0.7;
          font-weight: 500;
        }

        /* ── Card Body & Meta Bar ── */
        .seq-card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .seq-meta-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }

        .seq-meta-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .seq-counter-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 700;
        }

        .seq-meta-right {
          display: flex;
          align-items: center;
        }

        .seq-badge-done {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #059669;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 5px 12px;
          border-radius: 100px;
        }

        .seq-btn-complete {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #087f7b;
          background: var(--tiffany-xlight);
          border: 1.5px solid var(--tiffany);
          padding: 6px 14px;
          border-radius: 100px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .seq-btn-complete:hover {
          background: var(--tiffany);
          color: #fff;
        }

        .seq-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.35;
        }

        .seq-description {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* ── Nav Grid ── */
        .seq-nav-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 6px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }

        .seq-nav-btn {
          width: 100%;
          justify-content: center;
          padding: 12px 14px;
          font-size: 0.92rem;
          font-weight: 700;
          border-radius: 12px;
        }

        @media (max-width: 480px) {
          .seq-card-body {
            padding: 16px;
          }
          .seq-title {
            font-size: 1.15rem;
          }
          .seq-nav-btn {
            font-size: 0.85rem;
            padding: 10px 8px;
          }
        }
      `}</style>
    </>
  );
}
