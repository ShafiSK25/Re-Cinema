import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const theatres = await prisma.theatre.findMany({
      include: {
        screens: true,
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ theatres });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch theatres' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { name, city, address } = await req.json();
    if (!name || !city || !address) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const theatre = await prisma.theatre.create({
      data: { name, city, address },
      include: { screens: true },
    });

    return NextResponse.json({ success: true, theatre }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create theatre' }, { status: 500 });
  }
}
