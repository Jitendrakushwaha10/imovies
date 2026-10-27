import React from 'react';
import { Check } from 'lucide-react';

export const SeatGrid = ({
  rows = 8,
  cols = 10,
  rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  bookedSeats = [],
  selectedSeats = [],
  onToggleSeat,
  seatTierPrices = {}
}) => {
  // Determine tier based on row letter
  const getTierInfo = (rowLetter) => {
    if (['A', 'B'].includes(rowLetter)) {
      return { name: 'Silver', price: seatTierPrices.silver };
    }
    if (['C', 'D', 'E', 'F'].includes(rowLetter)) {
      return { name: 'Gold', price: seatTierPrices.gold };
    }
    return { name: 'Platinum', price: seatTierPrices.platinum };
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        padding: '1.5rem 0'
      }}
    >
      {/* Curved Cinema Screen */}
      <div
        style={{
          width: '80%',
          maxWidth: '560px',
          height: '14px',
          background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.6) 0%, rgba(56, 189, 248, 0) 100%)',
          borderRadius: '50% 50% 0 0 / 14px 14px 0 0',
          boxShadow: '0 -4px 20px rgba(56, 189, 248, 0.4)',
          marginBottom: '0.5rem'
        }}
      />
      <span
        style={{
          fontSize: '0.75rem',
          color: '#64748B',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: '2.5rem',
          fontWeight: 600
        }}
      >
        All eyes this way — Cinema Screen
      </span>

      {/* Seat Layout Wrapper */}
      <div
        style={{
          overflowX: 'auto',
          maxWidth: '100%',
          paddingBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {rowLabels.slice(0, rows).map((rowLetter) => {
            const tier = getTierInfo(rowLetter);

            return (
              <div
                key={rowLetter}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {/* Row Label Left */}
                <span
                  style={{
                    width: '24px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#94A3B8',
                    textAlign: 'center'
                  }}
                >
                  {rowLetter}
                </span>

                {/* Seat Columns */}
                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  {Array.from({ length: cols }, (_, i) => i + 1).map((colNum) => {
                    const seatId = `${rowLetter}${colNum}`;
                    const isBooked = bookedSeats.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);

                    // Add an aisle gap in the middle
                    const isAisleGap = colNum === Math.floor(cols / 2);

                    return (
                      <React.Fragment key={seatId}>
                        <button
                          type="button"
                          disabled={isBooked}
                          onClick={() => onToggleSeat(seatId)}
                          aria-label={`Seat ${seatId} ${
                            isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'
                          }`}
                          title={`Seat ${seatId} - ${tier.name} ${
                            isBooked ? '(Booked)' : isSelected ? '(Selected)' : '(Available)'
                          }`}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px 6px 3px 3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.725rem',
                            fontWeight: 600,
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                            background: isBooked
                              ? '#1E293B'
                              : isSelected
                              ? '#3B82F6'
                              : 'rgba(14, 22, 43, 0.9)',
                            color: isBooked
                              ? '#475569'
                              : isSelected
                              ? '#FFFFFF'
                              : '#E2E8F0',
                            border: isBooked
                              ? '1px solid rgba(71, 85, 105, 0.3)'
                              : isSelected
                              ? '1px solid #60A5FA'
                              : '1px solid rgba(148, 163, 184, 0.25)',
                            boxShadow: isSelected
                              ? '0 0 12px rgba(59, 130, 246, 0.7)'
                              : 'none',
                            transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {isSelected ? (
                            <Check size={14} strokeWidth={3} />
                          ) : (
                            colNum
                          )}
                        </button>

                        {/* Aisle Spacer */}
                        {isAisleGap && <div style={{ width: '14px' }} />}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Row Label Right */}
                <span
                  style={{
                    width: '24px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#94A3B8',
                    textAlign: 'center'
                  }}
                >
                  {rowLetter}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          justifyContent: 'center',
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          borderRadius: '12px',
          background: 'rgba(14, 22, 43, 0.6)',
          border: '1px solid rgba(148, 163, 184, 0.12)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#94A3B8' }}>
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '4px',
              background: 'rgba(14, 22, 43, 0.9)',
              border: '1px solid rgba(148, 163, 184, 0.3)'
            }}
          />
          <span>Available</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#94A3B8' }}>
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '4px',
              background: '#3B82F6',
              boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)'
            }}
          />
          <span style={{ color: '#F8FAFC', fontWeight: 600 }}>Selected</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#94A3B8' }}>
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '4px',
              background: '#1E293B',
              border: '1px solid rgba(71, 85, 105, 0.3)'
            }}
          />
          <span>Booked / Reserved</span>
        </div>
      </div>
    </div>
  );
};
