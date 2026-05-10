import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './Layout.css';

const NAV = [
  { to: '/dashboard', label: 'Live Monitor',  icon: '⬡' },
  { to: '/history',   label: 'Session Log',   icon: '≡' },
];

export default function Layout() {
  const navigate  = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const raw  = localStorage.getItem('user');
  const user = raw ? JSON.parse(raw) : {};

  function logout() {
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <div className={`layout ${collapsed ? 'layout--collapsed' : ''}`}>
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <span className="sidebar__logo-icon">◈</span>
            {!collapsed && <span className="sidebar__logo-text">InterviewShield</span>}
          </div>
          <button className="sidebar__toggle" onClick={() => setCollapsed(c => !c)}>
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        <nav className="sidebar__nav">
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
            >
              <span className="sidebar__link-icon">{n.icon}</span>
              {!collapsed && <span className="sidebar__link-label">{n.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__avatar">{user.name?.[0]?.toUpperCase() ?? 'A'}</div>
            {!collapsed && (
              <div className="sidebar__user-info">
                <div className="sidebar__user-name">{user.name ?? 'Admin'}</div>
                <div className="sidebar__user-email">{user.email ?? ''}</div>
              </div>
            )}
          </div>
          <button className="btn btn-ghost sidebar__logout" onClick={logout}>
            <span>⏻</span>
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}