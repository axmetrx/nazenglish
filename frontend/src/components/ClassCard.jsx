import { useNavigate } from 'react-router-dom';

export default function ClassCard({ cls, onDelete }) {
  const navigate = useNavigate();

  const handleCopyCode = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cls.code);
  };

  return (
    <div className="cls-card card slide-up" onClick={() => navigate(`/admin/class/${cls.id}`)}>
      <div className="cls-card-top">
        <div className="cls-icon"><i className="ph ph-books"></i></div>
      </div>

      <h3 className="cls-name">{cls.name}</h3>
      {cls.description && <p className="cls-desc">{cls.description}</p>}

      <div className="cls-footer">
        <div className="cls-code-label">Код для учеников:</div>
        <div className="class-code" onClick={handleCopyCode} title="Нажмите, чтобы скопировать">
          {cls.code}
          <span style={{ fontSize: '1rem', opacity: 0.6 }}><i className="ph ph-copy"></i></span>
        </div>
      </div>

      <div className="cls-date">
        Создан: {new Date(cls.createdAt).toLocaleDateString('ru-RU')}
      </div>

      <style>{`
        .cls-card { cursor: pointer; display: flex; flex-direction: column; gap: 12px; }
        .cls-card-top { display: flex; align-items: center; justify-content: space-between; }
        .cls-icon { font-size: 2rem; }
        .cls-name { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); }
        .cls-desc { font-size: 0.85rem; color: var(--text-muted); }
        .cls-footer { margin-top: 4px; }
        .cls-code-label { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 6px; }
        .cls-date { font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; }
      `}</style>
    </div>
  );
}
