import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function MatchGame({ game, onComplete }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Generate cards from pairs
    const pairs = game.data.pairs;
    let newCards = [];
    pairs.forEach((p, idx) => {
      newCards.push({ id: `w_${idx}`, text: p.word, matchId: idx, type: 'word' });
      newCards.push({ id: `t_${idx}`, text: p.translation, matchId: idx, type: 'translation' });
    });
    // Shuffle
    newCards = newCards.sort(() => Math.random() - 0.5);
    setCards(newCards);
  }, [game]);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const idx1 = newFlipped[0];
      const idx2 = newFlipped[1];
      if (cards[idx1].matchId === cards[idx2].matchId) {
        // Match!
        const newMatched = [...matched, idx1, idx2];
        setMatched(newMatched);
        setFlipped([]);
        if (newMatched.length === cards.length) {
          setIsFinished(true);
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
          onComplete(15); // Award 15 points
        }
      } else {
        // No match
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  if (isFinished) {
    return (
      <div className="match-game-finished fade-in">
        <i className="ph ph-confetti" style={{ fontSize: '4rem', color: 'var(--accent)', marginBottom: 16 }}></i>
        <h2>Отлично!</h2>
        <p>Вы успешно завершили игру и заработали +15 XP!</p>
      </div>
    );
  }

  return (
    <div className="match-game fade-in">
      <div className="match-game-grid">
        {cards.map((card, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          return (
            <div
              key={card.id}
              className={`match-card ${isFlipped ? 'flipped' : ''} ${matched.includes(i) ? 'matched' : ''}`}
              onClick={() => handleCardClick(i)}
            >
              <div className="match-card-inner">
                <div className="match-card-front">
                  <i className="ph ph-question"></i>
                </div>
                <div className="match-card-back">
                  {card.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .match-game-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 16px;
          margin-top: 24px;
        }
        .match-card {
          aspect-ratio: 4/3;
          perspective: 1000px;
          cursor: pointer;
        }
        .match-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-radius: 12px;
        }
        .match-card.flipped .match-card-inner {
          transform: rotateY(180deg);
        }
        .match-card.matched .match-card-inner {
          box-shadow: 0 0 0 2px var(--success), 0 4px 12px rgba(0,0,0,0.1);
          background: rgba(32, 191, 107, 0.1);
        }
        .match-card-front, .match-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden; /* Safari */
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1.1rem;
          padding: 8px;
        }
        .match-card-front {
          background: var(--surface);
          color: var(--accent);
          font-size: 2rem;
          border: 1px solid var(--border);
        }
        .match-card-back {
          background: var(--surface-hover);
          color: var(--text-primary);
          transform: rotateY(180deg);
          border: 1px solid var(--border);
        }
        .match-game-finished {
          text-align: center;
          padding: 40px;
          background: var(--surface);
          border-radius: 16px;
          margin-top: 24px;
          border: 1px solid var(--border);
        }
      `}</style>
    </div>
  );
}
