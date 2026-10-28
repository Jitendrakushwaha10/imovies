#!/bin/bash

# IMovies — One-Click Development Launcher
# Starts both Backend (Port 5001) and Frontend (Port 5173)

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=================================================="
echo "🎬 STARTING IMOVIES MOVIE TICKET BOOKING SYSTEM"
echo "=================================================="

# Function to clean up child processes on exit (Ctrl+C)
cleanup() {
  echo ""
  echo "🛑 Stopping IMovies servers..."
  kill $(jobs -p) 2>/dev/null
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Start backend
echo "🚀 Starting Node.js / Express Backend on http://localhost:5001..."
cd "$DIR/backend"
node src/server.js &
BACKEND_PID=$!

# Wait 2 seconds for backend to start up
sleep 2

# Start frontend
echo "✨ Starting React / Vite Frontend on http://localhost:5173..."
cd "$DIR/frontend"
npx vite --port 5173 &
FRONTEND_PID=$!

echo ""
echo "=================================================="
echo "🎉 APPLICATION READY!"
echo "👉 Open Frontend in Browser: http://localhost:5173"
echo "👉 Backend API Health Check:  http://localhost:5001/api/health"
echo "Press Ctrl+C to stop both servers."
echo "=================================================="

wait
