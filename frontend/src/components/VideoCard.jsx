import { useState } from 'react';

// Конвертирует YouTube/Vimeo URL в embed URL
function getEmbedUrl(url) {
  if (!url) return null;

  // YouTube
  let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}?rel=0`;

  // YouTube shorts
  match = url.match(/youtube\.com\/shorts\/([^?&\s]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;

  // Vimeo
  match = url.match(/vimeo\.com\/(\d+)/);
  if (match) return `https://player.vimeo.com/video/${match[1]}`;

  // Telegram Public Post
  match = url.match(/t\.me\/(?!c\/)([a-zA-Z0-9_]+\/\d+)/);
  if (match) return `https://t.me/${match[1]}?embed=1`;

  // Google Drive
  match = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;

  // Если уже embed ссылка
  if (url.includes('youtube.com/embed') || url.includes('player.vimeo.com') || url.includes('t.me/') && url.includes('embed=') || url.includes('drive.google.com') && url.includes('preview')) return url;

  return null; // Внешняя ссылка
}

export default function VideoCard({ video, index, showActions, onEdit, onDelete, onPlay }) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = getEmbedUrl(video.url);

  const handlePlay = () => {
    if (onPlay && !playing) onPlay();
    setPlaying(true);
  };

  return (
    <div className="video-card card slide-up" style={{ animationDelay: `${index * 0.07}s` }}>
      {/* Player / Thumbnail */}
      <div className="video-thumbnail" onClick={() => {
        if (embedUrl && !playing) handlePlay();
        else if (!embedUrl) {
          if (onPlay) onPlay();
          window.open(video.url, '_blank');
        }
      }}>
        {playing && embedUrl ? (
          <div className="video-embed">
            <iframe
              src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              scrolling="no"
              style={{ width: '100%', height: '100%', border: 'none', overflow: 'hidden' }}
            />
          </div>
        ) : (
          <div className="video-preview">
            <div className="play-btn-outer">
              <div className="play-btn">
                {embedUrl ? <i className="ph-fill ph-play-circle"></i> : <i className="ph-fill ph-link"></i>}
              </div>
            </div>
            <div className="video-number">#{index + 1}</div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="video-info">
        <div className="video-meta">
          <span className="badge badge-purple">Урок {index + 1}</span>
        </div>
        <h3 className="video-title">{video.title}</h3>
        {video.description && (
          <p className="video-desc">{video.description}</p>
        )}
        {!playing && embedUrl && (
          <button className="btn btn-primary btn-sm" onClick={handlePlay}>
            <i className="ph ph-play-circle"></i> Смотреть урок
          </button>
        )}
        {!embedUrl && (
          <a href={video.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ width: 'fit-content' }} onClick={() => onPlay && onPlay()}>
            <i className="ph ph-arrow-square-out"></i> Открыть ссылку
          </a>
        )}
        {playing && embedUrl && (
          <button className="btn btn-secondary btn-sm" onClick={() => setPlaying(false)}>
            <i className="ph ph-x-circle"></i> Закрыть
          </button>
        )}
      </div>

      {/* Teacher actions */}
      {showActions && (
        <div className="video-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => onEdit(video)} title="Редактировать"><i className="ph ph-pencil-simple"></i></button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(video.id)} title="Удалить"><i className="ph ph-trash"></i></button>
        </div>
      )}

      <style>{`
        .video-card { position: relative; padding: 0; overflow: hidden; display: flex; flex-direction: column; }
        .video-thumbnail { cursor: pointer; border-bottom: 1px solid var(--border); overflow: hidden; }
        .video-embed iframe {
          width: 100%;
          aspect-ratio: 16/9;
          border: none;
          display: block;
        }
        .video-preview {
          width: 100%;
          aspect-ratio: 16/9;
          background: var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: background var(--transition);
        }
        .video-preview:hover { background: var(--border); }
        .play-btn-outer {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
          transition: all var(--transition);
        }
        .video-preview:hover .play-btn-outer {
          transform: scale(1.05);
          box-shadow: var(--shadow);
        }
        .play-btn { font-size: 1.5rem; color: var(--accent); margin-left: 4px; }
        .video-number {
          position: absolute; top: 12px; left: 12px;
          background: #fff; color: var(--text-primary);
          padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }
        .video-info {
          padding: 20px;
          display: flex; flex-direction: column; gap: 12px;
          flex: 1;
        }
        .video-meta { display: flex; gap: 8px; align-items: center; }
        .video-title { font-size: 1.1rem; font-weight: 600; color: var(--text-primary); line-height: 1.4; }
        .video-desc { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 8px; }
        .video-actions {
          position: absolute; top: 12px; right: 12px;
          display: flex; gap: 6px;
          opacity: 0; transition: opacity var(--transition);
        }
        .video-card:hover .video-actions { opacity: 1; }
      `}</style>
    </div>
  );
}
