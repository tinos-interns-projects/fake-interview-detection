// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import './index.css';

// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import DashboardPage from './pages/DashboardPage';
// import HistoryPage from './pages/HistoryPage';
// import SessionDetailPage from './pages/SessionDetailPage';
// import Layout from './components/Layout';

// function PrivateRoute({ children }) {
//   const user = localStorage.getItem('user');
//   return user ? children : <Navigate to="/login" replace />;
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login"    element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />

//         <Route path="/" element={
//           <PrivateRoute><Layout /></PrivateRoute>
//         }>
//           <Route index element={<Navigate to="/dashboard" replace />} />
//           <Route path="dashboard"          element={<DashboardPage />} />
//           <Route path="history"            element={<HistoryPage />} />
//           <Route path="session/:sessionId" element={<SessionDetailPage />} />
//         </Route>

//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<React.StrictMode><App /></React.StrictMode>);
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import SessionDetailPage from './pages/SessionDetailPage';
import Layout from './components/Layout';

function PrivateRoute({ children }) {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={
          <PrivateRoute><Layout /></PrivateRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"          element={<DashboardPage />} />
          <Route path="history"            element={<HistoryPage />} />
          <Route path="session/:sessionId" element={<SessionDetailPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);