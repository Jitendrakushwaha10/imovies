import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';

test('Password hashing and verification with bcrypt', async () => {
  const plainPassword = 'Student@123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plainPassword, salt);

  assert.notEqual(hash, plainPassword, 'Password must not match hash directly');
  const isMatch = await bcrypt.compare(plainPassword, hash);
  assert.equal(isMatch, true, 'Valid password must match hash');

  const isInvalidMatch = await bcrypt.compare('WrongPassword', hash);
  assert.equal(isInvalidMatch, false, 'Invalid password must fail comparison');
});

test('Booking server-side price calculation logic', () => {
  const ticketPrice = 250;
  const convenienceFee = 30;
  const selectedSeats = ['A1', 'A2', 'A3'];

  const computedTotal = selectedSeats.length * ticketPrice + convenienceFee;
  assert.equal(computedTotal, 780, 'Total price for 3 seats must be exactly ₹780');
});

test('Atomic seat concurrency conflict detection simulation', () => {
  const showBookedSeats = ['A1', 'A2', 'B5'];
  const userAAttempt = ['C1', 'C2'];
  const userBAttempt = ['C1', 'D4']; // conflicting on C1

  // Function simulating MongoDB $nin condition check
  const canReserve = (booked, requested) => {
    return !requested.some((seat) => booked.includes(seat));
  };

  assert.equal(canReserve(showBookedSeats, userAAttempt), true, 'User A seats are free');

  // User A books C1, C2
  showBookedSeats.push(...userAAttempt);

  // User B attempts to book conflicting seat C1
  assert.equal(
    canReserve(showBookedSeats, userBAttempt),
    false,
    'User B must be rejected due to conflict on C1'
  );
});
