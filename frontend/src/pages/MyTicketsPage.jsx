import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmModal } from '../components/common/ConfirmModal';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  XCircle,
  ExternalLink
} from 'lucide-react';

export const MyTicketsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchMyBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getMyBookings();
      if (res.success) {
        setBookings(res.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load tickets:', err);
      setError(err.message || 'Unable to load your tickets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;

    try {
      setIsCancelling(true);
      const res = await api.cancelBooking(bookingToCancel._id, 'Cancelled by user');
      if (res.success) {
        success('Booking cancelled successfully and seats released.');
        setBookingToCancel(null);
        await fetchMyBookings();
      }
    } catch (err) {
      console.error('Cancellation failed:', err);
      toastError(err.message || 'Failed to cancel booking.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading your booked tickets..." />;
  }

  return (
    <div className="container" style={{ padding: '3rem 1.25rem', minHeight: '75vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', color: '#F8FAFC', marginBottom: '0.35rem' }}>
          My Booked Tickets
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
          View and manage your upcoming movie reservations and ticket history.
        </p>
      </div>

      {error ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <AlertCircle size={32} color="#EF4444" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: '#F8FAFC', marginBottom: '0.5rem' }}>Failed to Load Tickets</h3>
          <p style={{ color: '#94A3B8', marginBottom: '1.5rem' }}>{error}</p>
          <button onClick={fetchMyBookings} className="btn btn-secondary btn-sm">
            Try Again
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No Tickets Booked Yet"
          description="You haven't reserved any cinema seats yet. Browse now screening movies to book your first show!"
          actionText="Explore Movies"
          onAction={() => (window.location.href = '/')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {bookings.map((booking) => {
            const isCancelled = booking.status === 'CANCELLED';
            const showTime = booking.show?.showTime ? new Date(booking.show.showTime) : null;
            const isPast = showTime ? showTime < new Date() : false;

            const formattedDate = showTime
              ? showTime.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'TBA';

            const formattedTime = showTime
              ? showTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })
              : '';

            return (
              <div
                key={booking._id}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  alignItems: 'center',
                  opacity: isCancelled ? 0.7 : 1,
                  border: isCancelled
                    ? '1px solid rgba(239, 68, 68, 0.2)'
                    : '1px solid var(--color-surface-border)'
                }}
              >
                {/* Poster */}
                {booking.movie?.posterUrl && (
                  <img
                    src={booking.movie.posterUrl}
                    alt={booking.movie.title}
                    style={{
                      width: '90px',
                      height: '125px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      border: '1px solid var(--color-border)',
                      flexShrink: 0
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60';
                    }}
                  />
                )}

                {/* Main Details */}
                <div style={{ flex: '1 1 240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                    <span
                      className={`badge ${
                        isCancelled
                          ? 'badge-danger'
                          : isPast
                          ? 'badge-warning'
                          : 'badge-success'
                      }`}
                    >
                      {isCancelled ? 'CANCELLED' : isPast ? 'COMPLETED' : 'CONFIRMED'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontFamily: 'monospace' }}>
                      {booking.bookingReference}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', marginBottom: '0.35rem' }}>
                    {booking.movie?.title}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: '#94A3B8', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={14} color="#3B82F6" />
                      <span>{booking.theatre?.name} — Audi {booking.show?.screenNumber || 1}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} />
                        {formattedDate}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={13} />
                        {formattedTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Seats and Total */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    minWidth: '140px'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase' }}>
                    Seats ({booking.seatCount || booking.seats?.length})
                  </span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38BDF8' }}>
                    {booking.seats?.join(', ')}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                    Total: <strong style={{ color: '#F8FAFC' }}>₹{booking.totalAmount}</strong>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <Link
                    to={`/booking-success/${booking._id}`}
                    state={{ booking }}
                    className="btn btn-secondary btn-sm"
                  >
                    <ExternalLink size={14} />
                    View E-Ticket
                  </Link>

                  {!isCancelled && !isPast && (
                    <button
                      onClick={() => setBookingToCancel(booking)}
                      className="btn btn-danger btn-sm"
                      title="Cancel Booking & Release Seats"
                    >
                      <XCircle size={14} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Booking Cancellation */}
      <ConfirmModal
        isOpen={!!bookingToCancel}
        danger={true}
        title="Cancel Movie Ticket"
        message={`Are you sure you want to cancel your booking for ${bookingToCancel?.movie?.title} (${bookingToCancel?.seats?.join(
          ', '
        )})? This will immediately release the seats back to the theatre inventory.`}
        confirmText={isCancelling ? 'Cancelling...' : 'Yes, Cancel Ticket'}
        cancelText="Keep Booking"
        onConfirm={handleCancelConfirm}
        onCancel={() => setBookingToCancel(null)}
      />
    </div>
  );
};
