import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const theatreId = searchParams.get('theatreId');

    const screens = await prisma.screen.findMany({
      where: theatreId ? { theatreId } : undefined,
      include: {
        theatre: true,
        shows: {
          take: 5,
          orderBy: { startTime: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ screens });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch screens' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { name, theatreId, screenType, totalRows, seatsPerRow } = await req.json();

    if (!name || !theatreId || !screenType) {
      return NextResponse.json({ error: 'Missing required screen fields' }, { status: 400 });
    }

    const screen = await prisma.screen.create({
      data: {
        name,
        theatreId,
        screenType,
        totalRows: Number(totalRows) || 8,
        seatsPerRow: Number(seatsPerRow) || 12,
      },
      include: {
        theatre: true,
      },
    });

    return NextResponse.json({ success: true, screen }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating screen:', error);
    return NextResponse.json({ error: 'Failed to create screen' }, { status: 500 });
  }
}
