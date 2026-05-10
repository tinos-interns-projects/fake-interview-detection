import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiLogin } from '../utils/api';
import './AuthPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiLogin(form);
      if (data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('Network error — is the server running?');
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg__grid" />
        <div className="auth-bg__glow" />
      </div>

      <div className="auth-card animate-fade-in">
        <div className="auth-card__brand">
          <span className="auth-card__brand-icon">◈</span>
          <span className="auth-card__brand-name">InterviewShield</span>
        </div>

        <div className="auth-card__headline">
          <h1>Admin Access</h1>
          <p className="serif">Sign in to monitor live sessions</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              className="input-field"
              type="email"
              placeholder="admin@company.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In →'}
          </button>
        </form>

        <div className="auth-card__footer">
          No account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}