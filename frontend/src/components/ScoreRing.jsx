import React from 'react';
import './ScoreRing.css';

export default function ScoreRing({ score = 0, size = 120 }) {
  const r       = (size / 2) - 10;
  const circ    = 2 * Math.PI * r;
  const pct     = Math.min(Math.max(score, 0), 100) / 100;
  const offset  = circ * (1 - pct);

  const color = score > 60 ? 'var(--danger)'
               : score > 30 ? 'var(--warn)'
               : 'var(--ok)';

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke="var(--bg-elevated)" strokeWidth="6"
        />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease' }}
        />
      </svg>
      <div className="score-ring__label">
        <span className="score-ring__value" style={{ color }}>{Math.round(score)}</span>
        <span className="score-ring__sub">risk</span>
      </div>
    </div>
  );
}