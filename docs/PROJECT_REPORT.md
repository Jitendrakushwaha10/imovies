# B.TECH COMPUTER SCIENCE & ENGINEERING CAPSTONE PROJECT REPORT

# IMovies — Premium Full-Stack Movie Ticket Booking System

**Academic Year:** 2025–2026  
**Candidate Name:** Pankaj Kushwah  
**Department:** Computer Science & Engineering  
**Degree:** Bachelor of Technology (B.Tech)  
**Supervisor / Guide:** Department of Computer Science & Engineering  
**Institution:** Faculty of Engineering & Technology, Indore, Madhya Pradesh  

---

## 1. Title Page Details Placeholder
- **Project Title:** IMovies: A Concurrency-Safe MERN Stack Cinema Ticket Booking & Theatre Allocation Platform
- **Degree:** Bachelor of Technology in Computer Science & Engineering
- **Student Name:** Pankaj Kushwah
- **Primary Demonstration City:** Indore, Madhya Pradesh (PVR INOX C21 Mall, Phoenix Citadel, Cinepolis TI Mall)
- **Submission Date:** October 2026

---

## 2. Abstract
The modern entertainment sector relies heavily on real-time reservation platforms capable of managing dynamic seat states, concurrent transaction requests, and seamless user experiences. This capstone project introduces **IMovies**, an enterprise-grade full-stack cinema ticketing system built upon the MERN (MongoDB, Express.js, React.js, Node.js) technology stack. 

IMovies eliminates double-booking hazards using atomic `$nin` document queries on MongoDB, ensuring strictly serialized seat reservations without costly distributed locks. The application features a dark-themed cinematic user interface, interactive 80-seat cinema halls divided across Silver, Gold, and Platinum tiers, role-based authorization (User and Administrator), live showtime scheduling for Indore multiplexes, and automated ticket generation with simulated digital barcodes. Comprehensive verification and QA test plans substantiate the platform's reliability under concurrent access.

---

## 3. Introduction
Movie ticketing has evolved from physical box-office queues to digital self-service reservation systems. Consumers anticipate frictionless seat discovery, transparent pricing, instantaneous confirmation, and responsive interfaces on both mobile and desktop screens. 

IMovies was designed and engineered as a comprehensive individual college capstone demonstration demonstrating proficiency across frontend architecture, RESTful API engineering, document database modeling, token-based authentication, and concurrency control.

---

## 4. Problem Statement
Traditional and novice movie ticketing implementations suffer from notable deficiencies:
1. **Race Conditions and Double Booking:** Simultaneous requests for the identical seat often result in two users paying for the same ticket due to uncoordinated read-modify-write cycles.
2. **Frontend-Only Price Calculations:** Compromised clients can alter HTTP payloads, submitting unauthorized reduced ticket prices.
3. **Inadequate Access Controls:** Administrative interfaces often rely solely on client-side routing guards without strict server-level middleware enforcement.
4. **Poor Mobile Responsiveness & Layout Glitches:** Seat selection grids frequently break or cause horizontal overflow on mobile viewports.

---

## 5. Project Objectives
- Develop an engaging, responsive dark-themed web portal using React.js and Vite.
- Implement a robust RESTful API with Express.js and Node.js.
- Model realistic entities in MongoDB (Users, Movies, Theatres, Shows, Bookings).
- Guarantee zero double-booking through atomic database reservations.
- Enforce strict server-side price computation and parameter validation.
- Implement JWT authentication with bcrypt password hashing and role-based permissions.
- Provide a feature-rich Administrator Console for managing films, multiplexes, and showtimes.
- Guarantee local demonstration capability through embedded MongoDB engine fallback.

---

## 6. Existing-System Limitations
- **Box-Office Counter Queues:** Time-consuming, geographically restricted, and prone to human ticketing errors.
- **Legacy Monolithic Ticketing Systems:** High server latency, non-responsive desktop-only layouts, and lack of real-time seat availability visualization.
- **Naive Web Solutions:** Prone to concurrency race conditions when two or more transactions select the same seat simultaneously.

---

## 7. Proposed System
IMovies addresses these limitations through:
- **Client-Side SPA Architecture:** React.js single-page application with instant state transitions and interactive SVG/CSS seat grids.
- **Server-Side Validation:** All prices, fees, and seat integrity checks occur strictly in Node.js controllers.
- **Atomic Concurrency Protection:** MongoDB `findOneAndUpdate` with `$nin` conditions guarantees serialization of seat claims.
- **Auditable Lifecycle Management:** Tickets can be viewed, printed, or safely cancelled with atomic seat restocking.

---

## 8. Scope
- **Geographic Demonstration:** Focused on Indore, Madhya Pradesh, featuring multiplexes such as PVR INOX C21 Mall, PVR Phoenix Citadel, and Cinepolis Treasure Island Mall.
- **Target Audience:** Movie enthusiasts seeking rapid seat booking, and cinema administrators managing show allocations.
- **Out of Scope (Simulated):** Physical gateway payment integration is replaced with server-side transaction confirmation for academic demo safety.

---

## 9. Functional Requirements
1. **User Authentication:** Registration, login, session persistence, and secure logout.
2. **Movie Discovery:** Catalog browsing, title/genre search, genre chip filtering, and sorting (Top Rated, Newest, Alphabetical).
3. **Showtime Selection:** Viewing movie details, synopsis, cast, director, and choosing dates and times across Indore multiplexes.
4. **Interactive Seat Selection:** Real-time visual display of Available, Selected, and Booked seats with tier pricing (Silver, Gold, Platinum).
5. **Atomic Booking:** Instant seat confirmation with price breakdown and unique reference generation (`IMV-YYYYMMDD-XXXX`).
6. **Ticket Management:** "My Tickets" portal to inspect reservations, print receipts, and execute cancellations.
7. **Administrative Dashboard:** Metrics overview, movie catalog management, theatre creation, showtime scheduling, and customer booking logs.

---

## 10. Nonfunctional Requirements
- **Performance:** Sub-200ms API response latency for seat availability and catalogue queries.
- **Security:** Bcrypt password hashing (cost factor 10), JWT verification, CORS isolation, and sanitized inputs.
- **Reliability:** Atomic updates prevent conflicting bookings under high concurrency.
- **Usability:** High contrast typography (#F8FAFC on #070B16), intuitive iconography (Lucide React), and responsive layouts.
- **Portability:** Containerized/monorepo structure executable across macOS, Linux, and Windows.

---

## 11. Software and Hardware Requirements
- **Development Environment:** Node.js v20+, npm v10+
- **Frontend Framework:** React 18, React Router v6, Vite 6
- **Backend Framework:** Express.js 4.x
- **Database:** MongoDB 7.x (or MongoDB Atlas / MongoMemoryServer)
- **Minimum Client Hardware:** Dual-core CPU, 4 GB RAM, 1024x768 display resolution or mobile viewport.

---

## 12. Technology Stack
- **Frontend:** React.js, Vite, JavaScript (ES6+), CSS3 Variables, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose ODM
- **Authentication:** JSON Web Tokens (jsonwebtoken), bcryptjs
- **Testing:** Node.js Test Runner (`node:test`, `node:assert`), Manual QA Testing Matrix

---

## 13. System Architecture
IMovies employs a decoupled client-server architecture:
```
[ Browser / Mobile Client ]
         │  (HTTP / REST JSON)
         ▼
[ Express.js REST API Server (Port 5000) ]
   ├── Auth Middleware (JWT Verification)
   ├── Controllers (Movie, Theatre, Show, Booking, Admin)
   └── Concurrency Control ($nin Atomic Lock)
         │  (Mongoose ODM)
         ▼
[ MongoDB Database Engine ]
   ├── Users Collection
   ├── Movies Collection
   ├── Theatres Collection
   ├── Shows Collection (with bookedSeats array)
   └── Bookings Collection
```

---

## 14. Module Descriptions
1. **Authentication Module:** Handles credential validation, password hashing, JWT generation, and token verification.
2. **Movie & Theatre Catalog Module:** Manages cinema metadata, posters, genres, and auditorium configurations in Indore.
3. **Showtime Scheduling Module:** Coordinates screening times, ticket pricing tiers, and capacity tracking.
4. **Interactive Seating & Concurrency Module:** Renders seat layout and performs atomic reservation operations.
5. **Booking & Receipt Module:** Calculates final totals, generates unique references, and supports printing.
6. **Admin Management Module:** Displays real-time business metrics and empowers administrative CRUD actions.

---

## 15. Database Schema
- **User:** `_id`, `name`, `email` (unique), `passwordHash`, `role` ('user' | 'admin'), `timestamps`.
- **Movie:** `_id`, `title`, `overview`, `posterUrl`, `backdropUrl`, `genres`, `durationMinutes`, `rating`, `director`, `cast`, `language`, `featured`.
- **Theatre:** `_id`, `name`, `city` ('Indore'), `address`, `screens`, `seatLayout` (rows: 8, cols: 10).
- **Show:** `_id`, `movie` (ref: Movie), `theatre` (ref: Theatre), `showTime`, `ticketPrice`, `seatTierPrices`, `bookedSeats` (Array of Strings), `totalSeats` (80), `active`.
- **Booking:** `_id`, `bookingReference` (unique), `user` (ref: User), `show` (ref: Show), `movie`, `theatre`, `seats`, `seatCount`, `ticketPricePerSeat`, `convenienceFee`, `totalAmount`, `status` ('CONFIRMED' | 'CANCELLED').

---

## 16. API Design
Detailed REST endpoints are documented in `docs/API_DOCUMENTATION.md`, covering Health, Auth, Movies, Theatres, Shows, Bookings, and Administrative routes.

---

## 17. Authentication and Authorization
- Passwords are salt-hashed using `bcryptjs` (cost 10) and never stored in plaintext.
- Successful authentication produces a signed JSON Web Token containing the user's ID and role.
- Sensitive endpoints employ `protect` and `adminOnly` middleware guards to verify authorization headers before controller execution.

---

## 18. Booking Workflow
1. User selects a film from the homepage.
2. User chooses a theatre (e.g., PVR Phoenix Citadel) and showtime.
3. Client loads real-time seat availability from `/api/shows/:id/seats`.
4. User selects seats on the interactive grid.
5. Client submits booking request to `/api/bookings`.
6. Node.js initiates atomic query:
   ```javascript
   Show.findOneAndUpdate(
     { _id: showId, bookedSeats: { $nin: seats } },
     { $push: { bookedSeats: { $each: seats } } },
     { new: true }
   );
   ```
7. If the query returns `null`, the transaction aborts with HTTP 409 Conflict.
8. If successful, server calculates price, persists the booking, and returns the confirmed e-ticket.

---

## 19. Testing Strategy
A multi-tier QA test strategy was executed, combining automated Node.js unit tests (covering bcrypt hashing, pricing calculation, and atomic concurrency logic) with comprehensive manual workflow tests (documented in `docs/TESTING.md`).

---

## 20. Results
All 20 test cases in the QA testing matrix completed with status **PASS**. The application successfully starts, connects to MongoDB, auto-seeds realistic cinema data, and executes the complete booking lifecycle without runtime warnings or unhandled exceptions.

---

## 21. Limitations
- Payment gateway integration is simulated rather than connected to live bank APIs.
- Ticket delivery is on-screen and printable; SMS/WhatsApp messaging gateways are not configured.
- Real-time seat lock timeouts (e.g., 5-minute holding cart timer) are simplified to instant atomic confirmation.

---

## 22. Future Enhancements
- Integration with Razorpay / Stripe for live digital payments.
- Real-time WebSocket synchronization (Socket.io) to visually update occupied seats across all active browser tabs simultaneously.
- Automated email delivery of PDF tickets with QR codes using Nodemailer.
- Cinema food and beverage (F&B) combo add-ons during checkout.

---

## 23. Conclusion
The IMovies Movie Ticket Booking System successfully fulfills all requirements of a B.Tech Computer Science individual capstone project. By blending a modern aesthetic with rock-solid server-side validation and concurrency-safe database design, the project provides a comprehensive showcase of modern full-stack development skills.

---

## 24. References
1. React Documentation: https://react.dev/
2. Node.js Documentation: https://nodejs.org/en/docs/
3. Express.js Framework: https://expressjs.com/
4. MongoDB & Mongoose Manual: https://mongoosejs.com/
5. OWASP Top 10 Security Guidelines: https://owasp.org/www-project-top-ten/
