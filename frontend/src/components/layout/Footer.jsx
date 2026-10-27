import React from 'react';
import { Ticket, Film, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: '#050811',
        borderTop: '1px solid rgba(148, 163, 184, 0.1)',
        padding: '3rem 0 2rem',
        marginTop: '5rem',
        color: '#94A3B8'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem'
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Ticket size={18} color="#FFFFFF" />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#F8FAFC'
                }}
              >
                IMOVIES
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>
              Your seat. Your story. Experience frictionless movie reservations with instant seat mapping and server-validated bookings.
            </p>
            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Serving Indore multiplexes & premiere theatres nationwide.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/" style={{ transition: 'color 0.15s' }}>
                  Now Screening
                </Link>
              </li>
              <li>
                <Link to="/my-tickets" style={{ transition: 'color 0.15s' }}>
                  My Booked Tickets
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ transition: 'color 0.15s' }}>
                  User Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ transition: 'color 0.15s' }}>
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Educational Disclaimer */}
          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Academic Capstone Project
            </h4>
            <div
              style={{
                padding: '1rem',
                borderRadius: '10px',
                background: 'rgba(14, 22, 43, 0.7)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                fontSize: '0.825rem',
                lineHeight: 1.5
              }}
            >
              This website is an individual college capstone demonstration project developed for B.Tech Computer Science. All cinema bookings are simulated safely on real MongoDB data.
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(148, 163, 184, 0.08)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.85rem'
          }}
        >
          <div>
            © {currentYear} IMovies Entertainment System. Built for academic capstone presentation.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748B' }}>
            <span>Engineered with React & Node.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
