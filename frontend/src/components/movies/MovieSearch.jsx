import React from 'react';
import { Search, X } from 'lucide-react';

export const MovieSearch = ({ value, onChange, onClear, placeholder = 'Search movies by title, genre...' }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px'
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#94A3B8',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none'
        }}
      >
        <Search size={18} />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-control"
        style={{
          paddingLeft: '2.75rem',
          paddingRight: value ? '2.5rem' : '1rem',
          height: '46px',
          background: 'rgba(14, 22, 43, 0.9)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}
      />

      {value && (
        <button
          onClick={onClear}
          type="button"
          style={{
            position: 'absolute',
            right: '0.85rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            color: '#94A3B8',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
