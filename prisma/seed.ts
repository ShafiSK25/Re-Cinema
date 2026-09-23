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

  console.log('Theatres and screens configured successfully.');
  console.log('Database seeded with multiplexes and screens (no pre-built movies or shows)!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
