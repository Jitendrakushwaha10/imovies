import React from 'react';

const GENRES = [
  'All',
  'Action',
  'Sci-Fi',
  'Drama',
  'Thriller',
  'Adventure',
  'Animation',
  'Comedy',
  'Romance'
];

export const GenreFilters = ({ activeGenre = 'All', onSelectGenre }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      {GENRES.map((genre) => {
        const isActive = activeGenre === genre;
        return (
          <button
            key={genre}
            onClick={() => onSelectGenre(genre)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              background: isActive ? '#3B82F6' : 'rgba(14, 22, 43, 0.8)',
              color: isActive ? '#FFFFFF' : '#94A3B8',
              border: isActive ? '1px solid #3B82F6' : '1px solid rgba(148, 163, 184, 0.15)',
              boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.35)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {genre}
          </button>
        );
      })}
    </div>
  );
};
