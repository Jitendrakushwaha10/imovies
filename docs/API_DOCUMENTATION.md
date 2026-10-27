# IMovies REST API Documentation

Base URL: `http://localhost:5001/api`

---

## 1. System Health

### `GET /health`
Returns runtime server and database health status.
- **Access**: Public
- **Response**:
```json
{
  "status": "ok",
  "service": "IMovies REST API",
  "uptimeSeconds": 142,
  "timestamp": "2026-10-27T18:30:00.000Z",
  "environment": "development"
}
```

---

## 2. Authentication

### `POST /auth/register`
Creates a new customer user account.
- **Access**: Public
- **Body**:
```json
{
  "name": "Pankaj Kushwah",
  "email": "student@imovies.com",
  "password": "Student@123",
  "confirmPassword": "Student@123"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Account created successfully.",
  "token": "eyJhbGciOi...",
  "user": {
    "id": "671e...",
    "name": "Pankaj Kushwah",
    "email": "student@imovies.com",
    "role": "user"
  }
}
```

### `POST /auth/login`
Authenticates a user and returns a JWT token.
- **Access**: Public
- **Body**:
```json
{
  "email": "student@imovies.com",
  "password": "Student@123"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Logged in successfully.",
  "token": "eyJhbGciOi...",
  "user": {
    "id": "671e...",
    "name": "Pankaj Kushwah",
    "email": "student@imovies.com",
    "role": "user"
  }
}
```

### `GET /auth/me`
Retrieves profile of the authenticated session.
- **Access**: Authenticated (`Authorization: Bearer <token>`)
- **Response `200 OK`**:
```json
{
  "success": true,
  "user": {
    "_id": "671e...",
    "name": "Pankaj Kushwah",
    "email": "student@imovies.com",
    "role": "user"
  }
}
```

---

## 3. Movies

### `GET /movies`
Retrieves movies with optional filtering, search, and sorting.
- **Access**: Public
- **Query Parameters**:
  - `search`: case-insensitive string filter
  - `genre`: genre filter (e.g. `Action`, `Sci-Fi`)
  - `sort`: `top-rated` | `newest` | `alphabetical`
  - `featured`: `true` | `false`
- **Response `200 OK`**:
```json
{
  "success": true,
  "count": 8,
  "movies": [ ... ]
}
```

### `GET /movies/:id`
Retrieves details of a single movie along with its active upcoming showtimes and theatres.
- **Access**: Public

### `POST /movies`
Adds a new movie to the cinema catalog.
- **Access**: Admin only

### `PATCH /movies/:id`
Updates movie details.
- **Access**: Admin only

### `DELETE /movies/:id`
Safely removes a movie (rejects if active shows exist).
- **Access**: Admin only

---

## 4. Theatres (Indore Multiplexes)

### `GET /theatres`
Returns list of multiplexes in Indore.
- **Access**: Public

### `POST /theatres`
Adds a new cinema hall/multiplex.
- **Access**: Admin only

---

## 5. Showtimes & Seats

### `GET /shows`
Lists scheduled shows filtered by `movieId`, `theatreId`, or `date`.
- **Access**: Public

### `GET /shows/:id/seats`
Retrieves real-time cinema seating availability, layout matrix, and booked seats.
- **Access**: Public
- **Response `200 OK`**:
```json
{
  "success": true,
  "showId": "671e...",
  "movie": { "title": "Dune: Part Two" },
  "theatre": { "name": "PVR INOX: C21 Mall", "city": "Indore" },
  "showTime": "2026-10-28T14:30:00.000Z",
  "ticketPrice": 250,
  "bookedSeats": ["C4", "C5", "D4"],
  "totalSeats": 80,
  "layout": {
    "rows": 8,
    "cols": 10,
    "rowLabels": ["A", "B", "C", "D", "E", "F", "G", "H"]
  }
}
```

### `POST /shows`
Creates a new screening schedule for a movie and theatre.
- **Access**: Admin only

---

## 6. Bookings (Atomic & Concurrency-Safe)

### `POST /bookings`
Books cinema seats for the authenticated user.
- **Access**: Authenticated (`Authorization: Bearer <token>`)
- **Body**:
```json
{
  "showId": "671e...",
  "seats": ["E4", "E5"]
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Booking confirmed successfully!",
  "booking": {
    "bookingReference": "IMV-20261028-A4K9",
    "seats": ["E4", "E5"],
    "seatCount": 2,
    "ticketPricePerSeat": 250,
    "convenienceFee": 30,
    "totalAmount": 530,
    "status": "CONFIRMED"
  }
}
```
- **Response `409 Conflict` (Seat collision)**:
```json
{
  "success": false,
  "message": "Booking conflict: One or more selected seats have just been booked by another user. Please select other seats."
}
```

### `GET /bookings/my`
Retrieves all tickets booked by the currently signed-in user.
- **Access**: Authenticated

### `PATCH /bookings/:id/cancel`
Cancels an upcoming booking and automatically releases seats back to the theatre inventory.
- **Access**: Authenticated (Owner or Admin)

---

## 7. Administrative APIs

### `GET /admin/stats`
Retrieves dashboard summary statistics: total movies, theatres, shows, bookings, revenue, and recent transactions.
- **Access**: Admin only

### `GET /admin/bookings`
Lists all user bookings across the platform with filtering by status (`CONFIRMED`, `CANCELLED`).
- **Access**: Admin only
