import React, { useState, useEffect } from 'react';
import { interviewQuestions, questionStatuses } from '../data/interviewQuestions';

const QuestionsPanel = ({ isRunning, onQuestionAsked, onQuestionAnswered }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [questionStats, setQuestionStats] = useState({
    total: 0,
    attended: 0,
    rejected: 0,
    currentIndex: 0,
    totalQuestions: interviewQuestions.length
  });

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            handleQuestionTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  const startQuestionSession = () => {
    if (!isRunning) {
      alert('Please start the interview session first!');
      return;
    }
    
    setSessionStarted(true);
    setCurrentQuestionIndex(0);
    const firstQuestion = interviewQuestions[0];
    setCurrentQuestion(firstQuestion);
    setTimeRemaining(firstQuestion.timeLimit);
    setIsTimerActive(true);
    onQuestionAsked?.(firstQuestion);
  };

  const handleQuestionAnswered = (status) => {
    if (!currentQuestion || !sessionStarted) return;

    const historyEntry = {
      ...currentQuestion,
      status,
      askedAt: new Date().toLocaleTimeString(),
      timeSpent: currentQuestion.timeLimit - timeRemaining,
      questionNumber: currentQuestionIndex + 1
    };

    setQuestionHistory(prev => [historyEntry, ...prev]);

    // Update statistics
    setQuestionStats(prev => {
      const newStats = { ...prev };
      newStats.total += 1;
      
      if (status === questionStatuses.ANSWERED) {
        newStats.attended += 1;
      } else if (status === questionStatuses.SKIPPED) {
        newStats.rejected += 1;
      }
      
      return newStats;
    });

    onQuestionAnswered?.(historyEntry);

    // Move to next question
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < interviewQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      const nextQuestion = interviewQuestions[nextIndex];
      setCurrentQuestion(nextQuestion);
      setTimeRemaining(nextQuestion.timeLimit);
      setIsTimerActive(true);
      onQuestionAsked?.(nextQuestion);
    } else {
      // Session completed
      setCurrentQuestion(null);
      setIsTimerActive(false);
      setTimeRemaining(0);
      setSessionStarted(false);
      alert('Interview session completed! All questions have been asked.');
    }
  };

  const handleQuestionTimeout = () => {
    handleQuestionAnswered(questionStatuses.SKIPPED);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'var(--ok)';
      case 'Medium': return 'var(--warn)';
      case 'Hard': return 'var(--danger)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="card questions-panel">
      {/* Header */}
      <div className="questions-panel__header">
        <div className="questions-panel__title">
          <span>📋 Interview Questions</span>
          {sessionStarted && currentQuestion && (
            <div className="questions-panel__timer" style={{ color: timeRemaining < 30 ? 'var(--danger)' : 'var(--ok)' }}>
              ⏱️ {formatTime(timeRemaining)}
            </div>
          )}
        </div>
        <div className="questions-panel__progress">
          Question {currentQuestionIndex + 1} of {interviewQuestions.length}
        </div>
      </div>

      {/* Statistics */}
      <div className="questions-panel__stats">
        <div className="questions-panel__stats-header">
          <span>📊 Session Progress</span>
          <span className="questions-panel__stats-total">Answered: {questionStats.total}</span>
        </div>
        <div className="questions-panel__stats-grid">
          <div className="questions-panel__stat-item">
            <span className="questions-panel__stat-number" style={{ color: 'var(--ok)' }}>
              {questionStats.attended}
            </span>
            <span className="questions-panel__stat-label">Attended</span>
          </div>
          <div className="questions-panel__stat-item">
            <span className="questions-panel__stat-number" style={{ color: 'var(--warn)' }}>
              {questionStats.rejected}
            </span>
            <span className="questions-panel__stat-label">Rejected</span>
          </div>
          <div className="questions-panel__stat-item">
            <span className="questions-panel__stat-number">
              {questionStats.total > 0 ? Math.round((questionStats.attended / questionStats.total) * 100) : 0}%
            </span>
            <span className="questions-panel__stat-label">Success Rate</span>
          </div>
        </div>
      </div>

      {/* Current Question */}
      {sessionStarted && currentQuestion ? (
        <div className="questions-panel__current">
          <div className="questions-panel__current-header">
            <span className="questions-panel__category">{currentQuestion.category}</span>
            <span 
              className="questions-panel__difficulty"
              style={{ color: getDifficultyColor(currentQuestion.difficulty) }}
            >
              {currentQuestion.difficulty}
            </span>
          </div>
          <div className="questions-panel__question-text">
            {currentQuestion.question}
          </div>
          <div className="questions-panel__actions">
            <button
              onClick={() => handleQuestionAnswered(questionStatuses.ANSWERED)}
              className="questions-panel__btn questions-panel__btn--success"
            >
              ✓ Answered
            </button>
            <button
              onClick={() => handleQuestionAnswered(questionStatuses.SKIPPED)}
              className="questions-panel__btn questions-panel__btn--skip"
            >
              ⏭️ Skip
            </button>
          </div>
        </div>
      ) : (
        <div className="questions-panel__idle">
          <div className="questions-panel__idle-content">
            <div className="questions-panel__idle-icon">📝</div>
            <h3>Ready to start the interview?</h3>
            <p>Click the button below to begin the sequential question session.</p>
            <p>You'll answer {interviewQuestions.length} questions one by one.</p>
          </div>
        </div>
      )}

      {/* Start/Continue Button */}
      {!sessionStarted ? (
        <button
          onClick={startQuestionSession}
          className="questions-panel__ask-btn"
          disabled={!isRunning}
        >
          {isRunning ? '🚀 Start Question Session' : '▶️ Start Interview First'}
        </button>
      ) : (
        <div className="questions-panel__session-info">
          <div className="questions-panel__session-progress">
            <div className="questions-panel__progress-bar">
              <div 
                className="questions-panel__progress-fill" 
                style={{ width: `${((currentQuestionIndex + 1) / interviewQuestions.length) * 100}%` }}
              ></div>
            </div>
            <span className="questions-panel__progress-text">
              {Math.round(((currentQuestionIndex + 1) / interviewQuestions.length) * 100)}% Complete
            </span>
          </div>
        </div>
      )}

      {/* Recent History
      {questionHistory.length > 0 && (
        <div className="questions-panel__history">
          <div className="questions-panel__history-header">
            <span>Recent Answers ({questionHistory.length})</span>
          </div>
          <div className="questions-panel__history-list">
            {questionHistory.slice(0, 3).map((entry, index) => (
              <div key={index} className="questions-panel__history-item">
                <div className="questions-panel__history-item-header">
                  <span>
                    {entry.status === questionStatuses.ANSWERED ? '✅' : '⏭️'} 
                    Q{entry.questionNumber} • {entry.askedAt}
                  </span>
                  <span style={{ color: getDifficultyColor(entry.difficulty) }}>
                    {entry.difficulty}
                  </span>
                </div>
                <div className="questions-panel__history-item-question">
                  {entry.question.length > 60 
                    ? entry.question.substring(0, 60) + '...' 
                    : entry.question}
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default QuestionsPanel;
