import React from 'react';

export default function StatusBadge({ status }) {
  if (!status) return null;

  const s = status.toLowerCase();

  if (s.includes('normal'))     return <span className="badge badge-ok">● Normal</span>;
  if (s.includes('suspicious')) return <span className="badge badge-danger">● Suspicious</span>;
  if (s.includes('warning') || s.includes('warn')) return <span className="badge badge-warn">● Warning</span>;
  if (s.includes('progress'))   return <span className="badge badge-warn">● In Progress</span>;
  return <span className="badge badge-muted">○ {status}</span>;
}