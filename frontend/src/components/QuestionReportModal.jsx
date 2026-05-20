// import React from 'react';
// import './QuestionReportModal.css';

// const QuestionReportModal = ({ isOpen, onClose, questionHistory, totalQuestions, sessionDuration, detectionSummary }) => {
//   if (!isOpen) return null;

//   const attendedCount = questionHistory.filter(q => q.status === 'answered').length;
//   const rejectedCount = questionHistory.filter(q => q.status === 'skipped').length;
//   const successRate = questionHistory.length > 0 ? Math.round((attendedCount / questionHistory.length) * 100) : 0;

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case 'Easy': return '#10b981';
//       case 'Medium': return '#f59e0b';
//       case 'Hard': return '#ef4444';
//       default: return '#6b7280';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'answered': return '✅';
//       case 'skipped': return '⏭️';
//       default: return '⏳';
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   return (
//     <div className="question-report-overlay" onClick={onClose}>
//       <div className="question-report-modal" onClick={e => e.stopPropagation()}>
//         {/* Header */}
//         <div className="question-report__header">
//           <h2>📊 Interview Question Report</h2>
//           <button className="question-report__close" onClick={onClose}>✕</button>
//         </div>

//         {/* Detection Scores */}
//         {detectionSummary && (
//           <div className="question-report__detection">
//             <h3>🔍 Detection Analysis</h3>
//             <div className="question-report__detection-grid">
//               <div className="question-report__detection-item">
//                 <div className="question-report__detection-number" style={{ 
//                   color: detectionSummary.avgScore > 70 ? '#10b981' : 
//                          detectionSummary.avgScore > 40 ? '#f59e0b' : '#ef4444' 
//                 }}>
//                   {detectionSummary.avgScore}
//                 </div>
//                 <div className="question-report__detection-label">Average Score</div>
//               </div>
//               <div className="question-report__detection-item">
//                 <div className="question-report__detection-number" style={{ 
//                   color: detectionSummary.maxScore > 80 ? '#10b981' : 
//                          detectionSummary.maxScore > 50 ? '#f59e0b' : '#ef4444' 
//                 }}>
//                   {detectionSummary.maxScore}
//                 </div>
//                 <div className="question-report__detection-label">Max Score</div>
//               </div>
//               <div className="question-report__detection-item">
//                 <div className="question-report__detection-number" style={{ 
//                   color: detectionSummary.suspCount === 0 ? '#10b981' : 
//                          detectionSummary.suspCount > 3 ? '#ef4444' : '#f59e0b' 
//                 }}>
//                   {detectionSummary.suspCount}
//                 </div>
//                 <div className="question-report__detection-label">Suspicious Events</div>
//               </div>
//               <div className="question-report__detection-item">
//                 <div className="question-report__detection-verdict" style={{ 
//                   color: detectionSummary.verdict === 'Normal' ? '#10b981' : 
//                          detectionSummary.verdict === 'Warning' ? '#f59e0b' : '#ef4444' 
//                 }}>
//                   {detectionSummary.verdict}
//                 </div>
//                 <div className="question-report__detection-label">Final Verdict</div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Summary Statistics */}
// <div className="question-summary-stats">

//   {/* Total Questions */}
//   <div className="question-stat-item">
//     <div className="question-stat-number">
//       {questionHistory.length}
//     </div>

//     <div className="question-stat-label">
//       Total Questions
//     </div>
//   </div>


//   {/* Attended */}
//   <div className="question-stat-item">
//     <div
//       className="question-stat-number"
//       style={{ color: '#10b981' }}
//     >
//       {
//         questionHistory.filter(
//           q =>
//             q.status?.toLowerCase() ===
//             'answered'
//         ).length
//       }
//     </div>

//     <div className="question-stat-label">
//       Attended
//     </div>
//   </div>


//   {/* Rejected / Skipped */}
//   <div className="question-stat-item">
//     <div
//       className="question-stat-number"
//       style={{ color: '#ef4444' }}
//     >
//       {
//         questionHistory.filter(
//           q =>
//             q.status?.toLowerCase() === 'skipped' ||
//             q.status?.toLowerCase() === 'rejected'
//         ).length
//       }
//     </div>

//     <div className="question-stat-label">
//       Rejected
//     </div>
//   </div>


//   {/* Success Rate */}
//   <div className="question-stat-item">
//     <div
//       className="question-stat-number"
//       style={{ color: '#3b82f6' }}
//     >
//       {
//         questionHistory.length > 0
//           ? Math.round(
//               (
//                 questionHistory.filter(
//                   q =>
//                     q.status?.toLowerCase() ===
//                     'answered'
//                 ).length /
//                 questionHistory.length
//               ) * 100
//             )
//           : 0
//       }%
//     </div>

//     <div className="question-stat-label">
//       Success Rate
//     </div>
//   </div>

// </div>
//         <div className="question-summary-stats">

//   {/* Total Questions */}

//   <div className="question-stat-item">

//     <div className="question-stat-number">

//       {questions.length}

//     </div>

//     <div className="question-stat-label">

//       Total Questions

//     </div>

//   </div>


//   {/* Attended */}

//   <div className="question-stat-item">

//     <div
//       className="question-stat-number"
//       style={{
//         color: 'var(--ok)'
//       }}
//     >

//       {
//         questions.filter(
//           q =>
//             q.status
//             ?.toLowerCase() ===
//             'answered'
//         ).length
//       }

//     </div>

//     <div className="question-stat-label">

//       Attended

//     </div>

//   </div>


//   {/* Rejected / Skipped */}

//   <div className="question-stat-item">

//     <div
//       className="question-stat-number"
//       style={{
//         color: 'var(--danger)'
//       }}
//     >

//       {
//         questions.filter(
//           q =>

//             q.status
//             ?.toLowerCase() ===
//             'skipped' ||

//             q.status
//             ?.toLowerCase() ===
//             'rejected'

//         ).length
//       }

//     </div>

//     <div className="question-stat-label">

//       Rejected

//     </div>

//   </div>


//   {/* Success Percentage */}

//   <div className="question-stat-item">

//     <div
//       className="question-stat-number"
//       style={{
//         color:'var(--primary)'
//       }}
//     >

//       {

//         questions.length > 0

//         ?

//         Math.round(

//           (

//             questions.filter(
//               q =>
//                 q.status
//                 ?.toLowerCase() ===
//                 'answered'
//             ).length

//             /

//             questions.length

//           ) * 100

//         )

//         : 0

//       }%

//     </div>

//     <div className="question-stat-label">

//       Success Rate

//     </div>

//   </div>

// </div>

//         {/* Progress Overview */}
//         <div className="question-report__progress">
//           <div className="question-report__progress-bar">
//             <div 
//               className="question-report__progress-fill" 
//               style={{ width: `${(questionHistory.length / totalQuestions) * 100}%` }}
//             ></div>
//           </div>
//           <div className="question-report__progress-text">
//             {questionHistory.length} of {totalQuestions} questions completed ({Math.round((questionHistory.length / totalQuestions) * 100)}%)
//           </div>
//         </div>

//         {/* Detailed Question List */}
//         <div className="question-report__questions">
//           <h3>Question Details</h3>
//           <div className="question-report__list">
//             {questionHistory.map((question, index) => (
//               <div key={index} className="question-report__item">
//                 <div className="question-report__item-header">
//                   <div className="question-report__item-number">
//                     {getStatusIcon(question.status)} Q{question.questionNumber}
//                   </div>
//                   <div className="question-report__item-meta">
//                     <span 
//                       className="question-report__difficulty"
//                       style={{ color: getDifficultyColor(question.difficulty) }}
//                     >
//                       {question.difficulty}
//                     </span>
//                     <span className="question-report__category">{question.category}</span>
//                   </div>
//                   <div className="question-report__item-time">
//                     {question.askedAt} • {formatTime(question.timeSpent)}
//                   </div>
//                 </div>
//                 <div className="question-report__item-question">
//                   {question.question}
//                 </div>
//                 <div className="question-report__item-status">
//                   Status: <span style={{ 
//                     color: question.status === 'answered' ? '#10b981' : '#f59e0b',
//                     fontWeight: 600
//                   }}>
//                     {question.status === 'answered' ? 'Answered' : 'Skipped'}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Footer Actions */}
//         <div className="question-report__footer">
//           <button className="question-report__btn question-report__btn--primary" onClick={onClose}>
//             Close Report
//           </button>
//           <button className="question-report__btn question-report__btn--secondary">
//             📥 Download Report
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuestionReportModal;
import React from 'react';
import './QuestionReportModal.css';

const QuestionReportModal = ({
  isOpen,
  onClose,
  questionHistory = [],
  totalQuestions = 20,
  sessionDuration,
  detectionSummary
}) => {

  if (!isOpen) return null;

  const attendedCount =
    questionHistory.filter(
      q => q.status?.toLowerCase() === 'answered'
    ).length;

  const rejectedCount =
    questionHistory.filter(
      q =>
        q.status?.toLowerCase() === 'skipped' ||
        q.status?.toLowerCase() === 'rejected'
    ).length;

  const successRate =
    questionHistory.length > 0
      ? Math.round(
          (attendedCount /
            questionHistory.length) * 100
        )
      : 0;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return '#10b981';

      case 'Medium':
        return '#f59e0b';

      case 'Hard':
        return '#ef4444';

      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {

    switch (status) {

      case 'answered':
        return '✅';

      case 'skipped':
        return '⏭️';

      case 'rejected':
        return '❌';

      default:
        return '⏳';
    }
  };

  const formatTime = (seconds = 0) => {

    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${mins}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (

    <div
      className="question-report-overlay"
      onClick={onClose}
    >

      <div
        className="question-report-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}

        <div className="question-report__header">

          <h2>
            📊 Interview Question Report
          </h2>

          <button
            className="question-report__close"
            onClick={onClose}
          >
            ✕
          </button>

        </div>


        {/* Detection */}

        {detectionSummary && (

          <div className="question-report__detection">

            <h3>
              🔍 Detection Analysis
            </h3>

            <div className="question-report__detection-grid">

              <div className="question-report__detection-item">

                <div
                  className="question-report__detection-number"
                >
                  {detectionSummary.avgScore}
                </div>

                <div className="question-report__detection-label">

                  Average Score

                </div>

              </div>

              <div className="question-report__detection-item">

                <div
                  className="question-report__detection-number"
                >
                  {detectionSummary.maxScore}
                </div>

                <div className="question-report__detection-label">

                  Max Score

                </div>

              </div>

              <div className="question-report__detection-item">

                <div
                  className="question-report__detection-number"
                >
                  {detectionSummary.suspCount}
                </div>

                <div className="question-report__detection-label">

                  Suspicious Events

                </div>

              </div>

              <div className="question-report__detection-item">

                <div
                  className="question-report__detection-verdict"
                >
                  {detectionSummary.verdict}
                </div>

                <div className="question-report__detection-label">

                  Verdict

                </div>

              </div>

            </div>

          </div>

        )}


        {/* SAME UI Summary */}

        <div className="question-summary-stats">

          <div className="question-stat-item">

            <div className="question-stat-number">

              {questionHistory.length}

            </div>

            <div className="question-stat-label">

              Total Questions

            </div>

          </div>


          <div className="question-stat-item">

            <div
              className="question-stat-number"
              style={{
                color:'var(--ok)'
              }}
            >

              {attendedCount}

            </div>

            <div className="question-stat-label">

              Attended

            </div>

          </div>


          <div className="question-stat-item">

            <div
              className="question-stat-number"
              style={{
                color:'var(--danger)'
              }}
            >

              {rejectedCount}

            </div>

            <div className="question-stat-label">

              Rejected

            </div>

          </div>


          <div className="question-stat-item">

            <div
              className="question-stat-number"
              style={{
                color:'var(--primary)'
              }}
            >

              {successRate}%

            </div>

            <div className="question-stat-label">

              Success Rate

            </div>

          </div>

        </div>


        {/* Progress */}

        <div className="question-report__progress">

          <div className="question-report__progress-bar">

            <div
              className="question-report__progress-fill"
              style={{
                width: `${
                  (questionHistory.length /
                    totalQuestions) * 100
                }%`
              }}
            />

          </div>

          <div className="question-report__progress-text">

            {questionHistory.length}
            {" "}of{" "}
            {totalQuestions}
            {" "}questions completed

          </div>

        </div>


        {/* Question List */}

        <div className="question-report__questions">

          <h3>

            Question Details

          </h3>

          <div className="question-report__list">

            {questionHistory.map(
              (question,index)=>(

              <div
                key={index}
                className="question-report__item"
              >

                <div className="question-report__item-header">

                  <div className="question-report__item-number">

                    {getStatusIcon(
                      question.status
                    )}

                    {" "}Q{
                      question.questionNumber
                    }

                  </div>

                  <div className="question-report__item-meta">

                    <span
                      className="question-report__difficulty"
                      style={{
                        color:
                        getDifficultyColor(
                          question.difficulty
                        )
                      }}
                    >

                      {question.difficulty}

                    </span>

                  </div>

                  <div className="question-report__item-time">

                    {formatTime(
                      question.timeSpent
                    )}

                  </div>

                </div>

                <div className="question-report__item-question">

                  {question.question}

                </div>

                <div className="question-report__item-status">

                  Status:

                  <span
                    style={{
                      marginLeft:10,
                      fontWeight:600
                    }}
                  >

                    {question.status}

                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>


        <div className="question-report__footer">

          <button
            className="question-report__btn question-report__btn--primary"
            onClick={onClose}
          >

            Close Report

          </button>

        </div>

      </div>

    </div>
  );
};

export default QuestionReportModal;
