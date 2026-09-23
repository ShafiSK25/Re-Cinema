import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const show = await prisma.show.findUnique({
      where: { id: params.id },
      include: {
        movie: true,
        screen: {
          include: {
            theatre: true,
          },
        },
        bookings: {
          where: {
            paymentStatus: 'PAID',
          },
          select: {
            seats: true,
          },
        },
      },
    });

    if (!show) {
      return NextResponse.json({ error: 'Show not found' }, { status: 404 });
    }

    // Flatten booked seats into a single array
    const bookedSeats: string[] = [];
    show.bookings.forEach((b) => {
      try {
        const seats = JSON.parse(b.seats);
        if (Array.isArray(seats)) {
          bookedSeats.push(...seats);
        }
      } catch (e) {
        // ignore parse error
      }
    });

    return NextResponse.json({
      show: {
        id: show.id,
        startTime: show.startTime,
        priceSilver: show.priceSilver,
        priceGold: show.priceGold,
        priceVip: show.priceVip,
        movie: show.movie,
        screen: show.screen,
      },
      bookedSeats,
    });
  } catch (error: any) {
    console.error('Error fetching show:', error);
    return NextResponse.json({ error: 'Failed to fetch show details' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.show.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Show removed successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete show' }, { status: 500 });
  }
}
