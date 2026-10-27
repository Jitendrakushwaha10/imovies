import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import {
  CheckCircle,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Printer,
  ChevronRight,
  ShieldCheck,
  QrCode
} from 'lucide-react';

export const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!booking) {
      const fetchBooking = async () => {
        try {
          setLoading(true);
          const res = await api.getBookingById(bookingId);
          if (res.success && res.booking) {
            setBooking(res.booking);
          }
        } catch (err) {
          console.error('Failed to load booking:', err);
          setError(err.message || 'Could not find booking record.');
        } finally {
          setLoading(false);
        }
      };

      fetchBooking();
    }
  }, [bookingId, booking]);

  if (loading) {
    return <LoadingSpinner fullScreen message="Retrieving your confirmed ticket..." />;
  }

  if (error || !booking) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <ErrorState
          title="Booking Not Found"
          message={error || 'We could not find the requested booking reference.'}
          onRetry={() => navigate('/my-tickets')}
        />
      </div>
    );
  }

  const showDate = booking.show?.showTime
    ? new Date(booking.show.showTime).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  const showTime = booking.show?.showTime
    ? new Date(booking.show.showTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : '';

  return (
    <div className="container" style={{ padding: '3rem 1.25rem', maxWidth: '680px' }}>
      {/* Header Confirmation Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.15)',
            color: '#22C55E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
          }}
        >
          <CheckCircle size={36} />
        </div>
        <h1 style={{ fontSize: '1.75rem', color: '#F8FAFC', marginBottom: '0.4rem' }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
          Your cinema seats have been successfully reserved and saved.
        </p>
      </div>

      {/* Digital Ticket Card (Printable) */}
      <div
        className="glass-card ticket-card"
        style={{
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          marginBottom: '2rem'
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            background: 'linear-gradient(90deg, #14213D 0%, #0E162B 100%)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Booking Reference
            </span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38BDF8', letterSpacing: '0.05em' }}>
              {booking.bookingReference}
            </div>
          </div>
          <span className="badge badge-success">
            {booking.status || 'CONFIRMED'}
          </span>
        </div>

        {/* Ticket Body */}
        <div style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'center' }}>
            {booking.movie?.posterUrl && (
              <img
                src={booking.movie.posterUrl}
                alt={booking.movie.title}
                style={{
                  width: '80px',
                  height: '110px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)'
                }}
              />
            )}
            <div>
              <h2 style={{ fontSize: '1.35rem', color: '#F8FAFC', marginBottom: '0.35rem' }}>
                {booking.movie?.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94A3B8', fontSize: '0.875rem' }}>
                <MapPin size={15} color="#3B82F6" />
                <span>{booking.theatre?.name} — Audi {booking.show?.screenNumber || 1}</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.25rem',
              padding: '1.25rem',
              background: 'rgba(7, 11, 22, 0.6)',
              borderRadius: '12px',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              marginBottom: '1.5rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase' }}>
                Date & Showtime
              </span>
              <div style={{ fontSize: '0.925rem', color: '#F8FAFC', fontWeight: 600, marginTop: '0.2rem' }}>
                {showDate}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#38BDF8' }}>{showTime}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase' }}>
                Reserved Seats ({booking.seatCount || booking.seats?.length})
              </span>
              <div style={{ fontSize: '1.1rem', color: '#F8FAFC', fontWeight: 800, marginTop: '0.2rem' }}>
                {booking.seats?.join(', ')}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase' }}>
                Ticket Rate
              </span>
              <div style={{ fontSize: '0.925rem', color: '#F8FAFC', marginTop: '0.2rem' }}>
                ₹{booking.ticketPricePerSeat} / seat
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase' }}>
                Total Paid
              </span>
              <div style={{ fontSize: '1.15rem', color: '#22C55E', fontWeight: 800, marginTop: '0.2rem' }}>
                ₹{booking.totalAmount}
              </div>
            </div>
          </div>

          {/* Verification Bar & Simulated QR */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.5rem',
              borderTop: '1px dashed var(--color-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8', fontSize: '0.8rem' }}>
              <ShieldCheck size={18} color="#22C55E" />
              <span>Verified E-Ticket • Show this barcode at cinema entry gate</span>
            </div>
            <div
              style={{
                background: '#FFFFFF',
                padding: '0.4rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Cinema Barcode"
            >
              <QrCode size={36} color="#070B16" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => window.print()}
          className="btn btn-secondary"
          style={{ flex: '1 1 180px' }}
        >
          <Printer size={16} />
          Print / Save Ticket
        </button>

        <Link
          to="/my-tickets"
          className="btn btn-primary"
          style={{ flex: '1 1 180px' }}
        >
          <Ticket size={16} />
          View in My Tickets
          <ChevronRight size={16} />
        </Link>
      </div>

      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          header, footer, button, a {
            display: none !important;
          }
          .ticket-card {
            border: 2px solid #000000 !important;
            box-shadow: none !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
        }
      `}</style>
    </div>
  );
};
