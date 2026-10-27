import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Movie } from '../models/Movie.js';
import { Theatre } from '../models/Theatre.js';
import { Show } from '../models/Show.js';
import { Booking } from '../models/Booking.js';

dotenv.config();

export const seedDatabase = async () => {
  console.log('🌱 Starting IMovies Database Seeding...');

  // 1. Seed Administrator and Demo User
  const salt = await bcrypt.genSalt(10);
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@imovies.com').toLowerCase();

  const adminPasswordHash = await bcrypt.hash(adminPassword, salt);
  const studentPasswordHash = await bcrypt.hash('Student@123', salt);

  const adminUser = await User.findOneAndUpdate(
    { email: adminEmail },
    {
      name: 'System Administrator',
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: 'admin'
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const demoUser = await User.findOneAndUpdate(
    { email: 'student@imovies.com' },
    {
      name: 'Pankaj Kushwah',
      email: 'student@imovies.com',
      passwordHash: studentPasswordHash,
      role: 'user'
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('✅ Users configured:');
  console.log(`   Admin: ${adminEmail} (password: ${adminPassword})`);
  console.log(`   Student: student@imovies.com (password: Student@123)`);

  // 2. Seed Indore Theatres
  const theatresData = [
    {
      name: 'PVR INOX: C21 Mall',
      city: 'Indore',
      address: 'Plot 262, AB Road, Scheme 54 PU4, Vijay Nagar, Indore, MP',
      screens: 5,
      seatLayout: {
        rows: 8,
        cols: 10,
        rowLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      }
    },
    {
      name: 'PVR: Phoenix Citadel Mall',
      city: 'Indore',
      address: 'MR 10 Junction, Near Bypass, Indore, MP',
      screens: 8,
      seatLayout: {
        rows: 8,
        cols: 10,
        rowLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      }
    },
    {
      name: 'Cinepolis: Treasure Island Mall',
      city: 'Indore',
      address: '11 MG Road, South Tukoganj, Indore, MP',
      screens: 5,
      seatLayout: {
        rows: 8,
        cols: 10,
        rowLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      }
    }
  ];

  const theatres = [];
  for (const t of theatresData) {
    const theatre = await Theatre.findOneAndUpdate(
      { name: t.name, city: t.city },
      t,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    theatres.push(theatre);
  }
  console.log(`✅ Seeded ${theatres.length} prominent Indore multiplexes.`);

  // 3. Seed Realistic Movies with reliable images
  const moviesData = [
    {
      title: 'Dune: Part Two',
      overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between love and the fate of the universe.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s520027.jpg',
      genres: ['Sci-Fi', 'Adventure', 'Action'],
      durationMinutes: 166,
      rating: 8.6,
      releaseDate: new Date('2024-03-01'),
      language: 'English',
      featured: true,
      director: 'Denis Villeneuve',
      cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler']
    },
    {
      title: 'Oppenheimer',
      overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II under the Manhattan Project.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/fm6K9vY9WiYmgrqpEBW996IRwsq.jpg',
      genres: ['Drama', 'History', 'Thriller'],
      durationMinutes: 180,
      rating: 8.9,
      releaseDate: new Date('2023-07-21'),
      language: 'English',
      featured: true,
      director: 'Christopher Nolan',
      cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.']
    },
    {
      title: 'Interstellar',
      overview: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/rAiYTsq0q2P5nqeMcb7XmCEzE7d.jpg',
      genres: ['Sci-Fi', 'Drama', 'Adventure'],
      durationMinutes: 169,
      rating: 8.7,
      releaseDate: new Date('2014-11-07'),
      language: 'English',
      featured: true,
      director: 'Christopher Nolan',
      cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain']
    },
    {
      title: 'The Dark Knight',
      overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1rsqRmrYFsxBh.jpg',
      genres: ['Action', 'Crime', 'Drama', 'Thriller'],
      durationMinutes: 152,
      rating: 9.0,
      releaseDate: new Date('2008-07-18'),
      language: 'English',
      featured: true,
      director: 'Christopher Nolan',
      cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine']
    },
    {
      title: 'Spider-Man: Across the Spider-Verse',
      overview: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When heroes clash on handling a threat, Miles must redefine heroism.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
      genres: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
      durationMinutes: 140,
      rating: 8.7,
      releaseDate: new Date('2023-06-02'),
      language: 'English',
      featured: false,
      director: 'Joaquim Dos Santos, Kemp Powers',
      cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac']
    },
    {
      title: 'Inception',
      overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
      genres: ['Sci-Fi', 'Action', 'Thriller'],
      durationMinutes: 148,
      rating: 8.8,
      releaseDate: new Date('2010-07-16'),
      language: 'English',
      featured: false,
      director: 'Christopher Nolan',
      cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy']
    },
    {
      title: 'Top Gun: Maverick',
      overview: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN\'s elite graduates on a mission demanding ultimate sacrifice.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/AaV1YIdWKnjAiaOe0UUKNJm322h.jpg',
      genres: ['Action', 'Drama'],
      durationMinutes: 130,
      rating: 8.3,
      releaseDate: new Date('2022-05-27'),
      language: 'English',
      featured: false,
      director: 'Joseph Kosinski',
      cast: ['Tom Cruise', 'Miles Teller', 'Jennifer Connelly']
    },
    {
      title: 'RRR',
      overview: 'A fearless revolutionary and an officer in the British force, who once were friends, unite against malicious rulers to fight for the independence of their motherland.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/kdO1948x1H6z2BqOcbhVb9k4xW8.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/70Rm9mwh2Vw36DyjuB24A6vY8nF.jpg',
      genres: ['Action', 'Drama'],
      durationMinutes: 187,
      rating: 8.0,
      releaseDate: new Date('2022-03-25'),
      language: 'Telugu / Hindi / English',
      featured: false,
      director: 'S.S. Rajamouli',
      cast: ['N.T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt', 'Ajay Devgn']
    }
  ];

  const movies = [];
  for (const m of moviesData) {
    const movie = await Movie.findOneAndUpdate(
      { title: m.title },
      m,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    movies.push(movie);
  }
  console.log(`✅ Seeded ${movies.length} blockbuster movies.`);

  // 4. Seed Showtimes for today, tomorrow, and day after tomorrow
  const now = new Date();
  const times = ['11:30 AM', '02:45 PM', '06:15 PM', '09:30 PM'];
  const basePrices = [220, 260, 300, 350];

  // Keep track of existing shows to avoid overwriting ongoing user bookings
  let showsCreated = 0;
  for (let dayOffset = 0; dayOffset <= 2; dayOffset++) {
    for (let mIdx = 0; mIdx < movies.length; mIdx++) {
      const movie = movies[mIdx];
      // Distribute across theatres
      const theatre = theatres[mIdx % theatres.length];

      for (let tIdx = 0; tIdx < 2; tIdx++) {
        const timeStr = times[(mIdx + tIdx) % times.length];
        const [hourPart, minutePart] = timeStr.split(' ')[0].split(':');
        const isPM = timeStr.includes('PM');
        let hours = parseInt(hourPart, 10);
        if (isPM && hours !== 12) hours += 12;
        if (!isPM && hours === 12) hours = 0;
        const minutes = parseInt(minutePart, 10);

        const showDate = new Date(now);
        showDate.setDate(now.getDate() + dayOffset);
        showDate.setHours(hours, minutes, 0, 0);

        // Check if show already exists
        const existingShow = await Show.findOne({
          movie: movie._id,
          theatre: theatre._id,
          showTime: showDate
        });

        if (!existingShow) {
          const price = basePrices[(mIdx + tIdx) % basePrices.length];
          // Sample pre-booked seats to show realistic theater state
          const samplePreBooked = (dayOffset === 0 && tIdx === 0)
            ? ['C4', 'C5', 'D4', 'D5', 'D6']
            : [];

          await Show.create({
            movie: movie._id,
            theatre: theatre._id,
            screenNumber: (mIdx % 3) + 1,
            showTime: showDate,
            ticketPrice: price,
            seatTierPrices: {
              silver: Math.round(price * 0.8),
              gold: price,
              platinum: Math.round(price * 1.3)
            },
            bookedSeats: samplePreBooked,
            totalSeats: 80,
            active: true
          });
          showsCreated++;
        }
      }
    }
  }
  console.log(`✅ Seeded ${showsCreated} active upcoming showtimes.`);

  // 5. Seed a Sample Booking for the Demo User
  const sampleShow = await Show.findOne({ movie: movies[0]._id }).populate('theatre');
  if (sampleShow) {
    const existingBooking = await Booking.findOne({ user: demoUser._id });
    if (!existingBooking) {
      const demoSeats = ['E5', 'E6'];
      // Ensure seats are recorded in show
      await Show.findByIdAndUpdate(sampleShow._id, {
        $addToSet: { bookedSeats: { $each: demoSeats } }
      });

      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      await Booking.create({
        bookingReference: `IMV-${dateStr}-DEMO1`,
        user: demoUser._id,
        show: sampleShow._id,
        movie: sampleShow.movie,
        theatre: sampleShow.theatre._id,
        seats: demoSeats,
        seatCount: demoSeats.length,
        ticketPricePerSeat: sampleShow.ticketPrice,
        convenienceFee: 30,
        totalAmount: demoSeats.length * sampleShow.ticketPrice + 30,
        status: 'CONFIRMED'
      });
      console.log('✅ Seeded sample confirmed booking for demo user (student@imovies.com).');
    }
  }

  console.log('🎉 Database seeding completed successfully!\n');
};

// Allow running standalone from CLI
if (process.argv[1]?.endsWith('seedData.js')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    }
  })();
}
