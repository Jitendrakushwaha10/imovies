import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Ticket, Lock, Mail, ArrowRight, UserCheck, Shield } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const { login } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Please enter both your email address and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      success('Welcome back! Signed in successfully.');
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setFormError(null);
  };

  return (
    <div
      className="container"
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.25rem'
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.25rem 2rem',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
            }}
          >
            <Ticket size={24} color="#FFFFFF" />
          </div>
          <h1 style={{ fontSize: '1.6rem', color: '#F8FAFC', marginBottom: '0.35rem' }}>
            Welcome Back
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Sign in to manage your tickets and cinema reservations
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div
          style={{
            background: 'rgba(14, 22, 43, 0.8)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '10px',
            padding: '0.85rem',
            marginBottom: '1.5rem'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 600, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            ⚡ College Evaluation Fast Fill:
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => fillCredentials('student@imovies.com', 'Student@123')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.775rem', padding: '0.35rem' }}
            >
              <UserCheck size={13} color="#38BDF8" />
              Student Demo
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin@imovies.com', 'Admin@123')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.775rem', padding: '0.35rem' }}
            >
              <Shield size={13} color="#F59E0B" />
              Admin Demo
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {formError && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#F8FAFC',
              fontSize: '0.875rem',
              marginBottom: '1.25rem'
            }}
          >
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                color="#94A3B8"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                color="#94A3B8"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
          >
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#94A3B8' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: '#38BDF8', fontWeight: 600 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};
