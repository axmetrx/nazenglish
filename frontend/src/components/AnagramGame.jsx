import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

function shuffleLetters(word) {
  const letters = word.toUpperCase().split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  // Make sure it's not the same as the original
  if (letters.join('') === word.toUpperCase()) {
    [letters[0], letters[1]] = [letters[1], letters[0]];
  }
  return letters;
}

export default function AnagramGame({ game, onComplete }) {
  const words = game.data.words || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [letters, setLetters] = useState([]);
  const [selected, setSelected] = useState([]); // { letter, sourceIndex }
  const [status, setStatus] = useState('playing'); // 'playing' | 'correct' | 'wrong'
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (words.length > 0) {
      resetWord(currentIndex);
    }
  }, [currentIndex]);

  const resetWord = (idx) => {
    const word = words[idx];
    const shuffled = shuffleLetters(word);
    setLetters(shuffled.map((l, i) => ({ letter: l, used: false, id: i })));
    setSelected([]);
    setStatus('playing');
  };

  const handleLetterClick = (letterObj) => {
    if (status !== 'playing' || letterObj.used) return;
    const newSelected = [...selected, letterObj];
    const newLetters = letters.map(l =>
      l.id === letterObj.id ? { ...l, used: true } : l
    );
    setLetters(newLetters);
    setSelected(newSelected);

    // Check if word is complete
    const currentWord = words[currentIndex].toUpperCase();
    const attempt = newSelected.map(s => s.letter).join('');
    if (attempt.length === currentWord.length) {
      if (attempt === currentWord) {
        setStatus('correct');
        setScore(s => s + 1);
        setTimeout(() => {
          if (currentIndex + 1 >= words.length) {
            setFinished(true);
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            onComplete(10);
          } else {
            setCurrentIndex(i => i + 1);
          }
        }, 1000);
      } else {
        setStatus('wrong');
        setTimeout(() => {
          resetWord(currentIndex);
        }, 1000);
      }
    }
  };

  const handleUnselect = (idx) => {
    if (status !== 'playing') return;
    const removed = selected[idx];
    const newSelected = selected.filter((_, i) => i !== idx);
    const newLetters = letters.map(l =>
      l.id === removed.id ? { ...l, used: false } : l
    );
    setLetters(newLetters);
    setSelected(newSelected);
  };

  if (finished) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎉</div>
        <h2 style={{ color: 'var(--tiffany-dark)', marginBottom: 8 }}>Отлично!</h2>
        <p style={{ marginBottom: 16 }}>Вы угадали {score} из {words.length} слов!</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--tiffany-xlight)', border: '1px solid var(--border)', borderRadius: 100, padding: '8px 20px', fontWeight: 700, color: 'var(--tiffany-dark)', fontSize: '1.1rem' }}>
          <i className="ph-fill ph-star"></i> +10 XP получено!
        </div>
      </div>
    );
  }

  const currentWord = words[currentIndex] || '';
  const wordLength = currentWord.length;

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
          Слово {currentIndex + 1} из {words.length}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {words.map((_, i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              background: i < currentIndex ? 'var(--tiffany)' : i === currentIndex ? 'var(--tiffany-dark)' : 'var(--border)'
            }} />
          ))}
        </div>
      </div>

      {/* Answer slots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {Array.from({ length: wordLength }).map((_, i) => (
          <div
            key={i}
            onClick={() => selected[i] && handleUnselect(i)}
            style={{
              width: 52, height: 56,
              border: `2px solid ${status === 'correct' ? 'var(--success)' : status === 'wrong' ? 'var(--danger)' : selected[i] ? 'var(--tiffany)' : 'var(--border)'}`,
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', fontWeight: 700,
              color: status === 'correct' ? 'var(--success)' : status === 'wrong' ? 'var(--danger)' : 'var(--text-primary)',
              background: status === 'correct' ? 'var(--success-light)' : status === 'wrong' ? 'var(--danger-light)' : selected[i] ? 'var(--tiffany-xlight)' : 'var(--bg-secondary)',
              cursor: selected[i] ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}
          >
            {selected[i]?.letter || ''}
          </div>
        ))}
      </div>

      {/* Status message */}
      {status === 'correct' && (
        <div style={{ textAlign: 'center', color: 'var(--success)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 16 }}>✅ Правильно!</div>
      )}
      {status === 'wrong' && (
        <div style={{ textAlign: 'center', color: 'var(--danger)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 16 }}>❌ Не верно, попробуй снова!</div>
      )}

      {/* Shuffled letters */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
        {letters.map((letterObj) => (
          <button
            key={letterObj.id}
            onClick={() => handleLetterClick(letterObj)}
            disabled={letterObj.used || status !== 'playing'}
            style={{
              width: 52, height: 56,
              borderRadius: 10,
              border: '2px solid var(--border)',
              background: letterObj.used ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
              color: letterObj.used ? 'var(--text-muted)' : 'var(--text-primary)',
              fontSize: '1.4rem', fontWeight: 700,
              cursor: letterObj.used ? 'default' : 'pointer',
              transition: 'all 0.15s',
              transform: letterObj.used ? 'scale(0.95)' : 'scale(1)',
              boxShadow: letterObj.used ? 'none' : 'var(--shadow)',
            }}
          >
            {letterObj.letter}
          </button>
        ))}
      </div>

      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 20 }}>
        Нажмите на буквы, чтобы собрать слово. Нажмите на собранную букву, чтобы убрать её.
      </p>
    </div>
  );
}
