import { useState, useRef } from 'react';
import confetti from 'canvas-confetti';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function PronunciationGame({ game, onComplete }) {
  const words = game.data.words || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState('idle'); // 'idle' | 'listening' | 'correct' | 'wrong'
  const [heard, setHeard] = useState('');
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  const supported = !!SpeechRecognition;

  const currentWord = words[currentIndex] || '';

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      } catch (e) {}
    }
  };

  const startListening = () => {
    if (!supported) {
      setError('Ваш браузер не поддерживает распознавание речи. Используйте Chrome или Edge.');
      return;
    }

    setStatus('listening');
    setHeard('');
    setError('');

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const results = Array.from(event.results[0]).map(r => r.transcript.toLowerCase().trim());
      const target = currentWord.toLowerCase().trim();
      const isCorrect = results.some(r => r === target || r.includes(target));
      
      setHeard(results[0]);
      setStatus(isCorrect ? 'correct' : 'wrong');

      if (isCorrect) {
        speakText(currentWord);
        setScore(s => s + 1);
        setTimeout(() => {
          if (currentIndex + 1 >= words.length) {
            setFinished(true);
            confetti({ particleCount: 180, spread: 70, origin: { y: 0.6 } });
            onComplete(25);
          } else {
            setCurrentIndex(i => i + 1);
            setStatus('idle');
            setHeard('');
          }
        }, 1200);
      } else {
        setTimeout(() => {
          setStatus('idle');
          setHeard('');
        }, 2000);
      }
    };

    recognition.onerror = (event) => {
      setStatus('idle');
      if (event.error === 'no-speech') {
        setError('Не услышали вас. Попробуйте ещё раз.');
      } else if (event.error === 'not-allowed') {
        setError('Нет доступа к микрофону. Разрешите доступ в настройках браузера.');
      } else {
        setError('Ошибка микрофона. Попробуйте ещё раз.');
      }
    };

    recognition.start();
  };

  const skipWord = () => {
    setStatus('idle');
    setHeard('');
    if (currentIndex + 1 >= words.length) {
      setFinished(true);
      onComplete(Math.round((score / words.length) * 25));
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  if (!supported) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>😔</div>
        <h3 style={{ marginBottom: 8 }}>Браузер не поддерживает эту игру</h3>
        <p>Для игры "Произношение" нужен браузер <strong>Chrome</strong> или <strong>Edge</strong>.</p>
      </div>
    );
  }

  if (finished) {
    const xp = Math.round((score / words.length) * 25);
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎤</div>
        <h2 style={{ color: 'var(--tiffany-dark)', marginBottom: 8 }}>Отличное произношение!</h2>
        <p style={{ marginBottom: 8 }}>Правильно произнесли: <strong>{score} из {words.length}</strong></p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--tiffany-xlight)', border: '1px solid var(--border)', borderRadius: 100, padding: '8px 20px', fontWeight: 700, color: 'var(--tiffany-dark)', fontSize: '1.1rem', marginTop: 12 }}>
          <i className="ph-fill ph-star"></i> +{xp} XP получено!
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
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

      {/* Word card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--tiffany) 0%, var(--tiffany-dark) 100%)',
        borderRadius: 20,
        padding: '40px 32px',
        marginBottom: 32,
        boxShadow: '0 8px 32px rgba(10,186,181,0.3)',
        position: 'relative',
      }}>
        <button
          onClick={() => speakText(currentWord)}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
            width: 40, height: 40, display: 'flex', alignItems: 'center', justify: 'center',
            color: '#fff', fontSize: '1.2rem', cursor: 'pointer',
            backdropFilter: 'blur(4px)'
          }}
          title="Послушать как правильно произносится"
        >
          <i className="ph-fill ph-speaker-high"></i>
        </button>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: 12, letterSpacing: '0.1em', fontWeight: 500 }}>
          ПРОИЗНЕСИТЕ СЛОВО
        </div>
        <div style={{ fontSize: '3rem', fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>
          {currentWord}
        </div>
      </div>

      {/* Status feedback */}
      {status === 'correct' && (
        <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.2rem', marginBottom: 16 }}>
          ✅ Отлично! Правильное произношение!
        </div>
      )}
      {status === 'wrong' && heard && (
        <div style={{ color: 'var(--danger)', fontWeight: 600, fontSize: '1rem', marginBottom: 16 }}>
          ❌ Услышали: "<strong>{heard}</strong>" — попробуйте снова!
        </div>
      )}
      {error && (
        <div style={{ color: 'var(--danger)', fontSize: '0.9rem', marginBottom: 16 }}>{error}</div>
      )}

      {/* Mic button */}
      <button
        onClick={startListening}
        disabled={status === 'listening' || status === 'correct'}
        style={{
          width: 100, height: 100,
          borderRadius: '50%',
          border: 'none',
          background: status === 'listening'
            ? 'linear-gradient(135deg, #e74c3c, #c0392b)'
            : status === 'correct'
            ? 'var(--success)'
            : 'linear-gradient(135deg, var(--tiffany), var(--tiffany-dark))',
          color: '#fff',
          fontSize: '2.5rem',
          cursor: status === 'listening' ? 'default' : 'pointer',
          boxShadow: status === 'listening'
            ? '0 0 0 12px rgba(231,76,60,0.2), 0 8px 24px rgba(231,76,60,0.4)'
            : '0 8px 24px rgba(10,186,181,0.4)',
          transition: 'all 0.3s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          animation: status === 'listening' ? 'pulse 1.2s infinite' : 'none',
        }}
      >
        <i className={status === 'listening' ? 'ph-fill ph-microphone' : 'ph ph-microphone'}></i>
      </button>

      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>
        {status === 'listening' ? '🎤 Слушаю...' : 'Нажмите на микрофон и произнесите слово'}
      </div>

      {/* Skip button */}
      <button
        onClick={skipWord}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          fontSize: '0.9rem',
          textDecoration: 'underline',
        }}
      >
        Пропустить слово
      </button>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(231,76,60,0.4), 0 8px 24px rgba(231,76,60,0.3); }
          70% { box-shadow: 0 0 0 16px rgba(231,76,60,0), 0 8px 24px rgba(231,76,60,0.3); }
          100% { box-shadow: 0 0 0 0 rgba(231,76,60,0), 0 8px 24px rgba(231,76,60,0.3); }
        }
      `}</style>
    </div>
  );
}
