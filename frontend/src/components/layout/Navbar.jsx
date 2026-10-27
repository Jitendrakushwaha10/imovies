import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Film, Ticket, Shield, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    info('Logged out successfully.');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.5rem 0.85rem',
    borderRadius: '8px',
    fontSize: '0.925rem',
    fontWeight: 500,
    color: isActive ? '#38BDF8' : '#94A3B8',
    background: isActive ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
    transition: 'all 0.15s ease'
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(7, 11, 22, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.12)'
      }}
    >
      <div
        className="container"
        style={{
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
            }}
          >
            <Ticket size={20} color="#FFFFFF" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                background: 'linear-gradient(90deg, #F8FAFC 0%, #38BDF8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              IMOVIES
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.75rem'
          }}
          className="desktop-nav"
        >
          <NavLink to="/" end style={navLinkStyle}>
            <Film size={17} />
            Movies
          </NavLink>

          <NavLink to="/my-tickets" style={navLinkStyle}>
            <Ticket size={17} />
            My Tickets
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin" style={navLinkStyle}>
              <Shield size={17} color="#38BDF8" />
              <span>Admin</span>
              <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.15rem 0.35rem' }}>
                PRO
              </span>
            </NavLink>
          )}
        </nav>

        {/* Desktop Auth Controls */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1rem'
          }}
          className="desktop-auth"
        >
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '20px',
                  background: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isAdmin ? 'rgba(56, 189, 248, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isAdmin ? '#38BDF8' : '#3B82F6'
                  }}
                >
                  <UserIcon size={16} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F8FAFC' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'capitalize' }}>
                    {user?.role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Sign out"
                style={{ padding: '0.45rem 0.65rem' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            color: '#F8FAFC',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center'
          }}
          className="mobile-toggle"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          <NavLink
            to="/"
            end
            style={navLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Film size={18} />
            Movies
          </NavLink>

          <NavLink
            to="/my-tickets"
            style={navLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Ticket size={18} />
            My Tickets
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              style={navLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Shield size={18} color="#38BDF8" />
              Admin Portal
            </NavLink>
          )}

          <div style={{ height: '1px', background: 'var(--color-border)', margin: '0.5rem 0' }} />

          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                Signed in as <strong style={{ color: '#F8FAFC' }}>{user?.name}</strong> ({user?.role})
              </div>
              <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ width: '100%' }}>
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link
                to="/login"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
