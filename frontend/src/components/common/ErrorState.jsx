import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'We encountered an error while communicating with the IMovies service.',
  onRetry
}) => {
  return (
    <div
      style={{
        padding: '3rem 1.5rem',
        textAlign: 'center',
        background: '#0E162B',
        borderRadius: '16px',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        maxWidth: '540px',
        margin: '2rem auto'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#EF4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem'
        }}
      >
        <AlertCircle size={28} />
      </div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#F8FAFC' }}>
        {title}
      </h3>
      <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        {message}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary">
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
};
