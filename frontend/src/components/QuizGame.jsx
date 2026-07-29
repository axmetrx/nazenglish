import { useState } from 'react';
import confetti from 'canvas-confetti';

export default function QuizGame({ game, onComplete }) {
  const questions = game.data.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[currentIndex];

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const isEnglish = /[a-zA-Z]/.test(text);
        utterance.lang = isEnglish ? 'en-US' : 'ru-RU';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      } catch (e) {}
    }
  };

  const handleAnswer = (optionIndex) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);

    speakText(current.options[optionIndex]);

    const isCorrect = optionIndex === current.answer;
    if (isCorrect) setCorrectCount(c => c + 1);

    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        setFinished(true);
        const total = questions.length;
        const correct = isCorrect ? correctCount + 1 : correctCount;
        const xp = Math.round((correct / total) * 20);
        confetti({ particleCount: correct === total ? 200 : 80, spread: 70, origin: { y: 0.6 } });
        onComplete(xp);
      } else {
        setCurrentIndex(i => i + 1);
        setSelectedOption(null);
      }
    }, 1200);
  };

  if (finished) {
    const pct = Math.round((correctCount / questions.length) * 100);
    const xp = Math.round((correctCount / questions.length) * 20);
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>
          {pct === 100 ? '🏆' : pct >= 60 ? '👍' : '💪'}
        </div>
        <h2 style={{ color: 'var(--tiffany-dark)', marginBottom: 8 }}>
          {pct === 100 ? 'Идеально!' : pct >= 60 ? 'Хорошая работа!' : 'Не сдавайся!'}
        </h2>
        <p style={{ marginBottom: 8 }}>Правильных ответов: <strong>{correctCount} из {questions.length}</strong></p>
        <p style={{ marginBottom: 20, color: 'var(--text-muted)' }}>{pct}% верных ответов</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--tiffany-xlight)', border: '1px solid var(--border)', borderRadius: 100, padding: '8px 20px', fontWeight: 700, color: 'var(--tiffany-dark)', fontSize: '1.1rem' }}>
          <i className="ph-fill ph-star"></i> +{xp} XP получено!
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* Progress bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
            Вопрос {currentIndex + 1} из {questions.length}
          </span>
          <span style={{ color: 'var(--tiffany)', fontWeight: 600 }}>
            ✅ {correctCount} правильно
          </span>
        </div>
        <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 100, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${((currentIndex) / questions.length) * 100}%`,
            background: 'linear-gradient(90deg, var(--tiffany), var(--tiffany-dark))',
            borderRadius: 100,
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Question */}
      <div style={{
        background: 'linear-gradient(135deg, var(--tiffany) 0%, var(--tiffany-dark) 100%)',
        borderRadius: 16,
        padding: '28px 32px',
        marginBottom: 24,
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(10,186,181,0.25)',
        position: 'relative',
      }}>
        <button
          onClick={() => speakText(current.question)}
          style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '1.1rem', cursor: 'pointer'
          }}
          title="Прослушать вопрос"
        >
          <i className="ph-fill ph-speaker-high"></i>
        </button>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: 8, fontWeight: 500 }}>
          ВОПРОС
        </div>
        <h2 style={{ color: '#fff', fontSize: '1.4rem', lineHeight: 1.4 }}>{current.question}</h2>
      </div>

      {/* Options */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {current.options.map((option, i) => {
          let bg = 'var(--bg-secondary)';
          let border = 'var(--border)';
          let color = 'var(--text-primary)';
          let icon = null;

          if (selectedOption !== null) {
            if (i === current.answer) {
              bg = 'var(--success-light)';
              border = 'var(--success)';
              color = 'var(--success)';
              icon = '✅';
            } else if (i === selectedOption) {
              bg = 'var(--danger-light)';
              border = 'var(--danger)';
              color = 'var(--danger)';
              icon = '❌';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selectedOption !== null}
              style={{
                padding: '16px 20px',
                borderRadius: 12,
                border: `2px solid ${border}`,
                background: bg,
                color: color,
                fontSize: '1rem',
                fontWeight: 500,
                fontFamily: 'inherit',
                cursor: selectedOption !== null ? 'default' : 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.2s',
                boxShadow: selectedOption === null ? 'var(--shadow-sm)' : 'none',
              }}
              onMouseEnter={e => {
                if (selectedOption === null) {
                  e.currentTarget.style.borderColor = 'var(--tiffany)';
                  e.currentTarget.style.background = 'var(--tiffany-xlight)';
                }
              }}
              onMouseLeave={e => {
                if (selectedOption === null) {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                }
              }}
            >
              <span style={{
                width: 28, height: 28,
                borderRadius: '50%',
                background: selectedOption === null ? 'var(--tiffany-xlight)' : 'transparent',
                border: selectedOption === null ? '1px solid var(--border)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 700, color: 'var(--tiffany-dark)',
                flexShrink: 0
              }}>
                {icon || String.fromCharCode(65 + i)}
              </span>
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
