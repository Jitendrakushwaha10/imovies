import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div
      className="container"
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1rem'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.1)',
          color: '#3B82F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}
      >
        <Film size={36} />
      </div>

      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800,
          color: '#F8FAFC',
          marginBottom: '0.5rem'
        }}
      >
        404
      </h1>
      <h2 style={{ fontSize: '1.35rem', color: '#CBD5E1', marginBottom: '0.75rem' }}>
        Scene Not Found
      </h2>
      <p
        style={{
          color: '#94A3B8',
          maxWidth: '460px',
          lineHeight: 1.6,
          marginBottom: '2rem'
        }}
      >
        The page or showtime you are looking for doesn't exist, was rescheduled, or has been moved.
      </p>

      <Link to="/" className="btn btn-primary">
        <Home size={16} />
        Back to Homepage
      </Link>
    </div>
  );
};
