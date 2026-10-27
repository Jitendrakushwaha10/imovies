import React from 'react';
import { Ticket, Calendar, Clock, MapPin, ShieldCheck } from 'lucide-react';

export const BookingSummary = ({
  movie,
  theatre,
  showTime,
  screenNumber = 1,
  selectedSeats = [],
  ticketPrice = 250,
  onConfirmBooking,
  isSubmitting = false
}) => {
  const seatCount = selectedSeats.length;
  const subtotal = seatCount * ticketPrice;
  const convenienceFee = seatCount > 0 ? 30 : 0;
  const grandTotal = subtotal + convenienceFee;

  const formattedDate = showTime
    ? new Date(showTime).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    : '';

  const formattedTime = showTime
    ? new Date(showTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : '';

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        height: 'fit-content'
      }}
    >
      <h3
        style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          color: '#F8FAFC',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '0.85rem'
        }}
      >
        Booking Summary
      </h3>

      {/* Movie Details */}
      <div>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38BDF8', marginBottom: '0.35rem' }}>
          {movie?.title}
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem', color: '#94A3B8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <MapPin size={15} color="#3B82F6" />
            <span>{theatre?.name} — Audi {screenNumber}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} />
              {formattedDate}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} />
              {formattedTime}
            </span>
          </div>
        </div>
      </div>

      {/* Selected Seats Tag List */}
      <div>
        <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
          Selected Seats ({seatCount})
        </span>
        {seatCount === 0 ? (
          <p style={{ fontSize: '0.875rem', color: '#64748B', fontStyle: 'italic' }}>
            No seats selected yet. Click any available seat on the cinema map.
          </p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {selectedSeats.map((seat) => (
              <span
                key={seat}
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.5)',
                  color: '#93C5FD',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
              >
                {seat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div
        style={{
          borderTop: '1px dashed var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          padding: '1rem 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          fontSize: '0.9rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
          <span>Ticket Base ({seatCount} × ₹{ticketPrice})</span>
          <span style={{ color: '#F8FAFC' }}>₹{subtotal}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
          <span>Booking Convenience Fee</span>
          <span style={{ color: '#F8FAFC' }}>₹{convenienceFee}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.1rem',
            fontWeight: 800,
            color: '#F8FAFC',
            paddingTop: '0.5rem',
            marginTop: '0.25rem',
            borderTop: '1px solid rgba(148, 163, 184, 0.1)'
          }}
        >
          <span>Grand Total</span>
          <span style={{ color: '#38BDF8' }}>₹{grandTotal}</span>
        </div>
      </div>

      {/* Security note */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.775rem', color: '#64748B' }}>
        <ShieldCheck size={16} color="#22C55E" />
        <span>Atomic concurrency lock guarantees no double-booking</span>
      </div>

      {/* CTA Button */}
      <button
        onClick={onConfirmBooking}
        disabled={seatCount === 0 || isSubmitting}
        className="btn btn-primary"
        style={{
          width: '100%',
          padding: '0.85rem',
          fontSize: '1rem'
        }}
      >
        {isSubmitting ? (
          'Confirming Seats...'
        ) : (
          <>
            <Ticket size={18} />
            Confirm Booking (₹{grandTotal})
          </>
        )}
      </button>
    </div>
  );
};
