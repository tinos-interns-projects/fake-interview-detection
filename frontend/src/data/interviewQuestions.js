// Mock interview questions data structure
export const interviewQuestions = [
  {
    id: 1,
    category: "Technical",
    question: "Can you explain the difference between React hooks and class components?",
    difficulty: "Medium",
    timeLimit: 120,
    tags: ["React", "JavaScript", "Frontend"]
  },
  {
    id: 2,
    category: "Behavioral",
    question: "Tell me about a time when you had to deal with a difficult team member.",
    difficulty: "Easy",
    timeLimit: 90,
    tags: ["Teamwork", "Communication", "Problem-solving"]
  },
  {
    id: 3,
    category: "Technical",
    question: "How would you optimize the performance of a web application?",
    difficulty: "Hard",
    timeLimit: 150,
    tags: ["Performance", "Optimization", "Web Development"]
  },
  {
    id: 4,
    category: "System Design",
    question: "Design a URL shortening service like bit.ly.",
    difficulty: "Hard",
    timeLimit: 180,
    tags: ["System Design", "Architecture", "Scalability"]
  },
  {
    id: 5,
    category: "Behavioral",
    question: "Why do you want to work for our company?",
    difficulty: "Easy",
    timeLimit: 60,
    tags: ["Motivation", "Company Culture", "Career Goals"]
  },
  {
    id: 6,
    category: "Technical",
    question: "What is the Event Loop in JavaScript?",
    difficulty: "Medium",
    timeLimit: 120,
    tags: ["JavaScript", "Async", "Core Concepts"]
  },
  {
    id: 7,
    category: "Problem Solving",
    question: "How would you handle a situation where you disagree with your manager's technical decision?",
    difficulty: "Medium",
    timeLimit: 90,
    tags: ["Communication", "Leadership", "Conflict Resolution"]
  },
  {
    id: 8,
    category: "Technical",
    question: "Explain RESTful API design principles.",
    difficulty: "Medium",
    timeLimit: 120,
    tags: ["API", "REST", "Backend"]
  },
  {
    id: 9,
    category: "Technical",
    question: "What is the difference between let, const, and var in JavaScript?",
    difficulty: "Easy",
    timeLimit: 90,
    tags: ["JavaScript", "ES6", "Variables"]
  },
  {
    id: 10,
    category: "Behavioral",
    question: "Describe a challenging project you worked on and how you overcame obstacles.",
    difficulty: "Medium",
    timeLimit: 120,
    tags: ["Project Management", "Problem-solving", "Leadership"]
  },
  {
    id: 11,
    category: "Technical",
    question: "How does CSS specificity work?",
    difficulty: "Medium",
    timeLimit: 100,
    tags: ["CSS", "Styling", "Frontend"]
  },
  {
    id: 12,
    category: "System Design",
    question: "Design a messaging app like WhatsApp.",
    difficulty: "Hard",
    timeLimit: 200,
    tags: ["System Design", "Real-time", "Architecture"]
  },
  {
    id: 13,
    category: "Technical",
    question: "What is CORS and how do you handle it?",
    difficulty: "Medium",
    timeLimit: 100,
    tags: ["Web Security", "API", "HTTP"]
  },
  {
    id: 14,
    category: "Behavioral",
    question: "How do you stay updated with the latest technology trends?",
    difficulty: "Easy",
    timeLimit: 80,
    tags: ["Learning", "Professional Development", "Technology"]
  },
  {
    id: 15,
    category: "Technical",
    question: "Explain the concept of closures in JavaScript.",
    difficulty: "Hard",
    timeLimit: 140,
    tags: ["JavaScript", "Advanced", "Functions"]
  },
  {
    id: 16,
    category: "Problem Solving",
    question: "How would you debug a slow-loading web page?",
    difficulty: "Medium",
    timeLimit: 110,
    tags: ["Debugging", "Performance", "Web Development"]
  },
  {
    id: 17,
    category: "Technical",
    question: "What is the Virtual DOM and how does it work?",
    difficulty: "Medium",
    timeLimit: 120,
    tags: ["React", "Performance", "Frontend"]
  },
  {
    id: 18,
    category: "Behavioral",
    question: "Tell me about a time you failed at something and what you learned.",
    difficulty: "Easy",
    timeLimit: 90,
    tags: ["Learning", "Growth Mindset", "Resilience"]
  },
  {
    id: 19,
    category: "System Design",
    question: "Design a social media feed like Instagram.",
    difficulty: "Hard",
    timeLimit: 180,
    tags: ["System Design", "Database", "Scalability"]
  },
  {
    id: 20,
    category: "Technical",
    question: "What are promises and async/await in JavaScript?",
    difficulty: "Medium",
    timeLimit: 110,
    tags: ["JavaScript", "Async", "ES6"]
  }
];

// Question status tracking
export const questionStatuses = {
  PENDING: 'pending',
  ASKED: 'asked',
  ANSWERED: 'answered',
  SKIPPED: 'skipped'
};

// Helper functions for question management
export const getRandomQuestion = (excludeIds = []) => {
  const availableQuestions = interviewQuestions.filter(q => !excludeIds.includes(q.id));
  if (availableQuestions.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  return availableQuestions[randomIndex];
};

export const getQuestionsByCategory = (category) => {
  return interviewQuestions.filter(q => q.category === category);
};

export const getQuestionsByDifficulty = (difficulty) => {
  return interviewQuestions.filter(q => q.difficulty === difficulty);
};
