import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRegister } from '../utils/api';
import './AuthPage.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiRegister(form);
      if (data.status === 'success') {
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
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
          <h1>Create Account</h1>
          <p className="serif">Register as an admin proctoring officer</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
              className="input-field"
              type="text"
              placeholder="Jane Smith"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
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
            {loading ? 'Creating account...' : 'Register →'}
          </button>
        </form>

        <div className="auth-card__footer">
          Already registered? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}