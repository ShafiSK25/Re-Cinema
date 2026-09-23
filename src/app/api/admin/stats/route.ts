import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin only.' }, { status: 403 });
    }

    const [totalMovies, totalTheatres, totalScreens, totalShows, bookings] = await Promise.all([
      prisma.movie.count({ where: { isActive: true } }),
      prisma.theatre.count(),
      prisma.screen.count(),
      prisma.show.count(),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          show: {
            include: {
              movie: true,
              screen: { include: { theatre: true } },
            },
          },
        },
      }),
    ]);

    // Aggregate total revenue and seats booked
    const allBookings = await prisma.booking.findMany({
      where: { paymentStatus: 'PAID' },
      select: { totalAmount: true, seats: true },
    });

    const totalRevenue = allBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    let totalTicketsBooked = 0;
    allBookings.forEach((b) => {
      try {
        const arr = JSON.parse(b.seats);
        totalTicketsBooked += Array.isArray(arr) ? arr.length : 1;
      } catch (e) {
        totalTicketsBooked += 1;
      }
    });

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalBookings: allBookings.length,
        totalTicketsBooked,
        totalMovies,
        totalTheatres,
        totalScreens,
        totalShows,
      },
      recentBookings: bookings.map((b) => ({
        ...b,
        seats: JSON.parse(b.seats),
      })),
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
