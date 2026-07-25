import React from 'react';

export default function ActivityChart({ data }) {
  // data is an array: [{ active_date: '2023-10-01', active_minutes: 45 }, ...]
  
  // We want to ensure we have the last 7 days, even if some days have 0 minutes
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => {
    // Need to handle timezone parsing safely. data[].active_date might be ISO string
    const match = data.find(d => {
      const dString = new Date(d.active_date).toISOString().split('T')[0];
      return dString === date;
    });
    
    // Format label as Day of Week (e.g. "Пн", "Вт")
    const dObj = new Date(date);
    const dayLabel = dObj.toLocaleDateString('ru-RU', { weekday: 'short' });

    return {
      date,
      dayLabel,
      minutes: match ? match.active_minutes : 0
    };
  });

  const maxMinutes = Math.max(...chartData.map(d => d.minutes), 60); // min height baseline

  return (
    <div className="activity-chart">
      <h3 style={{ marginBottom: 16, fontSize: '1.1rem' }}>
        <i className="ph ph-chart-bar" style={{ color: 'var(--accent)', marginRight: 8 }}></i> 
        Активность за неделю (минуты)
      </h3>
      
      <div className="chart-container">
        <div className="chart-bars">
          {chartData.map((d, i) => {
            const heightPercent = Math.min((d.minutes / maxMinutes) * 100, 100);
            return (
              <div key={i} className="chart-bar-wrap">
                <div className="chart-bar-value">{d.minutes > 0 ? d.minutes : ''}</div>
                <div className="chart-bar-track">
                  <div 
                    className="chart-bar-fill" 
                    style={{ height: `${heightPercent}%`, background: d.minutes > 0 ? 'var(--accent)' : 'var(--border)' }}
                  ></div>
                </div>
                <div className="chart-bar-label">{d.dayLabel}</div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .activity-chart {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
        }
        .chart-container {
          height: 180px;
          display: flex;
          align-items: flex-end;
          padding-top: 20px;
        }
        .chart-bars {
          display: flex;
          justify-content: space-around;
          width: 100%;
          height: 100%;
          gap: 8px;
        }
        .chart-bar-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          flex: 1;
        }
        .chart-bar-value {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 4px;
          height: 16px;
          font-weight: 600;
        }
        .chart-bar-track {
          flex: 1;
          width: 24px;
          background: var(--bg-tertiary);
          border-radius: 4px;
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          overflow: hidden;
        }
        .chart-bar-fill {
          width: 100%;
          border-radius: 4px;
          transition: height 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .chart-bar-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 8px;
          text-transform: capitalize;
        }
        @media (max-width: 480px) {
          .chart-bar-track { width: 16px; }
        }
      `}</style>
    </div>
  );
}
