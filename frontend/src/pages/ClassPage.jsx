import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { classesAPI, videosAPI, studentsAPI, gamesAPI, dictionaryAPI } from '../api/api';
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
  const [dictionaryWords, setDictionaryWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('videos'); // 'videos' | 'games' | 'dictionary' | 'students'

  const [showAddVideo, setShowAddVideo] = useState(false);
  const [editVideo, setEditVideo] = useState(null);
  const [videoForm, setVideoForm] = useState({ title: '', description: '', url: '' });
  
  const [showAddGame, setShowAddGame] = useState(false);
  const [editGame, setEditGame] = useState(null);
  const [gameCategoryFilter, setGameCategoryFilter] = useState('all');

  // Dictionary state
  const [dictSearch, setDictSearch] = useState('');
  const [dictCategoryFilter, setDictCategoryFilter] = useState('all');
  const [showAddWord, setShowAddWord] = useState(false);
  const [editWord, setEditWord] = useState(null);
  const [wordForm, setWordForm] = useState({ word: '', translation: '', category: 'Жалпы / Общий', example: '' });
  const [syncingDict, setSyncingDict] = useState(false);

  const GAME_CATEGORIES = [
    { type: 'all', label: 'Бардыгы / Все', icon: '✨' },
    { type: 'match_pairs', label: 'Найди пару', icon: '🃏' },
    { type: 'anagram', label: 'Анаграмма', icon: '🔤' },
    { type: 'quiz', label: 'Тест / Квиз', icon: '📖' },
    { type: 'pronunciation', label: 'Произношение', icon: '🎤' },
  ];

  const [gameForm, setGameForm] = useState({
    title: '',
    gameType: 'match_pairs',
    pairs: [{ word: '', translation: '' }],
    words: [{ word: '', translation: '' }],
    questions: [{ question: '', options: ['', '', '', ''], answer: 0 }],
  });

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
      const [clsRes, vidRes, stuRes, gamRes, dictRes] = await Promise.all([
        classesAPI.getOne(id),
        videosAPI.getByClass(id),
        studentsAPI.getByClass(id),
        gamesAPI.getByClass(id),
        dictionaryAPI.getByClass(id).catch(() => ({ data: [] })),
      ]);
      setCls(clsRes.data);
      setVideos(vidRes.data);
      setStudents(stuRes.data);
      setGames(gamRes.data);
      setDictionaryWords(dictRes.data || []);
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

  const openAddGame = (defaultType = 'match_pairs') => {
    setEditGame(null);
    const selectedType = defaultType !== 'all' ? defaultType : 'match_pairs';
    setGameForm({
      title: '',
      gameType: selectedType,
      pairs: [{ word: '', translation: '' }],
      words: [{ word: '', translation: '' }],
      questions: [{ question: '', options: ['', '', '', ''], answer: 0 }],
    });
    setError('');
    setShowAddGame(true);
  };

  const openEditGame = (game) => {
    setEditGame(game);
    const normalizedWords = (game.data?.words || []).map(w =>
      typeof w === 'string' ? { word: w, translation: '' } : { word: w.word || '', translation: w.translation || '' }
    );
    setGameForm({
      title: game.title || '',
      gameType: game.type || 'match_pairs',
      pairs: game.data?.pairs?.length ? game.data.pairs : [{ word: '', translation: '' }],
      words: normalizedWords.length ? normalizedWords : [{ word: '', translation: '' }],
      questions: game.data?.questions?.length ? game.data.questions : [{ question: '', options: ['', '', '', ''], answer: 0 }],
    });
    setError('');
    setShowAddGame(true);
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
    if (!gameForm.title.trim()) { setError('Введите название игры'); return; }
    setSaving(true);
    setError('');
    try {
      let data;
      const type = gameForm.gameType;
      if (type === 'match_pairs') {
        if (gameForm.pairs.some(p => !p.word.trim() || !p.translation.trim())) {
          setError('Заполните все пары слов (слово и перевод)'); setSaving(false); return;
        }
        data = { pairs: gameForm.pairs.map(p => ({ word: p.word.trim(), translation: p.translation.trim() })) };
      } else if (type === 'anagram' || type === 'pronunciation') {
        const validWords = gameForm.words
          .map(w => typeof w === 'string' ? { word: w.trim(), translation: '' } : { word: (w.word || '').trim(), translation: (w.translation || '').trim() })
          .filter(w => w.word);

        if (validWords.length === 0) {
          setError('Добавьте хотя бы одно слово'); setSaving(false); return;
        }
        data = { words: validWords };
      } else if (type === 'quiz') {
        const qs = gameForm.questions;
        if (qs.some(q => !q.question.trim() || q.options.some(o => !o.trim()))) {
          setError('Заполните все вопросы и варианты ответов'); setSaving(false); return;
        }
        data = { questions: qs };
      }

      if (editGame) {
        await gamesAPI.update(editGame.id, { title: gameForm.title.trim(), type, data });
      } else {
        await gamesAPI.create(id, { title: gameForm.title.trim(), type, data });
      }
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

  const speakWord = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const openAddWord = () => {
    setEditWord(null);
    setWordForm({ word: '', translation: '', category: 'Жалпы / Общий', example: '' });
    setError('');
    setShowAddWord(true);
  };

  const openEditWord = (w) => {
    setEditWord(w);
    setWordForm({
      word: w.word || '',
      translation: w.translation || '',
      category: w.category || 'Жалпы / Общий',
      example: w.example || ''
    });
    setError('');
    setShowAddWord(true);
  };

  const handleSaveWord = async (e) => {
    e.preventDefault();
    if (!wordForm.word.trim() || !wordForm.translation.trim()) {
      setError('Заполните слово и перевод');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editWord) {
        await dictionaryAPI.update(editWord.id, wordForm);
      } else {
        await dictionaryAPI.create(id, wordForm);
      }
      setShowAddWord(false);
      loadAll(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при сохранении слова');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWord = async (wordId) => {
    if (!window.confirm('Точно удалить это слово из словаря?')) return;
    try {
      await dictionaryAPI.delete(wordId);
      loadAll(true);
    } catch (err) {
      alert('Ошибка при удалении слова');
    }
  };

  const handleSyncDictionaryFromGames = async () => {
    setSyncingDict(true);
    try {
      const res = await dictionaryAPI.syncFromGames(id);
      loadAll(true);
      alert(`Успешно синхронизировано! В словаре теперь ${res.data.count} слов.`);
    } catch (err) {
      alert('Ошибка при синхронизации слов из игр');
    } finally {
      setSyncingDict(false);
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
            <button className={`tab ${tab === 'dictionary' ? 'active' : ''}`} onClick={() => setTab('dictionary')}>
              <i className="ph ph-book-open"></i> Словарь <span className="badge" style={{ marginLeft: 6, padding: '2px 8px', fontSize: '0.75rem', background: '#ccfbf1', color: '#0f766e', fontWeight: 700 }}>{dictionaryWords.length}</span>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2>Интерактивные игры</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 4 }}>
                    Всего игр: <strong>{games.length}</strong> • Выберите категорию для удобной фильтрации
                  </p>
                </div>
                <button className="btn btn-primary" onClick={() => openAddGame(gameCategoryFilter)}>
                  <i className="ph ph-plus"></i> Создать игру
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="game-category-filter-bar">
                {GAME_CATEGORIES.map(cat => {
                  const count = cat.type === 'all' ? games.length : games.filter(g => g.type === cat.type).length;
                  const active = gameCategoryFilter === cat.type;
                  return (
                    <button
                      key={cat.type}
                      type="button"
                      className={`game-cat-pill ${active ? 'active' : ''}`}
                      onClick={() => setGameCategoryFilter(cat.type)}
                    >
                      <span className="gcp-icon">{cat.icon}</span>
                      <span className="gcp-label">{cat.label}</span>
                      <span className="gcp-count">{count}</span>
                    </button>
                  );
                })}
              </div>

              {(() => {
                const filteredGames = gameCategoryFilter === 'all'
                  ? games
                  : games.filter(g => g.type === gameCategoryFilter);

                if (filteredGames.length === 0) {
                  const activeCatObj = GAME_CATEGORIES.find(c => c.type === gameCategoryFilter);
                  return (
                    <div className="empty-state">
                      <div className="empty-state-icon"><i className="ph ph-game-controller"></i></div>
                      <h3>{gameCategoryFilter === 'all' ? 'Нет игр' : `В категории "${activeCatObj?.label}" пока нет игр`}</h3>
                      <p>
                        {gameCategoryFilter === 'all'
                          ? 'Создайте игру, чтобы ученики могли зарабатывать баллы!'
                          : `Создайте первую игру в разделе "${activeCatObj?.label}"`}
                      </p>
                      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => openAddGame(gameCategoryFilter)}>
                        <i className="ph ph-plus"></i> Создать {activeCatObj?.label || 'игру'}
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid-3">
                    {filteredGames.map(game => {
                      const typeLabels = {
                        match_pairs: { label: '🃏 Найди пару', xp: '15 XP', info: `${game.data.pairs?.length || 0} пар` },
                        anagram:     { label: '🔤 Анаграмма', xp: '10 XP', info: `${game.data.words?.length || 0} слов` },
                        quiz:        { label: '📖 Тест/Квиз', xp: '20 XP', info: `${game.data.questions?.length || 0} вопросов` },
                        pronunciation: { label: '🎤 Произношение', xp: '25 XP', info: `${game.data.words?.length || 0} слов` },
                      };
                      const info = typeLabels[game.type] || { label: '🎮 Игра', xp: '?', info: '' };

                      // Preview snippets of words and translations
                      let previewTags = [];
                      if (game.type === 'match_pairs') {
                        previewTags = (game.data.pairs || []).slice(0, 3).map(p => `${p.word} → ${p.translation}`);
                      } else if (game.type === 'anagram' || game.type === 'pronunciation') {
                        previewTags = (game.data.words || []).slice(0, 3).map(w =>
                          typeof w === 'object' ? `${w.word}${w.translation ? ` (${w.translation})` : ''}` : w
                        );
                      } else if (game.type === 'quiz') {
                        previewTags = (game.data.questions || []).slice(0, 2).map(q => q.question);
                      }

                      return (
                        <div key={game.id} className="card slide-up game-admin-card" style={{ padding: 20 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                                <span className="badge badge-purple">{info.label}</span>
                                <span style={{ fontSize: '0.78rem', color: 'var(--tiffany)', fontWeight: 700 }}>+{info.xp}</span>
                              </div>

                              <h3 style={{ fontSize: '1.08rem', marginBottom: 6, lineHeight: 1.35, wordBreak: 'break-word' }}>
                                {game.title}
                              </h3>

                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', fontWeight: 600, marginBottom: 8 }}>
                                📊 {info.info}
                              </p>

                              {/* Word tags preview */}
                              {previewTags.length > 0 && (
                                <div className="game-preview-tags">
                                  {previewTags.map((tag, pi) => (
                                    <span key={pi} className="game-preview-tag" title={tag}>
                                      {tag}
                                    </span>
                                  ))}
                                  {(game.data?.pairs?.length > 3 || game.data?.words?.length > 3 || game.data?.questions?.length > 2) && (
                                    <span className="game-preview-tag-more">+ещё</span>
                                  )}
                                </div>
                              )}
                            </div>

                            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                              <button
                                className="btn btn-icon btn-secondary"
                                title="Редактировать игру"
                                onClick={() => openEditGame(game)}
                              >
                                <i className="ph ph-pencil-simple"></i>
                              </button>
                              <button
                                className="btn btn-icon"
                                style={{ color: 'var(--danger)' }}
                                title="Удалить игру"
                                onClick={() => handleDeleteGame(game.id)}
                              >
                                <i className="ph ph-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Dictionary Tab */}
          {tab === 'dictionary' && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2>Словарь класса (Сөздүк)</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 4 }}>
                    Всего слов: <strong>{dictionaryWords.length}</strong> • Ученики могут учить новые слова и слушать правильное произношение
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleSyncDictionaryFromGames}
                    disabled={syncingDict}
                    title="Автоматически добавить все слова из игр этого класса"
                  >
                    <i className="ph ph-arrows-clockwise"></i> {syncingDict ? 'Синхронизация...' : 'Синхронизировать из игр'}
                  </button>
                  <button type="button" className="btn btn-primary" onClick={openAddWord}>
                    <i className="ph ph-plus"></i> Добавить слово
                  </button>
                </div>
              </div>

              {/* Search & Topic Filters */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="🔍 Поиск слова или перевода..."
                    value={dictSearch}
                    onChange={(e) => setDictSearch(e.target.value)}
                  />
                  {dictSearch && (
                    <button
                      type="button"
                      onClick={() => setDictSearch('')}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category selector */}
                {(() => {
                  const uniqueCategories = ['all', ...Array.from(new Set(dictionaryWords.map(w => w.category || 'Жалпы / Общий')))];
                  return (
                    <select
                      className="form-input"
                      value={dictCategoryFilter}
                      onChange={(e) => setDictCategoryFilter(e.target.value)}
                      style={{ width: 'auto', minWidth: 180, fontWeight: 600 }}
                    >
                      <option value="all">✨ Все категории ({dictionaryWords.length})</option>
                      {uniqueCategories.filter(c => c !== 'all').map(cat => {
                        const count = dictionaryWords.filter(w => (w.category || 'Жалпы / Общий') === cat).length;
                        return (
                          <option key={cat} value={cat}>
                            📁 {cat} ({count})
                          </option>
                        );
                      })}
                    </select>
                  );
                })()}
              </div>

              {(() => {
                const q = dictSearch.toLowerCase().trim();
                const filtered = dictionaryWords.filter(w => {
                  const matchCat = dictCategoryFilter === 'all' || (w.category || 'Жалпы / Общий') === dictCategoryFilter;
                  const matchSearch = !q || (w.word || '').toLowerCase().includes(q) || (w.translation || '').toLowerCase().includes(q);
                  return matchCat && matchSearch;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="empty-state">
                      <div className="empty-state-icon"><i className="ph ph-book-open"></i></div>
                      <h3>{dictionaryWords.length === 0 ? 'В словаре пока нет слов' : 'Ничего не найдено'}</h3>
                      <p>
                        {dictionaryWords.length === 0
                          ? 'Добавьте первые слова или синхронизируйте их в 1 клик из интерактивных игр!'
                          : 'Попробуйте изменить поисковый запрос или категорию'}
                      </p>
                      {dictionaryWords.length === 0 && (
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
                          <button className="btn btn-primary" onClick={handleSyncDictionaryFromGames}>
                            <i className="ph ph-arrows-clockwise"></i> Загрузить слова из игр
                          </button>
                          <button className="btn btn-secondary" onClick={openAddWord}>
                            <i className="ph ph-plus"></i> Добавить вручную
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="grid-3">
                    {filtered.map(w => (
                      <div key={w.id} className="card slide-up word-card" style={{ padding: '18px 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                                {w.word}
                              </h3>
                              <button
                                type="button"
                                className="word-speaker-btn"
                                onClick={() => speakWord(w.word)}
                                title="Послушать произношение"
                              >
                                🔊
                              </button>
                            </div>

                            <div style={{ fontSize: '1.02rem', fontWeight: 600, color: 'var(--tiffany-dark)', marginBottom: 8 }}>
                              {w.translation}
                            </div>

                            {w.example && (
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: 8 }}>
                                💬 "{w.example}"
                              </div>
                            )}

                            <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                              📁 {w.category || 'Жалпы / Общий'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                            <button
                              className="btn btn-icon btn-secondary"
                              title="Редактировать"
                              onClick={() => openEditWord(w)}
                            >
                              <i className="ph ph-pencil-simple"></i>
                            </button>
                            <button
                              className="btn btn-icon"
                              style={{ color: 'var(--danger)' }}
                              title="Удалить"
                              onClick={() => handleDeleteWord(w.id)}
                            >
                              <i className="ph ph-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
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
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 620, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="ph ph-game-controller"></i> {editGame ? 'Редактировать игру' : 'Создать игру'}
              </h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAddGame(false)}><i className="ph ph-x"></i></button>
            </div>
            <form onSubmit={handleSaveGame}>
              {/* Title */}
              <div className="form-group">
                <label className="form-label">Название игры *</label>
                <input className="form-input" value={gameForm.title}
                  onChange={(e) => setGameForm({ ...gameForm, title: e.target.value })}
                  placeholder="Например: Животные" />
              </div>

              {/* Game Type Selector */}
              <div className="form-group">
                <label className="form-label">Тип игры</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { value: 'match_pairs', icon: '🃏', label: 'Найди пару', desc: '+15 XP', hint: 'Слово + перевод' },
                    { value: 'anagram', icon: '🔤', label: 'Анаграмма', desc: '+10 XP', hint: 'Собери слово из букв' },
                    { value: 'quiz', icon: '📖', label: 'Тест/Квиз', desc: '+20 XP', hint: 'Вопросы с вариантами' },
                    { value: 'pronunciation', icon: '🎤', label: 'Произношение', desc: '+25 XP', hint: 'Говори в микрофон' },
                  ].map(t => (
                    <div key={t.value} onClick={() => setGameForm({ ...gameForm, gameType: t.value })}
                      style={{
                        padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                        border: `2px solid ${gameForm.gameType === t.value ? 'var(--tiffany)' : 'var(--border)'}`,
                        background: gameForm.gameType === t.value ? 'var(--tiffany-xlight)' : 'var(--bg-secondary)',
                        transition: 'all 0.2s',
                      }}>
                      <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{t.icon}</div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: gameForm.gameType === t.value ? 'var(--tiffany-dark)' : 'var(--text-primary)' }}>{t.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--tiffany)', fontWeight: 600 }}>{t.desc}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.hint}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Match Pairs form */}
              {gameForm.gameType === 'match_pairs' && (
                <div>
                  <div className="form-label" style={{ marginBottom: 12 }}>Пары слов (Английский — Русский)</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                    {gameForm.pairs.map((pair, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <input className="form-input" placeholder="Apple" value={pair.word}
                          onChange={(e) => { const p = [...gameForm.pairs]; p[idx].word = e.target.value; setGameForm({ ...gameForm, pairs: p }); }}
                          style={{ flex: 1 }} />
                        <input className="form-input" placeholder="Яблоко" value={pair.translation}
                          onChange={(e) => { const p = [...gameForm.pairs]; p[idx].translation = e.target.value; setGameForm({ ...gameForm, pairs: p }); }}
                          style={{ flex: 1 }} />
                        <button type="button" className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}
                          onClick={() => setGameForm({ ...gameForm, pairs: gameForm.pairs.filter((_, i) => i !== idx) })}
                          disabled={gameForm.pairs.length === 1}>
                          <i className="ph ph-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="btn btn-secondary btn-sm"
                    onClick={() => setGameForm({ ...gameForm, pairs: [...gameForm.pairs, { word: '', translation: '' }] })}>
                    <i className="ph ph-plus"></i> Добавить пару
                  </button>
                </div>
              )}

              {/* Anagram / Pronunciation form with Word + Translation inputs */}
              {(gameForm.gameType === 'anagram' || gameForm.gameType === 'pronunciation') && (
                <div>
                  <div className="form-label" style={{ marginBottom: 6 }}>
                    {gameForm.gameType === 'anagram' ? 'Слова для анаграммы (Английский — Перевод)' : 'Слова для произношения (Английский — Перевод)'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                    💡 Добавьте перевод рядом со словом, чтобы новичкам было легко учиться
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                    {gameForm.words.map((item, idx) => {
                      const wordVal = typeof item === 'object' ? (item.word || '') : (item || '');
                      const transVal = typeof item === 'object' ? (item.translation || '') : '';
                      return (
                        <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <input
                            className="form-input"
                            placeholder="Apple (английский)"
                            value={wordVal}
                            onChange={(e) => {
                              const w = [...gameForm.words];
                              w[idx] = { word: e.target.value, translation: transVal };
                              setGameForm({ ...gameForm, words: w });
                            }}
                            style={{ flex: 1 }}
                          />
                          <input
                            className="form-input"
                            placeholder="Алма / Яблоко (перевод)"
                            value={transVal}
                            onChange={(e) => {
                              const w = [...gameForm.words];
                              w[idx] = { word: wordVal, translation: e.target.value };
                              setGameForm({ ...gameForm, words: w });
                            }}
                            style={{ flex: 1 }}
                          />
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--danger)' }}
                            onClick={() => setGameForm({ ...gameForm, words: gameForm.words.filter((_, i) => i !== idx) })}
                            disabled={gameForm.words.length === 1}
                          >
                            <i className="ph ph-trash"></i>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setGameForm({ ...gameForm, words: [...gameForm.words, { word: '', translation: '' }] })}
                  >
                    <i className="ph ph-plus"></i> Добавить слово
                  </button>
                </div>
              )}

              {/* Quiz form */}
              {gameForm.gameType === 'quiz' && (
                <div>
                  <div className="form-label" style={{ marginBottom: 12 }}>Вопросы и варианты ответов</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 16 }}>
                    {gameForm.questions.map((q, qi) => (
                      <div key={qi} style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 12, border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Вопрос {qi + 1}</span>
                          {gameForm.questions.length > 1 && (
                            <button type="button" className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}
                              onClick={() => setGameForm({ ...gameForm, questions: gameForm.questions.filter((_, i) => i !== qi) })}>
                              <i className="ph ph-trash"></i>
                            </button>
                          )}
                        </div>
                        <input className="form-input" placeholder="Как переводится 'кот'?" value={q.question}
                          onChange={(e) => { const qs = [...gameForm.questions]; qs[qi].question = e.target.value; setGameForm({ ...gameForm, questions: qs }); }}
                          style={{ marginBottom: 10 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {q.options.map((opt, oi) => (
                            <div key={oi} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <input type="radio" name={`answer-${qi}`} checked={q.answer === oi}
                                onChange={() => { const qs = [...gameForm.questions]; qs[qi].answer = oi; setGameForm({ ...gameForm, questions: qs }); }}
                                style={{ accentColor: 'var(--tiffany)', width: 16, height: 16, flexShrink: 0 }} />
                              <input className="form-input" placeholder={`Вариант ${String.fromCharCode(65 + oi)}`} value={opt}
                                onChange={(e) => { const qs = [...gameForm.questions]; qs[qi].options[oi] = e.target.value; setGameForm({ ...gameForm, questions: qs }); }}
                                style={{ flex: 1 }} />
                            </div>
                          ))}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8 }}>☝️ Выберите правильный ответ (кружок слева)</div>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="btn btn-secondary btn-sm"
                    onClick={() => setGameForm({ ...gameForm, questions: [...gameForm.questions, { question: '', options: ['', '', '', ''], answer: 0 }] })}>
                    <i className="ph ph-plus"></i> Добавить вопрос
                  </button>
                </div>
              )}

              {error && <div className="alert alert-error" style={{ marginTop: 16 }}>{error}</div>}

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button type="button" className="btn btn-secondary btn-full" onClick={() => setShowAddGame(false)}>Отмена</button>
                <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
                  {saving ? 'Сохранение...' : editGame ? <><i className="ph ph-floppy-disk"></i> Сохранить изменения</> : <><i className="ph ph-game-controller"></i> Создать игру</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Dictionary Word Modal */}
      {showAddWord && (
        <div className="modal-overlay" onClick={() => setShowAddWord(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editWord ? <><i className="ph ph-pencil-simple"></i> Редактировать слово</> : <><i className="ph ph-book-open"></i> Добавить слово в словарь</>}
              </h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAddWord(false)}><i className="ph ph-x"></i></button>
            </div>
            <form onSubmit={handleSaveWord} className="modal-form">
              <div className="form-group">
                <label className="form-label">Английское слово (English) *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="form-input"
                    placeholder="Например: Apple"
                    value={wordForm.word}
                    onChange={(e) => setWordForm({ ...wordForm, word: e.target.value })}
                    required
                    autoFocus
                    style={{ flex: 1 }}
                  />
                  {wordForm.word && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => speakWord(wordForm.word)}
                      title="Проверить звучание"
                    >
                      🔊
                    </button>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Перевод (Кыргызча / Русский) *</label>
                <input
                  className="form-input"
                  placeholder="Например: Алма / Яблоко"
                  value={wordForm.translation}
                  onChange={(e) => setWordForm({ ...wordForm, translation: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Категория / Тема</label>
                <input
                  className="form-input"
                  placeholder="Например: Тамак-аш / Food, Үй-бүлө / Family"
                  value={wordForm.category}
                  onChange={(e) => setWordForm({ ...wordForm, category: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Пример предложения (необязательно)</label>
                <input
                  className="form-input"
                  placeholder="Например: I like to eat a fresh red apple."
                  value={wordForm.example}
                  onChange={(e) => setWordForm({ ...wordForm, example: e.target.value })}
                />
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button type="button" className="btn btn-secondary btn-full" onClick={() => setShowAddWord(false)}>
                  Отмена
                </button>
                <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
                  {saving ? 'Сохранение...' : editWord ? 'Сохранить изменения' : 'Добавить слово'}
                </button>
              </div>
            </form>
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

        /* ── Word Cards & Speaker Button ── */
        .word-card {
          border: 1.5px solid var(--border);
          transition: all 0.2s ease;
        }

        .word-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(10, 186, 181, 0.12);
          border-color: var(--tiffany);
        }

        .word-speaker-btn {
          border: none;
          background: #f0fdfa;
          border: 1px solid #ccfbf1;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .word-speaker-btn:hover {
          transform: scale(1.15);
          background: #ccfbf1;
        }

        /* ── Game Category Filter Bar ── */
        .game-category-filter-bar {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 10px;
          margin-bottom: 24px;
          scrollbar-width: thin;
        }

        .game-cat-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 100px;
          background: #ffffff;
          border: 1.5px solid var(--border);
          color: var(--text-secondary);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          white-space: nowrap;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .game-cat-pill:hover {
          border-color: var(--tiffany);
          background: var(--tiffany-xlight);
          color: var(--tiffany-dark);
        }

        .game-cat-pill.active {
          background: linear-gradient(135deg, var(--tiffany), var(--tiffany-dark));
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 4px 14px rgba(10, 186, 181, 0.3);
        }

        .game-cat-pill.active .gcp-count {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        .gcp-count {
          font-size: 0.78rem;
          background: #f1f5f9;
          color: #64748b;
          padding: 2px 8px;
          border-radius: 100px;
          font-weight: 800;
        }

        /* ── Game Admin Cards & Preview Tags ── */
        .game-admin-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: 1.5px solid var(--border);
        }

        .game-admin-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(10, 186, 181, 0.12);
        }

        .game-preview-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
        }

        .game-preview-tag {
          font-size: 0.78rem;
          font-weight: 600;
          color: #0f766e;
          background: #f0fdfa;
          border: 1px solid #ccfbf1;
          padding: 2px 8px;
          border-radius: 6px;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .game-preview-tag-more {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          background: var(--bg-tertiary);
          padding: 2px 6px;
          border-radius: 6px;
        }
      `}</style>
    </>
  );
}
