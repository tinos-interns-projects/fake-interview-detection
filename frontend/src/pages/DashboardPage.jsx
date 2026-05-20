// import React, { useState, useEffect, useRef, useCallback } from 'react';

// import { apiStart, apiStop, apiStatus, videoFeedUrl, reportUrl } from '../utils/api';

// import ScoreRing from '../components/ScoreRing';

// import StatusBadge from '../components/StatusBadge';

// import './DashboardPage.css';



// const POLL_INTERVAL = 1000; // ms



// export default function DashboardPage() {

//   const [running, setRunning]   = useState(false);

//   const [loading, setLoading]   = useState(false);

//   const [status, setStatus]     = useState({

//     faces: 0, behavior: '—', lip: '—', score: 0, final: 'Camera Off'

//   });

//   const [log, setLog]           = useState([]);

//   const [error, setError]       = useState('');

//   const intervalRef             = useRef(null);

//   const logEndRef               = useRef(null);



//   const rawUser = localStorage.getItem('user');

//   const user    = rawUser ? JSON.parse(rawUser) : {};



//   // ── POLL STATUS ──

//   const pollStatus = useCallback(async () => {

//     try {

//       const data = await apiStatus();

//       setStatus(data);

//       setLog(prev => {

//         const entry = {

//           time: new Date().toLocaleTimeString(),

//           ...data

//         };

//         return [...prev.slice(-199), entry];

//       });

//     } catch { /* ignore */ }

//   }, []);



//   useEffect(() => {

//     if (running) {

//       intervalRef.current = setInterval(pollStatus, POLL_INTERVAL);

//     } else {

//       clearInterval(intervalRef.current);

//     }

//     return () => clearInterval(intervalRef.current);

//   }, [running, pollStatus]);



//   useEffect(() => {

//     logEndRef.current?.scrollIntoView({ behavior: 'smooth' });

//   }, [log]);



//   async function handleStart() {

//     setLoading(true);

//     setError('');

//     try {

//       const data = await apiStart(user.id);

//       if (data.error) { setError(data.error); }

//       else { setRunning(true); setLog([]); }

//     } catch {

//       setError('Failed to start camera.');

//     }

//     setLoading(false);

//   }



//   async function handleStop() {

//     setLoading(true);

//     try {

//       await apiStop();

//       setRunning(false);

//       setStatus({ faces: 0, behavior: '—', lip: '—', score: 0, final: 'Camera Off' });

//     } catch { /* */ }

//     setLoading(false);

//   }



//   const finalLower = (status.final || '').toLowerCase();

//   const alertLevel = finalLower.includes('suspicious') ? 'danger'

//                    : finalLower.includes('warning')    ? 'warn'

//                    : running                            ? 'ok'

//                    : 'off';



//   return (

//     <div className="dash">

//       {/* ── HEADER ── */}

//       <header className="dash__header">

//         <div className="dash__header-left">

//           <div className={`live-dot live-dot--${alertLevel}`} />

//           <div>

//             <h1 className="dash__title">Live Monitor</h1>

//             <p className="dash__subtitle mono">

//               {running ? `Monitoring · ${new Date().toLocaleTimeString()}` : 'Session Inactive'}

//             </p>

//           </div>

//         </div>

//         <div className="dash__header-right">

//           <a className="btn" href={reportUrl()} target="_blank" rel="noreferrer">

//             ↓ Full Report

//           </a>

//           {!running ? (

//             <button className="btn btn-primary" onClick={handleStart} disabled={loading}>

//               {loading ? '◌ Starting…' : '▶ Start Session'}

//             </button>

//           ) : (

//             <button className="btn btn-danger" onClick={handleStop} disabled={loading}>

//               {loading ? '◌ Stopping…' : '■ End Session'}

//             </button>

//           )}

//         </div>

//       </header>



//       {error && <div className="dash__error">{error}</div>}



//       {/* ── BODY ── */}

//       <div className="dash__body">



//         {/* LEFT: Video feed */}

//         <div className="dash__video-col">

//           <div className="video-panel card">

//             <div className="video-panel__topbar">

//               <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>CAMERA FEED</span>

//               <div className={`live-pill ${running ? 'live-pill--on' : ''}`}>

//                 {running ? '● LIVE' : '○ OFFLINE'}

//               </div>

//             </div>



//             <div className="video-panel__frame">

//               {running ? (

//                 <img

//                   src={videoFeedUrl()}

//                   alt="Live feed"

//                   className="video-panel__img"

//                 />

//               ) : (

//                 <div className="video-panel__placeholder">

//                   <span className="video-panel__placeholder-icon">⬡</span>

//                   <span>Start a session to begin monitoring</span>

//                 </div>

//               )}

//             </div>



//             {/* Alert banner */}

//             {running && alertLevel === 'danger' && (

//               <div className="alert-banner alert-banner--danger">

//                 ⚠ SUSPICIOUS ACTIVITY DETECTED

//               </div>

//             )}

//             {running && alertLevel === 'warn' && (

//               <div className="alert-banner alert-banner--warn">

//                 ⚡ WARNING — Unusual behavior

//               </div>

//             )}

//           </div>

//         </div>



//         {/* RIGHT: Stats + log */}

//         <div className="dash__stats-col">



//           {/* Score + Status */}

//           <div className="card score-block">

//             <ScoreRing score={status.score} size={110} />

//             <div className="score-block__info">

//               <div className="score-block__status">

//                 <StatusBadge status={status.final} />

//               </div>

//               <div className="score-block__meta">

//                 <MetaRow label="Faces"    value={status.faces} />

//                 <MetaRow label="Behavior" value={status.behavior} />

//                 <MetaRow label="Lip Sync" value={status.lip} />

//               </div>

//             </div>

//           </div>



//           {/* Activity log */}

//           <div className="card activity-log">

//             <div className="activity-log__header">

//               <span className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>

//                 Activity Log

//               </span>

//               <span className="mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>

//                 {log.length} entries

//               </span>

//             </div>

//             <div className="activity-log__scroll">

//               {log.length === 0 ? (

//                 <div className="activity-log__empty">No data yet…</div>

//               ) : (

//                 [...log].reverse().map((entry, i) => (

//                   <div

//                     key={i}

//                     className={`log-row ${entry.final?.toLowerCase().includes('suspicious') ? 'log-row--danger' : ''}`}

//                   >

//                     <span className="log-row__time mono">{entry.time}</span>

//                     <span className="log-row__face">👤 {entry.faces}</span>

//                     <span className={`log-row__status ${

//                       entry.final?.toLowerCase().includes('suspicious') ? 'status-suspicious'

//                       : entry.final?.toLowerCase().includes('warning')  ? 'status-warning'

//                       : 'status-normal'

//                     }`}>

//                       {entry.final}

//                     </span>

//                     <span className="log-row__score mono">{Math.round(entry.score)}</span>

//                   </div>

//                 ))

//               )}

//               <div ref={logEndRef} />

//             </div>

//           </div>



//         </div>

//       </div>

//     </div>

//   );

// }



// function MetaRow({ label, value }) {

//   return (

//     <div className="meta-row">

//       <span className="meta-row__label">{label}</span>

//       <span className="meta-row__value mono">{value ?? '—'}</span>

//     </div>

//   );

// }
import React, {
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react';

import { Navigate } from 'react-router-dom';

import {
  apiStart,
  apiStop,
  apiStatus,
  videoFeedUrl
} from '../utils/api';

import ScoreRing from '../components/ScoreRing';
import StatusBadge from '../components/StatusBadge';
import QuestionsPanel from '../components/QuestionsPanel';
import QuestionReportModal from '../components/QuestionReportModal';

import './DashboardPage.css';
import '../components/QuestionsPanel.css';

const POLL_INTERVAL = 1000;


// RESULT MODAL
function ResultModal({ summary, onClose }) {

  const {
    verdict,
    avgScore,
    maxScore,
    total,
    suspCount
  } = summary;

  const icon =
    verdict === 'Suspicious'
      ? '⚠'
      : verdict === 'Warning'
      ? '⚡'
      : '✓';

  const color =
    verdict === 'Suspicious'
      ? 'var(--danger)'
      : verdict === 'Warning'
      ? 'var(--warn)'
      : 'var(--ok)';

  return (

    <div
      className="modal-overlay"
      onClick={onClose}
    >

      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
      >

        <div
          className="modal-bar"
          style={{ background: color }}
        />

        <button
          className="modal-close"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="modal-verdict">

          <span>{icon}</span>

          <span>{verdict}</span>

        </div>

        <h2>Session Complete</h2>

        <div className="modal-stats">

          <ModalStat
            label="Avg Score"
            value={avgScore}
          />

          <ModalStat
            label="Peak Score"
            value={maxScore}
          />

          <ModalStat
            label="Frames"
            value={total}
          />

          <ModalStat
            label="Suspicious"
            value={suspCount}
          />

        </div>

      </div>

    </div>
  );
}

function ModalStat({ label, value }) {

  return (

    <div className="modal-stat">

      <div className="modal-stat__value">
        {Math.round(value ?? 0)}
      </div>

      <div className="modal-stat__label">
        {label}
      </div>

    </div>

  );
}


// MAIN DASHBOARD
export default function DashboardPage() {

  const user = JSON.parse(
    localStorage.getItem('user')
  );

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Admin blocked
  if (user.role === 'admin') {
    return <Navigate to="/history" />;
  }

  const [running, setRunning] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [status, setStatus] =
    useState({
      faces: 0,
      behavior: "—",
      lip: "—",
      score: 0,
      final: "Camera Off"
    });

  const [error, setError] =
    useState('');

  const [summary, setSummary] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [questionHistory, setQuestionHistory] =
    useState([]);

  const [showQuestionReport, setShowQuestionReport] =
    useState(false);

  const intervalRef = useRef(null);


  const pollStatus = useCallback(async () => {

    try {

      const data =
        await apiStatus();

      setStatus(data);

    } catch {}

  }, []);


  useEffect(() => {

    if (running) {

      intervalRef.current =
        setInterval(
          pollStatus,
          POLL_INTERVAL
        );

    } else {

      clearInterval(
        intervalRef.current
      );

    }

    return () =>
      clearInterval(
        intervalRef.current
      );

  }, [running, pollStatus]);


  async function handleStart() {

    setLoading(true);

    try {

      await apiStart(user.id);

      setRunning(true);

    } catch {

      setError(
        "Failed to start camera"
      );

    }

    setLoading(false);

  }


  async function handleStop() {

    setLoading(true);

    try {

      await apiStop();

      setRunning(false);

      const suspicious =
        status.final
          ?.toLowerCase()
          .includes("suspicious");

      setSummary({

        total: 1,

        suspCount:
          suspicious ? 1 : 0,

        avgScore:
          status.score || 0,

        maxScore:
          status.score || 0,

        verdict:
          suspicious
            ? "Suspicious"
            : "Normal"

      });

      setShowModal(true);

      if (
        questionHistory.length > 0
      ) {

        setShowQuestionReport(
          true
        );

      }

    } catch {}

    setLoading(false);

  }


  const alertLevel =
    status.final
      ?.toLowerCase()
      .includes("suspicious")

      ? "danger"

      : running

      ? "ok"

      : "off";


  return (

    <div className="dash">

      {/* Header */}

      <header className="dash__header">

        <div
          className="dash__header-left"
        >

          <div
            className={`live-dot live-dot--${alertLevel}`}
          />

          <div>

            <h1 className="dash__title">

              Live Interview Monitoring

            </h1>

            <p className="dash__subtitle">

              {running
                ? "Monitoring..."
                : "Session Inactive"}

            </p>

          </div>

        </div>

        <button
          className={
            running
              ? "btn btn-danger"
              : "btn btn-primary"
          }
          onClick={
            running
              ? handleStop
              : handleStart
          }
          disabled={loading}
        >

          {running
            ? "■ Stop Session"
            : "▶ Start Session"}

        </button>

      </header>

      {error && (

        <div className="dash__error">

          {error}

        </div>

      )}

      <div className="dash__body">

        {/* Camera */}

        <div className="dash__video-col">

          <div className="video-panel">

            <div className="video-panel__frame">

              {running ? (

                <img
                  src={videoFeedUrl()}
                  alt="camera"
                  className="video-panel__img"
                />

              ) : (

                <div className="video-panel__placeholder">

                  Start session to begin monitoring

                </div>

              )}

            </div>

          </div>

        </div>


        {/* Right Section */}

        <div className="dash__stats-col">

          <div className="score-block">

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "15px"
              }}
            >

              <ScoreRing
                score={status.score}
                size={100}
              />

              <StatusBadge
                status={status.final}
              />

            </div>

          </div>

          <QuestionsPanel
            isRunning={running}
            onQuestionAnswered={(result) => {

              setQuestionHistory(
                prev => [
                  result,
                  ...prev
                ]
              );

            }}
          />

        </div>

      </div>


      {showQuestionReport && (

        <QuestionReportModal
          isOpen={showQuestionReport}
          onClose={() =>
            setShowQuestionReport(false)
          }
          questionHistory={questionHistory}
          totalQuestions={20}
          sessionDuration={
            questionHistory.length * 120
          }
          detectionSummary={summary}
        />

      )}

    </div>
  );

}