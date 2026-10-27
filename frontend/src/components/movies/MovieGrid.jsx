import React from 'react';
import { MovieCard } from './MovieCard';
import { EmptyState } from '../common/EmptyState';
import { Search } from 'lucide-react';

export const MovieGrid = ({ movies, onClearSearch }) => {
  if (!movies || movies.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No Movies Found"
        description="We couldn't find any films matching your search query or genre filter."
        actionText={onClearSearch ? 'Reset Filters' : undefined}
        onAction={onClearSearch}
      />
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
        gap: '1.5rem',
        marginTop: '1.5rem'
      }}
    >
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} />
      ))}
    </div>
  );
};
