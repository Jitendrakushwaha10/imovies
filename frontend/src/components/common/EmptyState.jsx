import React from 'react';
import { Film, Search, Ticket } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Film,
  title = 'No items found',
  description = 'There are no records matching your current filter or search criteria.',
  actionText,
  onAction
}) => {
  return (
    <div
      style={{
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        background: '#0E162B',
        borderRadius: '16px',
        border: '1px solid rgba(148, 163, 184, 0.12)',
        maxWidth: '520px',
        margin: '2rem auto'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.1)',
          color: '#38BDF8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem'
        }}
      >
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#F8FAFC' }}>
        {title}
      </h3>
      <p style={{ color: '#94A3B8', fontSize: '0.925rem', marginBottom: actionText ? '1.5rem' : 0 }}>
        {description}
      </p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};
