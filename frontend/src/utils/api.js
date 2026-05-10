const BASE = 'http://localhost:8000';



async function request(path, options = {}) {

  const res = await fetch(`${BASE}${path}`, {

    headers: { 'Content-Type': 'application/json', ...options.headers },

    ...options,

  });

  return res.json();

}



// Auth

export const apiRegister = (data)  => request('/register/', { method: 'POST', body: JSON.stringify(data) });

export const apiLogin    = (data)  => request('/login/',    { method: 'POST', body: JSON.stringify(data) });



// Camera

export const apiStart = (user_id)  => request('/start/', { method: 'POST', body: JSON.stringify({ user_id }) });

export const apiStop  = ()         => request('/stop/',  { method: 'POST' });



// Live

export const apiStatus = ()        => request('/status/');



// History / Sessions

export const apiHistory        = ()           => request('/history/');

export const apiSessionDetails = (id)         => request(`/session-details/${id}/`);

export const apiUserStats      = (user_id)    => request(`/user-stats/${user_id}/`);



// Reports

export const videoFeedUrl    = ()      => `${BASE}/video_feed/`;

export const reportUrl       = ()      => `${BASE}/report/`;

export const sessionReportUrl = (id)  => `${BASE}/session-report/${id}/`;



// Interview Questions

export const apiGetQuestions = ()           => request('/questions/');

export const apiGetQuestion = (id)          => request(`/questions/${id}/`);

export const apiCreateQuestion = (data)     => request('/questions/', { method: 'POST', body: JSON.stringify(data) });

export const apiUpdateQuestion = (id, data) => request(`/questions/${id}/`, { method: 'PUT', body: JSON.stringify(data) });

export const apiDeleteQuestion = (id)       => request(`/questions/${id}/`, { method: 'DELETE' });



// Question Sessions

export const apiStartQuestionSession = (data) => request('/question-sessions/', { method: 'POST', body: JSON.stringify(data) });

export const apiGetQuestionSessions = ()       => request('/question-sessions/');

export const apiGetQuestionSession = (id)      => request(`/question-sessions/${id}/`);

export const apiUpdateQuestionSession = (id, data) => request(`/question-sessions/${id}/`, { method: 'PUT', body: JSON.stringify(data) });



// Question Responses

export const apiSubmitQuestionResponse = (data) => request('/question-responses/', { method: 'POST', body: JSON.stringify(data) });

export const apiGetQuestionResponses = (sessionId) => request(`/question-responses/?session=${sessionId}`);