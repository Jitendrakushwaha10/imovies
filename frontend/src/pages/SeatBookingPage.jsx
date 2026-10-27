import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SeatGrid } from '../components/booking/SeatGrid';
import { BookingSummary } from '../components/booking/BookingSummary';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { ChevronLeft, Info, AlertTriangle } from 'lucide-react';

export const SeatBookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { success, error: toastError, warning } = useToast();

  const [showData, setShowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState(null);

  const fetchSeats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setConflictError(null);
      const res = await api.getShowSeats(showId);
      if (res.success) {
        setShowData(res);
      }
    } catch (err) {
      console.error('Failed to load show seats:', err);
      setError(err.message || 'Unable to fetch real-time seat availability.');
    } finally {
      setLoading(false);
    }
  }, [showId]);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  const handleToggleSeat = (seatId) => {
    setConflictError(null);
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((s) => s !== seatId);
      }
      // Maximum 8 seats per single booking for fairness
      if (prev.length >= 8) {
        warning('You can select a maximum of 8 seats per booking.');
        return prev;
      }
      return [...prev, seatId];
    });
  };

  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) {
      toastError('Please select at least one seat to proceed.');
      return;
    }

    // Require authentication
    if (!isAuthenticated) {
      warning('Please sign in to complete your movie booking.');
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      setIsSubmitting(true);
      setConflictError(null);

      const res = await api.createBooking({
        showId,
        seats: selectedSeats
      });

      if (res.success && res.booking) {
        success('Seats booked successfully! Here is your ticket receipt.');
        navigate(`/booking-success/${res.booking._id}`, { state: { booking: res.booking } });
      }
    } catch (err) {
      console.error('Booking failed:', err);
      if (err.status === 409) {
        // Seat conflict (double-booking race condition)
        setConflictError(
          err.message || 'One or more of your selected seats were just taken. The seat map has been updated.'
        );
        toastError('Seat Conflict: Please choose different seats.');
        // Re-fetch current seats
        await fetchSeats();
        setSelectedSeats([]);
      } else {
        toastError(err.message || 'Booking could not be confirmed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading cinema seat layout & live availability..." />;
  }

  if (error || !showData) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <ErrorState
          title="Showtime Unavailable"
          message={error || 'Could not load seating data for this showtime.'}
          onRetry={fetchSeats}
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      {/* Back button */}
      <Link
        to={showData.movie?._id ? `/movies/${showData.movie._id}` : '/'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#94A3B8',
          fontSize: '0.875rem',
          marginBottom: '1.5rem',
          background: 'var(--color-surface)',
          padding: '0.4rem 0.85rem',
          borderRadius: '6px',
          border: '1px solid var(--color-border)'
        }}
      >
        <ChevronLeft size={16} />
        Back to Movie Shows
      </Link>

      {/* Seat Conflict Alert (if any) */}
      {conflictError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#F8FAFC',
            marginBottom: '1.5rem'
          }}
        >
          <AlertTriangle size={20} color="#EF4444" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.9rem' }}>
            <strong style={{ color: '#EF4444' }}>Reservation Conflict: </strong>
            {conflictError}
          </div>
        </div>
      )}

      {/* Main Grid: Layout on Left, Summary on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 360px',
          gap: '2.5rem',
          alignItems: 'flex-start'
        }}
        className="booking-grid"
      >
        {/* Left: Interactive Seat Grid Card */}
        <div
          className="glass-card"
          style={{
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{ width: '100%', marginBottom: '1rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#F8FAFC', marginBottom: '0.25rem' }}>
              Select Your Preferred Seats
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>
              Click on available seats to add them to your reservation.
            </p>
          </div>

          <SeatGrid
            rows={showData.layout?.rows || 8}
            cols={showData.layout?.cols || 10}
            rowLabels={showData.layout?.rowLabels || ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']}
            bookedSeats={showData.bookedSeats || []}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
            seatTierPrices={showData.seatTierPrices || {}}
          />
        </div>

        {/* Right: Booking Summary Card */}
        <BookingSummary
          movie={showData.movie}
          theatre={showData.theatre}
          showTime={showData.showTime}
          screenNumber={showData.theatre?.screens ? 1 : 1}
          selectedSeats={selectedSeats}
          ticketPrice={showData.ticketPrice}
          onConfirmBooking={handleConfirmBooking}
          isSubmitting={isSubmitting}
        />
      </div>

      <style>{`
        @media (max-width: 900px) {
          .booking-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
