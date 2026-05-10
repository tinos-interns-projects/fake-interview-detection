import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiHistory, sessionReportUrl } from '../utils/api';
import StatusBadge from '../components/StatusBadge';
import './HistoryPage.css';

export default function HistoryPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    apiHistory().then(data => {
      setSessions(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const filtered = sessions.filter(s => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'suspicious' && s.final_result?.toLowerCase().includes('suspicious')) ||
      (filter === 'normal'     && s.final_result?.toLowerCase().includes('normal'));

    const q = search.toLowerCase();
    const matchSearch = !q ||
      s.user_name?.toLowerCase().includes(q) ||
      s.meeting_id?.toLowerCase().includes(q) ||
      s.start_time?.toLowerCase().includes(q);

    return matchFilter && matchSearch;
  });

  const suspiciousCount = sessions.filter(s =>
    s.final_result?.toLowerCase().includes('suspicious')
  ).length;

  return (
    <div className="history">
      {/* Header */}
      <header className="history__header">
        <div>
          <h1 className="history__title">Session Log</h1>
          <p className="history__subtitle mono">
            {sessions.length} total · {suspiciousCount} flagged
          </p>
        </div>
      </header>

      {/* Summary chips */}
      <div className="history__summary">
        <SummaryChip label="Total Sessions" value={sessions.length} />
        <SummaryChip label="Flagged"         value={suspiciousCount} accent="danger" />
        <SummaryChip label="Clean"           value={sessions.length - suspiciousCount} accent="ok" />
      </div>

      {/* Filters */}
      <div className="history__controls">
        <input
          className="input-field history__search"
          placeholder="Search by name, meeting ID…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filter-tabs">
          {['all', 'suspicious', 'normal'].map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'filter-tab--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card history__table-wrap">
        {loading ? (
          <div className="history__loading">
            <span className="mono" style={{ color: 'var(--text-muted)', fontSize: 12 }}>
              Loading sessions…
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="history__empty">
            <span>No sessions match your filter.</span>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Candidate</th>
                <th>Meeting ID</th>
                <th>Start Time</th>
                <th>Duration</th>
                <th>Score</th>
                <th>Result</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} onClick={() => navigate(`/session/${s.id}`)}>
                  <td className="mono" style={{ color: 'var(--text-muted)' }}>{s.id}</td>
                  <td>
                    <div className="candidate-cell">
                      <div className="candidate-avatar">{s.user_name?.[0]?.toUpperCase()}</div>
                      <span style={{ color: 'var(--text-primary)' }}>{s.user_name}</span>
                    </div>
                  </td>
                  <td className="mono" style={{ fontSize: 12 }}>{s.meeting_id || 'N/A'}</td>
                  <td className="mono" style={{ fontSize: 11 }}>{s.start_time}</td>
                  <td className="mono">{s.duration}</td>
                  <td>
                    <ScoreChip score={s.score} />
                  </td>
                  <td><StatusBadge status={s.final_result} /></td>
                  <td onClick={e => e.stopPropagation()}>
                    <a
                      className="btn btn-ghost"
                      style={{ padding: '5px 12px', fontSize: 11 }}
                      href={sessionReportUrl(s.id)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      ↓ PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function SummaryChip({ label, value, accent }) {
  const colors = {
    danger: { bg: 'var(--danger-glow)', color: 'var(--danger)', border: 'rgba(255,69,69,0.2)' },
    ok:     { bg: 'var(--ok-glow)',     color: 'var(--ok)',     border: 'rgba(60,255,160,0.2)' },
  };
  const c = colors[accent] || {};
  return (
    <div className="summary-chip" style={{
      background: c.bg || 'var(--bg-card)',
      border: `1px solid ${c.border || 'var(--border)'}`,
    }}>
      <span className="summary-chip__value" style={{ color: c.color || 'var(--text-primary)' }}>
        {value}
      </span>
      <span className="summary-chip__label">{label}</span>
    </div>
  );
}

function ScoreChip({ score }) {
  const color = score > 60 ? 'var(--danger)' : score > 30 ? 'var(--warn)' : 'var(--ok)';
  return (
    <span className="mono" style={{ fontSize: 13, color, fontWeight: 500 }}>
      {Math.round(score ?? 0)}
    </span>
  );
}