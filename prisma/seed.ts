import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding movie booking database...');

  // 1. Clear existing data
  await prisma.booking.deleteMany();
  await prisma.show.deleteMany();
  await prisma.screen.deleteMany();
  await prisma.theatre.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users (Admin and regular Customer)
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedUserPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Cinema Admin',
      email: 'admin@cinema.com',
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'user@cinema.com',
      password: hashedUserPassword,
      role: 'USER',
    },
  });

  console.log('Created Users: Admin (admin@cinema.com), User (user@cinema.com)');

  // 3. Create Theatres & Screens
  const theatre1 = await prisma.theatre.create({
    data: {
      name: 'PVR ICON: Phoenix Palladium',
      city: 'Mumbai',
      address: 'High Street Phoenix, 462, Senapati Bapat Marg, Lower Parel',
      screens: {
        create: [
          {
            name: 'Screen 1 - IMAX Laser',
            screenType: 'IMAX',
            totalRows: 8,
            seatsPerRow: 12,
          },
          {
            name: 'Screen 2 - Dolby Atmos 4DX',
            screenType: '4DX',
            totalRows: 7,
            seatsPerRow: 10,
          },
        ],
      },
    },
    include: { screens: true },
  });

  const theatre2 = await prisma.theatre.create({
    data: {
      name: 'INOX Megaplex: Inorbit Mall',
      city: 'Mumbai',
      address: 'Link Road, Malad West, Mumbai',
      screens: {
        create: [
          {
            name: 'Audi 1 - Luxe 3D',
            screenType: '3D',
            totalRows: 8,
            seatsPerRow: 12,
          },
          {
            name: 'Audi 2 - Standard 2D',
            screenType: '2D',
            totalRows: 8,
            seatsPerRow: 10,
          },
        ],
      },
    },
    include: { screens: true },
  });

  const theatre3 = await prisma.theatre.create({
    data: {
      name: 'Cinepolis VIP: DLF Avenue',
      city: 'Delhi-NCR',
      address: 'Press Enclave Road, Saket District Centre, New Delhi',
      screens: {
        create: [
          {
            name: 'Screen 1 - VIP Lounge',
            screenType: '2D',
            totalRows: 6,
            seatsPerRow: 8,
          },
        ],
      },
    },
    include: { screens: true },
  });

  // 4. Create Movies
  const movie1 = await prisma.movie.create({
    data: {
      title: 'Interstellar (10th Anniversary)',
      description:
        'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
      posterUrl:
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
      bannerUrl:
        'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
      genre: 'Sci-Fi, Adventure, Drama',
      language: 'English',
      durationMin: 169,
      releaseDate: new Date('2024-11-07'),
      rating: 8.9,
      isActive: true,
    },
  });

  const movie2 = await prisma.movie.create({
    data: {
      title: 'Dune: Part Two',
      description:
        'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between the love of his life and the fate of the known universe.',
      posterUrl:
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
      bannerUrl:
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
      genre: 'Action, Sci-Fi, Adventure',
      language: 'English, Hindi',
      durationMin: 166,
      releaseDate: new Date('2024-03-01'),
      rating: 8.7,
      isActive: true,
    },
  });

  const movie3 = await prisma.movie.create({
    data: {
      title: 'Deadpool & Wolverine',
      description:
        'Wolverine is recovering from his injuries when he crosses paths with the loudmouth, Deadpool. They team up to defeat a common enemy in a multiverse-shattering adventure.',
      posterUrl:
        'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
      bannerUrl:
        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
      genre: 'Action, Comedy, Sci-Fi',
      language: 'English, Hindi',
      durationMin: 128,
      releaseDate: new Date('2024-07-26'),
      rating: 8.1,
      isActive: true,
    },
  });

  const movie4 = await prisma.movie.create({
    data: {
      title: 'Gladiator II',
      description:
        'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
      posterUrl:
        'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=800&auto=format&fit=crop',
      bannerUrl:
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
      genre: 'Action, Adventure, Drama',
      language: 'English',
      durationMin: 148,
      releaseDate: new Date('2024-11-15'),
      rating: 8.2,
      isActive: true,
    },
  });

  console.log('Created 4 featured movies');

  // 5. Schedule Shows for Today, Tomorrow, and Next Day
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const showtimes = [
    { hour: 10, minute: 30 },
    { hour: 14, minute: 15 },
    { hour: 18, minute: 0 },
    { hour: 21, minute: 45 },
  ];

  const screens = [
    ...theatre1.screens,
    ...theatre2.screens,
    ...theatre3.screens,
  ];

  const movies = [movie1, movie2, movie3, movie4];

  const createdShows: any[] = [];

  for (let dayOffset = 0; dayOffset < 4; dayOffset++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + dayOffset);

    for (let i = 0; i < screens.length; i++) {
      const screen = screens[i];
      const movie = movies[i % movies.length];

      for (const time of showtimes) {
        const showTime = new Date(targetDate);
        showTime.setHours(time.hour, time.minute, 0, 0);

        const isImax = screen.screenType === 'IMAX';
        const is3D = screen.screenType === '3D';

        const show = await prisma.show.create({
          data: {
            movieId: movie.id,
            screenId: screen.id,
            startTime: showTime,
            priceSilver: isImax ? 300 : is3D ? 220 : 180,
            priceGold: isImax ? 450 : is3D ? 320 : 260,
            priceVip: isImax ? 650 : is3D ? 480 : 400,
          },
        });
        createdShows.push(show);
      }
    }
  }

  console.log(`Created ${createdShows.length} scheduled shows`);

  // 6. Create sample bookings
  if (createdShows.length > 0) {
    await prisma.booking.create({
      data: {
        bookingNumber: 'BMS-918234',
        userId: demoUser.id,
        showId: createdShows[0].id,
        seats: JSON.stringify(['C5', 'C6']),
        totalAmount: 520,
        paymentStatus: 'PAID',
        paymentMethod: 'UPI',
      },
    });

    await prisma.booking.create({
      data: {
        bookingNumber: 'BMS-654129',
        userId: demoUser.id,
        showId: createdShows[1].id,
        seats: JSON.stringify(['A3', 'A4', 'A5']),
        totalAmount: 1950,
        paymentStatus: 'PAID',
        paymentMethod: 'CARD',
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
