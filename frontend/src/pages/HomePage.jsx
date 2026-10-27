import React, { useState, useEffect, useCallback } from 'react';
import { MovieSearch } from '../components/movies/MovieSearch';
import { GenreFilters } from '../components/movies/GenreFilters';
import { MovieGrid } from '../components/movies/MovieGrid';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { api } from '../services/api';
import { Sparkles, Clapperboard, ChevronRight, SlidersHorizontal } from 'lucide-react';

export const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('top-rated');

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getMovies({
        search: searchQuery,
        genre: selectedGenre,
        sort: sortBy
      });
      if (res.success) {
        setMovies(res.movies || []);
      }
    } catch (err) {
      console.error('Failed to fetch movies:', err);
      setError(err.message || 'Unable to connect to cinema servers.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedGenre, sortBy]);

  useEffect(() => {
    // Debounce search slightly for responsive typing
    const timer = setTimeout(() => {
      fetchMovies();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchMovies]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSortBy('top-rated');
  };

  const featuredMovie = movies.find((m) => m.featured) || movies[0];

  return (
    <div>
      {/* Cinematic Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '4.5rem 0 3.5rem',
          background: 'linear-gradient(180deg, rgba(14, 22, 43, 0.7) 0%, rgba(7, 11, 22, 1) 100%)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '820px' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#38BDF8',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '1.25rem'
            }}
          >
            <Sparkles size={14} />
            <span>Now Screening in Indore Multiplexes & Nationwide</span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
              color: '#F8FAFC'
            }}
          >
            Pick a film.{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #38BDF8 0%, #3B82F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Pick your seat.
            </span>
          </h1>

          {/* Supporting Text */}
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: '#94A3B8',
              lineHeight: 1.6,
              marginBottom: '2rem'
            }}
          >
            Discover your next favorite movie and book your cinema experience in just a few clicks. Real-time seat layouts, zero double-bookings.
          </p>

          {/* Prominent Search Bar */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <MovieSearch
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />
          </div>

          {/* Quick Hero Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <a href="#movies-catalog" className="btn btn-primary">
              <Clapperboard size={16} />
              Explore Movies
            </a>
            <a href="#movies-catalog" className="btn btn-secondary">
              Browse Shows
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Main Movies Catalog Section */}
      <section id="movies-catalog" className="container" style={{ paddingTop: '3rem' }}>
        {/* Filter and Sorting Controls */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          {/* Genre Filters */}
          <div style={{ flex: '1 1 300px' }}>
            <GenreFilters
              activeGenre={selectedGenre}
              onSelectGenre={setSelectedGenre}
            />
          </div>

          {/* Sorting Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <SlidersHorizontal size={16} color="#94A3B8" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control"
              style={{
                width: 'auto',
                padding: '0.45rem 1.85rem 0.45rem 0.85rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                background: 'var(--color-surface)',
                color: '#F8FAFC'
              }}
              aria-label="Sort movies"
            >
              <option value="top-rated">Top Rated</option>
              <option value="newest">Recently Added</option>
              <option value="alphabetical">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <LoadingSpinner message="Fetching latest cinema titles..." />
        ) : error ? (
          <ErrorState
            title="Failed to Load Movies"
            message={error}
            onRetry={fetchMovies}
          />
        ) : (
          <MovieGrid movies={movies} onClearSearch={handleResetFilters} />
        )}
      </section>
    </div>
  );
};
