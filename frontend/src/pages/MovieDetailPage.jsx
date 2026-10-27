import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import {
  Star,
  Clock,
  Calendar,
  Globe,
  MapPin,
  Ticket,
  ChevronLeft,
  Film
} from 'lucide-react';

export const MovieDetailPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedShow, setSelectedShow] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getMovieById(movieId);
        if (res.success) {
          setMovie(res.movie);
          setShows(res.shows || []);
          if (res.shows && res.shows.length > 0) {
            setSelectedShow(res.shows[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch movie details:', err);
        setError(err.message || 'Movie could not be found.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading movie details and cinema showtimes..." />;
  }

  if (error || !movie) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <ErrorState
          title="Movie Unavailable"
          message={error || 'We could not locate details for this film.'}
          onRetry={() => navigate('/')}
        />
      </div>
    );
  }

  // Group shows by Theatre
  const showsByTheatre = shows.reduce((acc, show) => {
    const tId = show.theatre?._id || 'unknown';
    if (!acc[tId]) {
      acc[tId] = {
        theatre: show.theatre,
        shows: []
      };
    }
    acc[tId].shows.push(show);
    return acc;
  }, {});

  const formatDuration = (mins) => {
    if (!mins) return '2h 00m';
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  };

  return (
    <div>
      {/* Backdrop Hero Banner */}
      <div
        style={{
          position: 'relative',
          minHeight: '380px',
          background: movie.backdropUrl
            ? `linear-gradient(180deg, rgba(7, 11, 22, 0.4) 0%, rgba(7, 11, 22, 0.95) 100%), url(${movie.backdropUrl}) center/cover no-repeat`
            : 'linear-gradient(180deg, #14213D 0%, #070B16 100%)',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '3rem 0 2rem'
        }}
      >
        <div className="container">
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#94A3B8',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              background: 'rgba(14, 22, 43, 0.7)',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px'
            }}
          >
            <ChevronLeft size={16} />
            Back to Movies
          </Link>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2.5rem',
              alignItems: 'flex-end'
            }}
          >
            {/* Poster Card */}
            <div
              style={{
                width: '220px',
                flexShrink: 0,
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.7)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                backgroundColor: '#0a0f1d'
              }}
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60';
                }}
              />
            </div>

            {/* Header Details */}
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                <span className="badge badge-primary">Now Showing</span>
                {movie.genres?.map((g) => (
                  <span
                    key={g}
                    style={{
                      fontSize: '0.75rem',
                      color: '#E2E8F0',
                      background: 'rgba(14, 22, 43, 0.8)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(148, 163, 184, 0.2)'
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>

              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800 }}>
                {movie.title}
              </h1>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  color: '#94A3B8',
                  fontSize: '0.9rem',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#F59E0B', fontWeight: 700 }}>
                  <Star size={16} fill="#F59E0B" />
                  <span>{movie.rating ? movie.rating.toFixed(1) : '8.0'} / 10</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={16} />
                  <span>{formatDuration(movie.durationMinutes)}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Globe size={16} />
                  <span>{movie.language || 'English'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container" style={{ padding: '3rem 1.25rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem'
          }}
        >
          {/* Left Column: Synopsis & Metadata */}
          <div>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem', color: '#F8FAFC' }}>
              About the Movie
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: '#CBD5E1',
                lineHeight: 1.7,
                marginBottom: '2rem'
              }}
            >
              {movie.overview}
            </p>

            {movie.director && (
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#94A3B8', display: 'block', marginBottom: '0.25rem' }}>
                  Director
                </span>
                <span style={{ fontSize: '0.95rem', color: '#F8FAFC', fontWeight: 600 }}>
                  {movie.director}
                </span>
              </div>
            )}

            {movie.cast && movie.cast.length > 0 && (
              <div>
                <span style={{ fontSize: '0.85rem', color: '#94A3B8', display: 'block', marginBottom: '0.5rem' }}>
                  Starring Cast
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {movie.cast.map((c) => (
                    <span
                      key={c}
                      style={{
                        padding: '0.3rem 0.65rem',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        color: '#E2E8F0'
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Showtimes & Theatres Selection */}
          <div>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem', color: '#F8FAFC' }}>
              Select Show & Theatres (Indore)
            </h2>

            {shows.length === 0 ? (
              <div
                className="glass-card"
                style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}
              >
                <Film size={32} color="#64748B" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ color: '#F8FAFC', marginBottom: '0.5rem' }}>
                  No Active Shows Scheduled
                </h4>
                <p style={{ fontSize: '0.9rem' }}>
                  New showtimes for this film are being updated by theatre administrators. Check back shortly!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {Object.values(showsByTheatre).map(({ theatre, shows: tShows }) => (
                  <div
                    key={theatre?._id}
                    className="glass-card"
                    style={{ padding: '1.5rem' }}
                  >
                    <div style={{ marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>
                        {theatre?.name}
                      </h3>
                      <p style={{ fontSize: '0.825rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                        <MapPin size={13} color="#3B82F6" />
                        {theatre?.address}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {tShows.map((show) => {
                        const isSelected = selectedShow?._id === show._id;
                        const timeStr = new Date(show.showTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        });
                        const dateStr = new Date(show.showTime).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric'
                        });

                        return (
                          <button
                            key={show._id}
                            type="button"
                            onClick={() => setSelectedShow(show)}
                            style={{
                              padding: '0.65rem 1rem',
                              borderRadius: '8px',
                              background: isSelected ? '#3B82F6' : 'var(--color-surface-elevated)',
                              border: isSelected ? '1px solid #60A5FA' : '1px solid var(--color-border)',
                              color: isSelected ? '#FFFFFF' : '#E2E8F0',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '0.2rem',
                              boxShadow: isSelected ? '0 4px 14px rgba(59, 130, 246, 0.4)' : 'none',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span style={{ fontSize: '0.925rem', fontWeight: 700 }}>
                              {timeStr}
                            </span>
                            <span style={{ fontSize: '0.725rem', opacity: 0.85 }}>
                              {dateStr} • ₹{show.ticketPrice}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Continue to Seat Selection Button */}
                {selectedShow && (
                  <div
                    style={{
                      position: 'sticky',
                      bottom: '1.5rem',
                      background: 'rgba(14, 22, 43, 0.95)',
                      backdropFilter: 'blur(10px)',
                      padding: '1.25rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'block' }}>
                        Selected Show
                      </span>
                      <strong style={{ fontSize: '1rem', color: '#F8FAFC' }}>
                        {new Date(selectedShow.showTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}{' '}
                        • {selectedShow.theatre?.name}
                      </strong>
                    </div>

                    <Link
                      to={`/book/${selectedShow._id}`}
                      className="btn btn-primary"
                      style={{ padding: '0.75rem 1.5rem' }}
                    >
                      <Ticket size={18} />
                      Choose Seats & Book
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
