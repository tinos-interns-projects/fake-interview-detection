// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { apiSessionDetails, sessionReportUrl } from '../utils/api';
// import StatusBadge from '../components/StatusBadge';
// import ScoreRing from '../components/ScoreRing';
// import './SessionDetailPage.css';

// export default function SessionDetailPage() {
//   const { sessionId } = useParams();
//   const navigate = useNavigate();
//   const [data, setData]     = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]   = useState('');

//   useEffect(() => {
//     apiSessionDetails(sessionId)
//       .then(d => {
//         if (d.error) setError(d.error);
//         else setData(d);
//         setLoading(false);
//       })
//       .catch(() => { setError('Failed to load session.'); setLoading(false); });
//   }, [sessionId]);

//   if (loading) return (
//     <div className="session-detail session-detail--loading">
//       <span className="mono" style={{ color: 'var(--text-muted)', fontSize: 12 }}>
//         Loading session {sessionId}…
//       </span>
//     </div>
//   );

//   if (error) return (
//     <div className="session-detail session-detail--loading">
//       <span style={{ color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
//         {error}
//       </span>
//       <button className="btn" onClick={() => navigate('/history')}>← Back</button>
//     </div>
//   );

//   const { session, logs, questions = [] } = data;

//   // Score distribution
//   const avgScore = logs.length
//     ? Math.round(logs.reduce((s, l) => s + l.score, 0) / logs.length)
//     : 0;
//   const maxScore = logs.length
//     ? Math.max(...logs.map(l => l.score))
//     : 0;
//   const suspiciousCount = logs.filter(l =>
//     l.final_status?.toLowerCase().includes('suspicious')
//   ).length;

//   return (
//     <div className="session-detail animate-fade-in">
//       {/* Header */}
//       <header className="session-detail__header">
//         <div className="session-detail__back">
//           <button className="btn btn-ghost" onClick={() => navigate('/history')}>
//             ← Back
//           </button>
//         </div>
//         <div className="session-detail__title-block">
//           <h1 className="session-detail__title">
//             Session <span className="mono">#{session.id}</span>
//           </h1>
//           <StatusBadge status={session.final_result} />
//         </div>
//         <a
//           className="btn"
//           href={sessionReportUrl(sessionId)}
//           target="_blank"
//           rel="noreferrer"
//         >
//           ↓ Download PDF
//         </a>
//       </header>

//       {/* Info grid */}
//       <div className="session-info-grid">
//         <InfoCard label="Candidate"  value={session.user_name} />
//         <InfoCard label="Email"      value={session.user_email} mono />
//         <InfoCard label="Meeting ID" value={session.meeting_id || 'N/A'} mono />
//         <InfoCard label="Start"      value={session.start_time} mono />
//         <InfoCard label="End"        value={session.end_time || 'In Progress'} mono />
//         <InfoCard label="Duration"   value={session.duration} mono accent />
//       </div>

//       {/* Stats row */}
//       <div className="session-stats-row">
//         <div className="card session-stat-card">
//           <ScoreRing score={avgScore} size={90} />
//           <div className="session-stat-card__label">Avg Risk Score</div>
//         </div>
//         <div className="card session-stat-card">
//           <ScoreRing score={maxScore} size={90} />
//           <div className="session-stat-card__label">Peak Risk Score</div>
//         </div>
//         <div className="card session-stat-card session-stat-card--num">
//           <div className="session-stat-card__big">{logs.length}</div>
//           <div className="session-stat-card__label">Total Frames</div>
//         </div>
//         <div className={`card session-stat-card session-stat-card--num ${suspiciousCount > 0 ? 'session-stat-card--alert' : ''}`}>
//           <div className="session-stat-card__big" style={{ color: suspiciousCount > 0 ? 'var(--danger)' : 'var(--ok)' }}>
//             {suspiciousCount}
//           </div>
//           <div className="session-stat-card__label">Suspicious Events</div>
//         </div>
//       </div>

//       {/* Question Statistics */}
//       {questions && questions.length > 0 && (
//         <div className="card session-log-card">
//           <div className="session-log-card__header">
//             <span className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
//               Question Performance
//             </span>
//             <span className="mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
//               {questions.length} questions attempted
//             </span>
//           </div>
          
//           {/* Question Summary Stats */}
//           <div className="question-summary-stats">
//             <div className="question-stat-item">
//               <div className="question-stat-number">{questions.length}</div>
//               <div className="question-stat-label">Total Questions</div>
//             </div>
//             <div className="question-stat-item">
//               <div className="question-stat-number" style={{ color: 'var(--ok)' }}>
//                 {questions.filter(q => q.status === 'answered').length}
//               </div>
//               <div className="question-stat-label">Attended</div>
//             </div>
//             <div className="question-stat-item">
//               <div className="question-stat-number" style={{ color: 'var(--warn)' }}>
//                 {questions.filter(q => q.status === 'skipped').length}
//               </div>
//               <div className="question-stat-label">Skipped</div>
//             </div>
//             <div className="question-stat-item">
//               <div className="question-stat-number">
//                 {questions.length > 0 ? 
//                   Math.round((questions.filter(q => q.status === 'answered').length / questions.length) * 100) : 0}%
//               </div>
//               <div className="question-stat-label">Success Rate</div>
//             </div>
//           </div>

//           {/* Question Details Table */}
//           <div style={{ overflowX: 'auto', marginTop: '20px' }}>
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>Q#</th>
//                   <th>Question</th>
//                   <th>Category</th>
//                   <th>Difficulty</th>
//                   <th>Status</th>
//                   <th>Time</th>
//                   <th>Asked At</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {questions.map((question, i) => (
//                   <tr key={i}>
//                     <td className="mono" style={{ fontSize: 11 }}>Q{question.question_number || i + 1}</td>
//                     <td style={{ maxWidth: '300px', fontSize: '12px' }}>
//                       <div style={{ 
//                         overflow: 'hidden', 
//                         textOverflow: 'ellipsis', 
//                         whiteSpace: 'nowrap',
//                         title: question.question 
//                       }}>
//                         {question.question}
//                       </div>
//                     </td>
//                     <td>
//                       <span className="mono" style={{ 
//                         fontSize: '10px', 
//                         background: 'var(--bg-surface)', 
//                         padding: '2px 6px', 
//                         borderRadius: '4px',
//                         border: '1px solid var(--border)'
//                       }}>
//                         {question.category}
//                       </span>
//                     </td>
//                     <td>
//                       <span className="mono" style={{ 
//                         fontSize: '10px', 
//                         color: question.difficulty === 'Easy' ? 'var(--ok)' : 
//                                question.difficulty === 'Medium' ? 'var(--warn)' : 'var(--danger)',
//                         background: 'var(--bg-surface)', 
//                         padding: '2px 6px', 
//                         borderRadius: '4px',
//                         border: '1px solid var(--border)'
//                       }}>
//                         {question.difficulty}
//                       </span>
//                     </td>
//                     <td>
//                       <span style={{
//                         color: question.status === 'answered' ? 'var(--ok)' : 'var(--warn)',
//                         fontWeight: 500
//                       }}>
//                         {question.status === 'answered' ? '✓ Answered' : '⏭️ Skipped'}
//                       </span>
//                     </td>
//                     <td className="mono" style={{ fontSize: 11 }}>
//                       {question.time_spent ? `${Math.floor(question.time_spent / 60)}:${(question.time_spent % 60).toString().padStart(2, '0')}` : 'N/A'}
//                     </td>
//                     <td className="mono" style={{ fontSize: 11 }}>
//                       {question.asked_at ? new Date(question.asked_at).toLocaleTimeString() : 'N/A'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Log table */}
//       <div className="card session-log-card">
//         <div className="session-log-card__header">
//           <span className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
//             Detection Log
//           </span>
//           <span className="mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
//             Showing last {logs.length} entries
//           </span>
//         </div>
//         <div style={{ overflowX: 'auto' }}>
//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th>Time</th>
//                 <th>Faces</th>
//                 <th>Behavior</th>
//                 <th>Lip Sync</th>
//                 <th>Score</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {logs.map((log, i) => (
//                 <tr key={i} className={log.final_status?.toLowerCase().includes('suspicious') ? 'log-danger-row' : ''}>
//                   <td className="mono" style={{ fontSize: 11 }}>{log.timestamp}</td>
//                   <td className="mono">{log.face_count}</td>
//                   <td>{log.behavior}</td>
//                   <td>{log.lip_status}</td>
//                   <td>
//                     <span className="mono" style={{
//                       color: log.score > 60 ? 'var(--danger)' : log.score > 30 ? 'var(--warn)' : 'var(--ok)',
//                       fontWeight: 500
//                     }}>
//                       {Math.round(log.score)}
//                     </span>
//                   </td>
//                   <td><StatusBadge status={log.final_status} /></td>
//                 </tr>
//               ))}
//               {logs.length === 0 && (
//                 <tr>
//                   <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
//                     No detection logs found for this session.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// function InfoCard({ label, value, mono, accent }) {
//   return (
//     <div className={`info-card ${accent ? 'info-card--accent' : ''}`}>
//       <div className="info-card__label">{label}</div>
//       <div className={`info-card__value ${mono ? 'mono' : ''}`}>{value}</div>
//     </div>
//   );
// }
import React, {
  useState,
  useEffect
} from 'react';

import {
  useParams,
  useNavigate
} from 'react-router-dom';

import {
  apiSessionDetails
} from '../utils/api';

import StatusBadge from '../components/StatusBadge';
import ScoreRing from '../components/ScoreRing';

import './SessionDetailPage.css';

export default function SessionDetailPage() {

  // FIXED HERE
  const { sessionId } = useParams();

  const navigate = useNavigate();

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {

    async function loadSession() {

      try {

        const response =
          await apiSessionDetails(
            sessionId
          );

        if (
          response?.error
        ) {

          setError(
            response.error
          );

        } else {

          setData(
            response
          );

        }

      } catch {

        setError(
          'Failed to load session'
        );

      } finally {

        setLoading(false);

      }

    }

    if (sessionId) {
      loadSession();
    }

  }, [sessionId]);


  if (loading) {

    return (
      <div className="session-detail">
        Loading session...
      </div>
    );

  }


  if (error) {

    return (

      <div className="session-detail">

        <h3>{error}</h3>

        <button
          className="btn"
          onClick={() =>
            navigate('/history')
          }
        >
          ← Back
        </button>

      </div>

    );

  }


  const session =
    data?.session || {};

  const logs =
    data?.logs || [];


  const avgScore =
    logs.length
      ? Math.round(
          logs.reduce(
            (sum, item) =>
              sum + item.score,
            0
          ) / logs.length
        )
      : 0;


  const maxScore =
    logs.length
      ? Math.max(
          ...logs.map(
            item =>
              item.score
          )
        )
      : 0;


  return (

    <div className="session-detail">

      <header className="session-detail__header">

        <button
          className="btn"
          onClick={() =>
            navigate('/history')
          }
        >
          ← Back
        </button>

        <h1>
          Session #{session.id}
        </h1>

        <StatusBadge
          status={
            session.final_result
          }
        />

      </header>


      <div className="session-stats-row">

        <div className="card">
          <ScoreRing
            score={avgScore}
            size={90}
          />
          <p>Average Score</p>
        </div>

        <div className="card">
          <ScoreRing
            score={maxScore}
            size={90}
          />
          <p>Peak Score</p>
        </div>

      </div>


      <div className="card">

        <h3>
          Detection Log
        </h3>

        <table className="data-table">

          <thead>
            <tr>
              <th>Time</th>
              <th>Faces</th>
              <th>Behavior</th>
              <th>Lip</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {logs.length ? (

              logs.map(
                (log, i) => (

                <tr key={i}>

                  <td>
                    {log.timestamp}
                  </td>

                  <td>
                    {log.face_count}
                  </td>

                  <td>
                    {log.behavior}
                  </td>

                  <td>
                    {log.lip_status}
                  </td>

                  <td>
                    {Math.round(
                      log.score
                    )}
                  </td>

                  <td>

                    <StatusBadge
                      status={
                        log.final_status
                      }
                    />

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="6"
                  style={{
                    textAlign:
                      'center'
                  }}
                >
                  No logs found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}