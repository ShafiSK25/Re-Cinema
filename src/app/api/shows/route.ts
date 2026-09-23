import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get('movieId');
    const screenId = searchParams.get('screenId');
    const dateStr = searchParams.get('date');

    const where: any = {};
    if (movieId) where.movieId = movieId;
    if (screenId) where.screenId = screenId;

    if (dateStr) {
      const startOfDay = new Date(dateStr);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateStr);
      endOfDay.setHours(23, 59, 59, 999);
      where.startTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const shows = await prisma.show.findMany({
      where,
      include: {
        movie: true,
        screen: {
          include: {
            theatre: true,
          },
        },
      },
      orderBy: { startTime: 'asc' },
    });

    return NextResponse.json({ shows });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch shows' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { movieId, screenId, startTime, priceSilver, priceGold, priceVip } = await req.json();

    if (!movieId || !screenId || !startTime) {
      return NextResponse.json({ error: 'Missing required show fields' }, { status: 400 });
    }

    const show = await prisma.show.create({
      data: {
        movieId,
        screenId,
        startTime: new Date(startTime),
        priceSilver: Number(priceSilver) || 180,
        priceGold: Number(priceGold) || 250,
        priceVip: Number(priceVip) || 400,
      },
      include: {
        movie: true,
        screen: {
          include: {
            theatre: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, show }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating show:', error);
    return NextResponse.json({ error: 'Failed to schedule show' }, { status: 500 });
  }
}
