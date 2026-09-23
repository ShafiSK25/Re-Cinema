import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const movie = await prisma.movie.findUnique({
      where: { id: params.id },
      include: {
        shows: {
          where: {
            startTime: {
              gte: new Date(),
            },
          },
          include: {
            screen: {
              include: {
                theatre: true,
              },
            },
          },
          orderBy: {
            startTime: 'asc',
          },
        },
      },
    });

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json({ movie });
  } catch (error: any) {
    console.error('Error fetching movie:', error);
    return NextResponse.json({ error: 'Failed to fetch movie' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const movie = await prisma.movie.update({
      where: { id: params.id },
      data: {
        ...body,
        durationMin: body.durationMin ? Number(body.durationMin) : undefined,
        rating: body.rating ? Number(body.rating) : undefined,
        releaseDate: body.releaseDate ? new Date(body.releaseDate) : undefined,
      },
    });

    return NextResponse.json({ success: true, movie });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update movie' }, { status: 500 });
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

    await prisma.movie.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Movie deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete movie' }, { status: 500 });
  }
}
