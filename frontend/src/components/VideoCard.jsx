import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Конвертирует YouTube / Vimeo / Google Drive / Telegram URL в embed URL
function getEmbedUrl(url) {
  if (!url) return null;

  // Google Drive (любые ссылки)
  let match = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/);
  if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;

  // YouTube
  match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
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

  if (url.includes('youtube.com/embed') || url.includes('player.vimeo.com') || (url.includes('t.me/') && url.includes('embed=')) || (url.includes('drive.google.com') && url.includes('preview'))) return url;

  return null;
}

// Get YouTube thumbnail
function getYoutubeThumbnail(url) {
  if (!url) return null;
  let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
  if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  match = url.match(/youtube\.com\/shorts\/([^?&\s]+)/);
  if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  return null;
}

export default function VideoCard({ video, index, showActions, onEdit, onDelete, onPlay }) {
  const [showModal, setShowModal] = useState(false);
  const embedUrl = getEmbedUrl(video.url);
  const thumbnail = getYoutubeThumbnail(video.url);

  const handlePlayClick = () => {
    if (onPlay) onPlay();
    if (embedUrl) {
      setShowModal(true);
    } else {
      window.open(video.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <div className="vc-card slide-up" style={{ animationDelay: `${index * 0.07}s` }}>
        {/* Thumbnail area */}
        <div className="vc-thumb" onClick={handlePlayClick}>
          {thumbnail ? (
            <img src={thumbnail} alt={video.title} className="vc-bg-img" />
          ) : (
            <div className="vc-bg-gradient">
              <i className="ph-fill ph-video-camera" style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.4)' }}></i>
            </div>
          )}

          <div className="vc-overlay" />

          {/* Lesson badge */}
          <div className="vc-badge">
            <i className="ph ph-video"></i> Сабак {index + 1}
          </div>

          {/* Play button */}
          <div className="vc-play-wrap">
            <div className="vc-play-btn">
              {embedUrl
                ? <i className="ph-fill ph-play"></i>
                : <i className="ph-fill ph-arrow-square-out"></i>}
            </div>
            <span className="vc-play-label">{embedUrl ? 'Көрүү' : 'Ачуу'}</span>
          </div>
        </div>

        {/* Info */}
        <div className="vc-info">
          <h3 className="vc-title">{video.title}</h3>
          {video.description && (
            <p className="vc-desc">{video.description}</p>
          )}
          <button className="vc-btn" onClick={handlePlayClick}>
            <i className="ph-fill ph-play-circle"></i> Сабакты көрүү
          </button>
        </div>

        {showActions && (
          <div className="vc-actions">
            <button className="vc-act-btn edit" onClick={() => onEdit(video)} title="Редактировать">
              <i className="ph ph-pencil-simple"></i>
            </button>
            <button className="vc-act-btn del" onClick={() => onDelete(video.id)} title="Удалить">
              <i className="ph ph-trash"></i>
            </button>
          </div>
        )}
      </div>

      {/* Large Widescreen Video Modal Player */}
      {showModal && (
        <div className="vm-overlay" onClick={() => setShowModal(false)}>
          <div className="vm-container" onClick={(e) => e.stopPropagation()}>
            <div className="vm-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="badge badge-purple" style={{ fontSize: '0.85rem' }}>
                  <i className="ph ph-video"></i> Сабак {index + 1}
                </span>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                  {video.title}
                </h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)} style={{ fontSize: '1.2rem' }}>
                <i className="ph ph-x"></i>
              </button>
            </div>

            <div className="vm-player-frame" style={{ background: '#000' }}>
              <iframe
                src={embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen={true}
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
                loading="eager"
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .vc-card {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          background: #fff;
          border: 1.5px solid var(--border);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .vc-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--tiffany);
        }

        .vc-thumb {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          overflow: hidden;
          cursor: pointer;
          background: var(--bg-tertiary);
        }
        .vc-bg-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .vc-card:hover .vc-bg-img { transform: scale(1.05); }
        .vc-bg-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--tiffany) 0%, var(--tiffany-darker) 100%);
          display: flex; alignItems: center; justify-content: center;
        }
        .vc-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, transparent 100%);
          transition: background 0.3s ease;
        }
        .vc-card:hover .vc-overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 60%, transparent 100%);
        }

        .vc-badge {
          position: absolute; top: 12px; left: 12px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(6px);
          color: var(--tiffany-dark);
          font-size: 0.75rem; font-weight: 700;
          padding: 4px 10px; border-radius: 100px;
          display: flex; align-items: center; gap: 4px;
          border: 1px solid rgba(255,255,255,0.6);
        }

        .vc-play-wrap {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 10px;
          transition: opacity 0.2s;
        }
        .vc-play-btn {
          width: 60px; height: 60px;
          border-radius: 50%;
          background: rgba(255,255,255,0.95);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.6rem;
          color: var(--tiffany);
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          padding-left: 3px;
        }
        .vc-card:hover .vc-play-btn {
          transform: scale(1.12);
          box-shadow: 0 6px 28px rgba(10,186,181,0.45);
        }
        .vc-play-label {
          color: #fff;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          opacity: 0;
          transform: translateY(6px);
          transition: all 0.25s ease;
          text-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
        .vc-card:hover .vc-play-label {
          opacity: 1;
          transform: translateY(0);
        }

        .vc-info {
          padding: 18px 20px 20px;
          display: flex; flex-direction: column; gap: 8px;
          flex: 1;
        }
        .vc-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .vc-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .vc-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          padding: 8px 16px;
          background: linear-gradient(135deg, var(--tiffany), var(--tiffany-dark));
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s;
          width: fit-content;
          box-shadow: 0 2px 10px rgba(10,186,181,0.3);
        }
        .vc-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(10,186,181,0.45);
        }

        .vc-actions {
          position: absolute; top: 10px; right: 10px;
          display: flex; gap: 6px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .vc-card:hover .vc-actions { opacity: 1; }
        .vc-act-btn {
          width: 34px; height: 34px;
          border-radius: 50%;
          border: none;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.95rem;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.2s;
        }
        .vc-act-btn.edit {
          background: rgba(255,255,255,0.9);
          color: var(--tiffany-dark);
        }
        .vc-act-btn.edit:hover { background: var(--tiffany-xlight); }
        .vc-act-btn.del {
          background: rgba(255,255,255,0.9);
          color: var(--danger);
        }
        .vc-act-btn.del:hover { background: var(--danger-light); }

        /* Widescreen Video Modal */
        .vm-overlay {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(6, 40, 38, 0.75);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: fadeIn 0.25s ease;
        }
        .vm-container {
          background: #ffffff;
          border-radius: 24px;
          width: 100%;
          max-width: 960px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          animation: slideUp 0.3s ease;
        }
        .vm-header {
          padding: 16px 24px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid var(--border);
          background: var(--bg-secondary);
        }
        .vm-player-frame {
          width: 100%;
          aspect-ratio: 16/9;
          background: #000;
        }
        .vm-player-frame iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }
      `}</style>
    </>
  );
}
