import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed/seedData.js';
import { Movie } from './models/Movie.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    console.log('🚀 Initializing IMovies Backend Service...');
    await connectDB();

    // Auto-seed if database is currently empty
    const moviesCount = await Movie.countDocuments();
    if (moviesCount === 0) {
      console.log('✨ First-time run detected: auto-seeding initial database...');
      await seedDatabase();
    } else {
      console.log(`🎬 Found ${moviesCount} existing movies in database.`);
    }

    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🎟️  IMOVIES REST API SERVER RUNNING`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });

    const shutdown = async () => {
      console.log('\n🛑 Gracefully shutting down IMovies server...');
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
