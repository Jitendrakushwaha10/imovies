# IMovies — Premium Full-Stack Movie Ticket Booking System

> **“Your seat. Your story.”**  
> An individual college capstone project built on the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring real-time cinema seating layouts, atomic double-booking concurrency prevention, role-based access control, and complete booking management for Indore multiplexes.

---

## Highlights

- **Cinematic Dark Design System:** Deep midnight navy (`#070B16`), electric blue (`#3B82F6`), and cyan highlights (`#38BDF8`) with responsive glassmorphism.
- **Atomic Concurrency Protection:** Zero double-bookings using atomic MongoDB `$nin` queries directly at the database level.
- **Indore Multiplex Integration:** Real-world demonstration data for Indore's top theatres: PVR INOX C21 Mall, PVR Phoenix Citadel, and Cinepolis Treasure Island Mall.
- **Seat Tiers & Pricing:** Silver, Gold, and Platinum rows with dynamic subtotal, convenience fee calculation, and server-side validation.
- **Dual Role Authorization:** Secure customer accounts alongside an Administrator Console with real-time analytics and management tools.
- **College Evaluation Fast-Fill:** Pre-configured demo logins for rapid testing and examination.
- **Zero-Config Database Fallback:** Automatic embedded in-memory MongoDB fallback if local or Atlas MongoDB is not yet configured, allowing instant out-of-the-box evaluation.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, React Router DOM v6, Lucide React, Custom CSS Variables |
| **Backend** | Node.js (v20+), Express.js 4.x, RESTful API Architecture |
| **Database** | MongoDB with Mongoose ODM (supports MongoDB Atlas & embedded MongoMemoryServer) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), Salt Hashing (`bcryptjs`) |
| **Testing** | Node.js Built-in Test Runner (`node:test`, `node:assert`), Manual QA Matrix |

---

## 📁 Monorepo Folder Structure

```
imovies/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection & fallback manager
│   │   ├── controllers/     # Business logic (auth, movies, theatres, shows, bookings, admin)
│   │   ├── middleware/      # JWT protection & centralized error handling
│   │   ├── models/          # Mongoose schemas (User, Movie, Theatre, Show, Booking)
│   │   ├── routes/          # Express API route declarations
│   │   ├── seed/            # Seeding script with Indore multiplexes & real movies
│   │   ├── app.js           # Express app setup & CORS config
│   │   └── server.js        # Server listener with auto-seeding
│   ├── test/                # Automated unit tests
│   ├── .env.example         # Environment template
│   └── package.json
├── frontend/
│   ├── public/              # Static public assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── booking/     # SeatGrid (curved screen) & BookingSummary
│   │   │   ├── common/      # Spinners, modals, empty/error states, route guards
│   │   │   ├── layout/      # Responsive Navbar & Footer
│   │   │   └── movies/      # MovieCard, MovieGrid, MovieSearch, GenreFilters
│   │   ├── context/         # AuthContext & ToastContext
│   │   ├── pages/           # Home, Details, SeatBooking, Success, Tickets, Admin, Auth
│   │   ├── services/        # Centralized REST API client
│   │   ├── styles/          # Dark cinematic CSS tokens & utilities
│   │   ├── App.jsx          # Route hierarchy
│   │   └── main.jsx         # React application entry
│   ├── vite.config.js       # Vite bundler configuration & backend proxy
│   └── package.json
├── docs/
│   ├── PROJECT_REPORT.md    # 24-section comprehensive B.Tech Capstone Report
│   ├── TESTING.md           # QA test execution matrix with test IDs & pass/fail status
│   └── API_DOCUMENTATION.md # Complete REST API specification
├── .env.example
├── .gitignore
├── package.json             # Root workspace runner scripts
└── README.md
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Node.js** v20.x or higher
- **npm** v10.x or higher
- *(Optional)* Local MongoDB or MongoDB Atlas URI (if omitted, the system seamlessly boots an in-memory MongoDB instance automatically).

### 2. Install Dependencies
Run the installation command from the project root:
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` in both root and `backend/`:
```bash
cp .env.example backend/.env
```
Default configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=
JWT_SECRET=imovies_super_secret_jwt_key_capstone_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@imovies.com
ADMIN_PASSWORD=Admin@123
```

---

## 🚀 Running the Application
DIRECT LINK 🔗
https://imoviess-4c4l3yk3i-jitu-bd5c.vercel.app/

### Option A: Run Backend and Frontend Concurrently
From the root directory:
```bash
npm run dev
```

### Option B: Run in Separate Terminals

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
```
*Backend runs on `http://localhost:5000` with health check at `http://localhost:5000/api/health`.*

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🔑 Demo Accounts for Evaluation

For rapid demonstration during grading or viva, the login page features **1-Click Fast-Fill buttons**:

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Demo Student** | `student@imovies.com` | `Student@123` | Browsing, seat booking, ticket printing, booking cancellation |
| **Administrator** | `admin@imovies.com` | `Admin@123` | Full Admin Console, movie/theatre/show management, live metrics |

---

## 🎬 College Demonstration Checklist

Follow this workflow to verify all features:
1. **Homepage:**
   - Open `http://localhost:5173`.
   - Observe dark cinematic theme with hero headline: *"Pick a film. Pick your seat."*
   - Type in the search field to filter movies by title or genre.
   - Click genre chips (*Sci-Fi, Action, Drama*) to verify responsive filtering.
2. **Movie Details:**
   - Click **Book Tickets** on *Dune: Part Two*.
   - View synopsis, rating, director, and Indore multiplexes (*PVR INOX C21 Mall, Phoenix Citadel*).
   - Select a showtime (e.g., 06:15 PM) and click **Choose Seats & Book**.
3. **Interactive Seat Selection:**
   - Observe the curved cinema screen indicator.
   - Click available seats (e.g., `E4`, `E5`).
   - Notice live subtotal recalculation and selected seat pills.
4. **Confirm Booking:**
   - Click **Confirm Booking**. If logged out, sign in using the 1-click student demo button.
   - Observe the printable digital e-ticket receipt with unique reference (`IMV-YYYYMMDD-XXXX`).
5. **My Tickets & Cancellation:**
   - Click **My Tickets** in the top navigation.
   - View your confirmed reservation.
   - Click **Cancel** on a ticket and confirm the modal.
   - Watch the status update to `CANCELLED` and note that the seats are freed.
6. **Admin Dashboard:**
   - Sign in as `admin@imovies.com`.
   - Click the **Admin** link in the navigation.
   - View metrics (Total Movies, Theatres, Shows, Bookings, Revenue).
   - Switch tabs to manage Movies, Theatres, Shows, and inspect customer bookings.

---

## 🧪 Automated Testing

Execute the automated backend test suite:
```bash
cd backend
npm test
```
**Tests verified:**
- Password hashing & verification with bcrypt
- Server-side price calculation logic
- Atomic seat concurrency conflict detection simulation

---

## 🔒 Concurrency & Double-Booking Prevention

IMovies enforces database-level serialization:
```javascript
const updatedShow = await Show.findOneAndUpdate(
  {
    _id: showId,
    bookedSeats: { $nin: uniqueSeats } // Guarantees NONE of the requested seats are booked
  },
  {
    $push: { bookedSeats: { $each: uniqueSeats } }
  },
  { new: true }
);

if (!updatedShow) {
  return res.status(409).json({
    success: false,
    message: 'Booking conflict: One or more selected seats have just been booked by another user.'
  });
}
```
This atomic MongoDB update eliminates race conditions without requiring external distributed lock managers.

---

## 📦 Deployment Guide

### Deploy Backend to Render / Railway
1. Push repository to GitHub.
2. Link repository to Render / Railway web service.
3. Set root directory to `backend`.
4. Set build command: `npm install`.
5. Set start command: `npm start`.
6. Add environment variables: `PORT=5000`, `NODE_ENV=production`, `MONGODB_URI=<Your MongoDB Atlas URI>`, `JWT_SECRET=<secret>`, `CLIENT_URL=<Your Vercel Frontend URL>`.

### Deploy Frontend to Vercel
1. Link repository to Vercel.
2. Set root directory to `frontend`.
3. Framework Preset: **Vite**.
4. Set build command: `npm run build`.
5. Set output directory: `dist`.
6. Add `vercel.json` rewrite rule for React Router client-side routing.

---

## 💻 Git Submission Commands

To initialize and push this repository to your GitHub account:
```bash
cd /Users/pankajkushwaa/.gemini/antigravity/scratch/imovies

# Initialize Git repository
git init

# Stage all files
git add .

# Create initial commit
git commit -m "feat: complete IMovies full-stack cinema ticketing system capstone"

# Connect to your GitHub repository (replace with your repo URL)
# git remote add origin https://github.com/<your-username>/imovies.git
# git branch -M main
# git push -u origin main
```

---

## 📄 License
Developed for educational evaluation and B.Tech CSE capstone submission.
