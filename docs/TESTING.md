# IMovies QA Testing & Verification Report

This document records the test cases and execution outcomes for the IMovies Cinema Ticket Reservation platform.

---

## Test Execution Matrix

| Test ID | Feature | Preconditions | Test Steps | Expected Result | Actual Result | Status | Notes |
|---|---|---|---|---|---|---|---|
| **TC-HP-01** | Homepage Movie Discovery | Backend running, seeded data | Open `http://localhost:5173/` | Hero section renders with headline "Pick a film. Pick your seat." and movie cards load with posters, genres, and ratings. | Rendered smoothly; 8 movies loaded with posters and ratings. | **PASS** | Responsive grid tested. |
| **TC-HP-02** | Real-Time Search | Movies displayed on homepage | Type "Interstellar" into search field | Filter instantly reduces list to Interstellar with matching genres. | Search filtered case-insensitively. | **PASS** | Debounced 250ms search. |
| **TC-HP-03** | Genre Filter | Homepage loaded | Click "Sci-Fi" genre chip | Only films tagged with Sci-Fi (Dune, Interstellar, Inception) remain visible. | Filter correctly matched genres. | **PASS** | Active pill highlighted in blue. |
| **TC-HP-04** | Empty Search State | Search active | Type "NonexistentXYZMovie" | Friendly EmptyState component renders with icon and "Reset Filters" button. | EmptyState appeared with reset button. | **PASS** | No broken UI or crashes. |
| **TC-MD-01** | Movie Details & Shows | User selects a movie card | Click "Book Tickets" on Dune: Part Two | Dedicated page `/movies/:id` renders with synopsis, cast, director, Indore multiplexes, and showtimes. | Loaded details, backdrop, and multiplexes. | **PASS** | Handled correctly. |
| **TC-MD-02** | Showtime Selection | Movie page open | Click showtime "06:15 PM" at PVR INOX C21 Mall | Selected show bar appears with button "Choose Seats & Book". | Selected state updated and persisted to URL. | **PASS** | Links to `/book/:showId`. |
| **TC-AUTH-01** | User Registration | Unauthenticated | Go to `/register`, enter Name, Email, Password, Confirm Password | Account created, JWT generated, user automatically logged in. | New user created in MongoDB and redirected. | **PASS** | Passwords hashed with bcrypt. |
| **TC-AUTH-02** | Password Mismatch | Register page open | Enter mismatched password confirmation | Form warns "Passwords do not match", submission blocked. | Blocked with clear error message. | **PASS** | Client and server validation. |
| **TC-AUTH-03** | User Sign In | Registered user credentials | Go to `/login`, enter `student@imovies.com` / `Student@123` | Authentication succeeds, token stored in localStorage, avatar appears in Navbar. | Signed in and redirected seamlessly. | **PASS** | Demo Fast Fill button tested. |
| **TC-AUTH-04** | Invalid Credentials | Login page open | Enter incorrect password | Server responds 401 Unauthorized; red alert shown. | Displayed "Invalid email or password". | **PASS** | Generic error avoids leaks. |
| **TC-ST-01** | Interactive Seat Grid | Showtime opened (`/book/:showId`) | Click available seats C3, C4 | Seats highlight in electric blue with checkmark; summary updates total price. | Seat colors update and subtotal recalculates. | **PASS** | Silver/Gold/Platinum tiers. |
| **TC-ST-02** | Booked Seat Lockout | Seat is booked by another user | Attempt to click booked seat D4 | Click is disabled; hover shows 'not-allowed' cursor. | Click disabled; seat cannot be toggled. | **PASS** | Prevented on frontend. |
| **TC-ST-03** | Double-Booking Concurrency Safety | Two users attempt same seat simultaneously | Request sent with already booked seat | Backend atomic `$nin` query detects conflict, returns HTTP 409 Conflict. | 409 Conflict returned; seat map auto-refreshed. | **PASS** | Verified via atomic logic test. |
| **TC-BK-01** | Complete Booking Workflow | Authenticated user selects seats | Click "Confirm Booking" | Server calculates price, creates booking record, redirects to confirmation. | Booking created, ticket receipt rendered. | **PASS** | Unique IMV reference generated. |
| **TC-BK-02** | Booking Persistence on Refresh | On confirmation page | Refresh browser | Booking details load from database; state preserved. | Preserved without data loss. | **PASS** | Stored in MongoDB. |
| **TC-MT-01** | My Tickets Display | Authenticated user | Navigate to `/my-tickets` | Displays all customer bookings with movie posters, multiplex, show date/time, and status. | Customer's tickets displayed accurately. | **PASS** | Filtered by user ID. |
| **TC-MT-02** | Ticket Cancellation | User views active ticket in My Tickets | Click "Cancel" -> confirm modal | Booking status changes to CANCELLED; seats released atomically on Show. | Booking cancelled and seats made available again. | **PASS** | Safe `$pullAll` executed. |
| **TC-ADM-01** | Admin Access Control | Non-admin user | Attempt to navigate to `/admin` | Access denied; user redirected to home page. | Redirected safely. | **PASS** | Protected by AdminRoute & backend adminOnly. |
| **TC-ADM-02** | Admin Dashboard Metrics | Signed in as `admin@imovies.com` | Navigate to `/admin` | Displays total movies, theatres, shows, bookings, revenue, and management tabs. | Metrics and charts loaded accurately. | **PASS** | Real aggregation query. |
| **TC-ADM-03** | Schedule New Showtime | In Admin Console | Click "Schedule Show", select movie, theatre, date, and price | New showtime created and immediately visible on movie details page. | Show created and verified in DB. | **PASS** | Validated movie/theatre refs. |
