// // import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from './assets/vite.svg'
// // import heroImg from './assets/hero.png'
// // import './App.css'

// // function App() {
// //   const [count, setCount] = useState(0)

// //   return (
// //     <>
// //       <section id="center">
// //         <div className="hero">
// //           <img src={heroImg} className="base" width="170" height="179" alt="" />
// //           <img src={reactLogo} className="framework" alt="React logo" />
// //           <img src={viteLogo} className="vite" alt="Vite logo" />
// //         </div>
// //         <div>
// //           <h1>Get started</h1>
// //           <p>
// //             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
// //           </p>
// //         </div>
// //         <button
// //           type="button"
// //           className="counter"
// //           onClick={() => setCount((count) => count + 1)}
// //         >
// //           Count is {count}
// //         </button>
// //       </section>

// //       <div className="ticks"></div>

// //       <section id="next-steps">
// //         <div id="docs">
// //           <svg className="icon" role="presentation" aria-hidden="true">
// //             <use href="/icons.svg#documentation-icon"></use>
// //           </svg>
// //           <h2>Documentation</h2>
// //           <p>Your questions, answered</p>
// //           <ul>
// //             <li>
// //               <a href="https://vite.dev/" target="_blank">
// //                 <img className="logo" src={viteLogo} alt="" />
// //                 Explore Vite
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://react.dev/" target="_blank">
// //                 <img className="button-icon" src={reactLogo} alt="" />
// //                 Learn more
// //               </a>
// //             </li>
// //           </ul>
// //         </div>
// //         <div id="social">
// //           <svg className="icon" role="presentation" aria-hidden="true">
// //             <use href="/icons.svg#social-icon"></use>
// //           </svg>
// //           <h2>Connect with us</h2>
// //           <p>Join the Vite community</p>
// //           <ul>
// //             <li>
// //               <a href="https://github.com/vitejs/vite" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#github-icon"></use>
// //                 </svg>
// //                 GitHub
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://chat.vite.dev/" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#discord-icon"></use>
// //                 </svg>
// //                 Discord
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://x.com/vite_js" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#x-icon"></use>
// //                 </svg>
// //                 X.com
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://bsky.app/profile/vite.dev" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#bluesky-icon"></use>
// //                 </svg>
// //                 Bluesky
// //               </a>
// //             </li>
// //           </ul>
// //         </div>
// //       </section>

// //       <div className="ticks"></div>
// //       <section id="spacer"></section>
// //     </>
// //   )
// // }

// // export default App
// import React from 'react';
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate
// } from 'react-router-dom';

// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import DashboardPage from './pages/DashboardPage';
// import HistoryPage from './pages/HistoryPage';
// import SessionDetailPage from './pages/SessionDetailPage';

// function ProtectedRoute({ children, allowedRole }) {

//   const user = JSON.parse(
//     localStorage.getItem('user')
//   );

//   // NOT LOGGED IN
//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   // ROLE NOT ALLOWED
//   if (user.role !== allowedRole) {

//     // USER trying to access admin page
//     if (user.role === 'user') {
//       return <Navigate to="/dashboard" />;
//     }

//     // ADMIN trying to access user page
//     if (user.role === 'admin') {
//       return <Navigate to="/history" />;
//     }
//   }

//   return children;
// }

// export default function App() {

//   return (

//     <BrowserRouter>

//       <Routes>

//         {/* PUBLIC */}

//         <Route
//           path="/login"
//           element={<LoginPage />}
//         />

//         <Route
//           path="/register"
//           element={<RegisterPage />}
//         />

//         {/* USER ONLY */}

//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute allowedRole="user">
//               <DashboardPage />
//             </ProtectedRoute>
//           }
//         />

//         {/* ADMIN ONLY */}

//         <Route
//           path="/history"
//           element={
//             <ProtectedRoute allowedRole="admin">
//               <HistoryPage />
//             </ProtectedRoute>
//           }
//         />

//         {/* DEFAULT */}

//         <Route
//           path="*"
//           element={<Navigate to="/login" />}
//         />

//       </Routes>

//       <Route
//         path="/session/:id"
//         element={<SessionDetailPage />}
//     />

//     </BrowserRouter>
//   );
// }
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import SessionDetailPage from './pages/SessionDetailPage';


function ProtectedRoute({
  children,
  allowedRole
}) {

  const user = JSON.parse(
    localStorage.getItem('user')
  );

  // User not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Role restriction
  if (user.role !== allowedRole) {

    if (user.role === 'user') {
      return <Navigate to="/dashboard" />;
    }

    if (user.role === 'admin') {
      return <Navigate to="/history" />;
    }
  }

  return children;
}


export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Public Routes */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />


        {/* User Routes */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="user">
              <DashboardPage />
            </ProtectedRoute>
          }
        />


        {/* Admin Routes */}

        <Route
          path="/history"
          element={
            <ProtectedRoute allowedRole="admin">
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/session/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <SessionDetailPage />
            </ProtectedRoute>
          }
        />


        {/* Default */}

        <Route
          path="*"
          element={<Navigate to="/login" />}
        />

      </Routes>

    </BrowserRouter>

  );
}