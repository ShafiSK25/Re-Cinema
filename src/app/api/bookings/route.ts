import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const where = user.role === 'ADMIN' ? {} : { userId: user.id };

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: { name: true, email: true },
        },
        show: {
          include: {
            movie: true,
            screen: {
              include: {
                theatre: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = bookings.map((b) => ({
      ...b,
      seats: JSON.parse(b.seats),
    }));

    return NextResponse.json({ bookings: formatted });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { showId, seats, paymentMethod, guestInfo } = body;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return NextResponse.json({ error: 'Invalid booking data' }, { status: 400 });
    }

    // Resolve user: either logged in or guest account
    let bookingUserId = user?.id;

    if (!bookingUserId) {
      if (!guestInfo?.email || !guestInfo?.name) {
        return NextResponse.json(
          { error: 'Please sign in or provide contact details to book tickets.' },
          { status: 400 }
        );
      }

      // Find or create guest user
      let guest = await prisma.user.findUnique({
        where: { email: guestInfo.email.toLowerCase().trim() },
      });

      if (!guest) {
        guest = await prisma.user.create({
          data: {
            name: guestInfo.name.trim(),
            email: guestInfo.email.toLowerCase().trim(),
            password: 'guest-temp-password-123',
            role: 'USER',
          },
        });
      }
      bookingUserId = guest.id;
    }

    // Fetch show to calculate price & check existing bookings
    const show = await prisma.show.findUnique({
      where: { id: showId },
      include: {
        bookings: {
          where: { paymentStatus: 'PAID' },
          select: { seats: true },
        },
      },
    });

    if (!show) {
      return NextResponse.json({ error: 'Show not found' }, { status: 404 });
    }

    // Check collision: any seat already booked?
    const alreadyBooked = new Set<string>();
    show.bookings.forEach((b) => {
      try {
        const booked = JSON.parse(b.seats);
        if (Array.isArray(booked)) {
          booked.forEach((s) => alreadyBooked.add(s));
        }
      } catch (e) {}
    });

    const conflict = seats.find((s: string) => alreadyBooked.has(s));
    if (conflict) {
      return NextResponse.json(
        { error: `Seat ${conflict} was just booked by another user. Please choose another seat.` },
        { status: 409 }
      );
    }

    // Calculate total price based on seat tiers
    // Rows: A, B = VIP; C, D, E = Gold; F, G, H = Silver
    let baseAmount = 0;
    seats.forEach((seat: string) => {
      const row = seat.charAt(0).toUpperCase();
      if (row === 'A' || row === 'B') {
        baseAmount += show.priceVip;
      } else if (row === 'C' || row === 'D' || row === 'E') {
        baseAmount += show.priceGold;
      } else {
        baseAmount += show.priceSilver;
      }
    });

    // Convenience fee & GST
    const convenienceFee = Math.round(seats.length * 30);
    const taxes = Math.round((baseAmount + convenienceFee) * 0.18);
    const totalAmount = baseAmount + convenienceFee + taxes;

    // Generate readable random booking reference
    const bookingNumber = `BMS-${Math.floor(100000 + Math.random() * 900000)}`;

    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        userId: bookingUserId,
        showId,
        seats: JSON.stringify(seats),
        totalAmount,
        paymentStatus: 'PAID',
        paymentMethod: paymentMethod || 'CARD',
      },
      include: {
        show: {
          include: {
            movie: true,
            screen: {
              include: {
                theatre: true,
              },
            },
          },
        },
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      booking: {
        ...booking,
        seats: JSON.parse(booking.seats),
      },
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to complete booking' }, { status: 500 });
  }
}
