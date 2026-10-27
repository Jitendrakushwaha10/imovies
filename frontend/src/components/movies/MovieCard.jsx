import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';

export const MovieCard = ({ movie }) => {
  const [imgError, setImgError] = useState(false);

  // Format minutes into "Xh Ym"
  const formatDuration = (mins) => {
    if (!mins) return '2h 00m';
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  };

  // Safe poster fallback
  const fallbackPoster = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60';

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 16px 32px rgba(59, 130, 246, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
      }}
    >
      {/* Poster Container */}
      <Link
        to={`/movies/${movie._id}`}
        style={{
          position: 'relative',
          paddingTop: '145%', // 2:3 aspect ratio
          display: 'block',
          backgroundColor: '#0a0f1d',
          overflow: 'hidden'
        }}
      >
        <img
          src={imgError ? fallbackPoster : movie.posterUrl}
          alt={movie.title}
          onError={() => setImgError(true)}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />

        {/* Rating Badge */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            background: 'rgba(7, 11, 22, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '6px',
            padding: '0.25rem 0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            color: '#F59E0B',
            fontSize: '0.8rem',
            fontWeight: 700
          }}
        >
          <Star size={13} fill="#F59E0B" />
          <span>{movie.rating ? movie.rating.toFixed(1) : '8.0'}</span>
        </div>

        {/* Language Badge */}
        {movie.language && (
          <div
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              background: 'rgba(7, 11, 22, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '6px',
              padding: '0.2rem 0.45rem',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#F8FAFC'
            }}
          >
            {movie.language.split('/')[0].trim()}
          </div>
        )}
      </Link>

      {/* Details Container */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Genres */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.35rem',
              marginBottom: '0.65rem'
            }}
          >
            {movie.genres?.slice(0, 2).map((g, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#38BDF8',
                  background: 'rgba(56, 189, 248, 0.1)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px'
                }}
              >
                {g}
              </span>
            ))}
            <span
              style={{
                fontSize: '0.725rem',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginLeft: 'auto'
              }}
            >
              <Clock size={12} />
              {formatDuration(movie.durationMinutes)}
            </span>
          </div>

          {/* Title */}
          <Link to={`/movies/${movie._id}`}>
            <h3
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#F8FAFC',
                marginBottom: '0.5rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
              title={movie.title}
            >
              {movie.title}
            </h3>
          </Link>
        </div>

        {/* Action Button */}
        <Link
          to={`/movies/${movie._id}`}
          className="btn btn-primary"
          style={{
            width: '100%',
            marginTop: '1rem',
            padding: '0.55rem',
            fontSize: '0.875rem'
          }}
        >
          <Ticket size={15} />
          Book Tickets
        </Link>
      </div>
    </div>
  );
};
