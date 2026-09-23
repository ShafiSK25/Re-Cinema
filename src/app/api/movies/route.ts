import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const genre = searchParams.get('genre') || '';
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const where: any = {};
    if (!includeInactive) {
      where.isActive = true;
    }
    if (search) {
      where.title = { contains: search };
    }
    if (genre && genre !== 'All') {
      where.genre = { contains: genre };
    }

    const movies = await prisma.movie.findMany({
      where,
      orderBy: { releaseDate: 'desc' },
    });

    return NextResponse.json({ movies });
  } catch (error: any) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      description,
      posterUrl,
      bannerUrl,
      trailerUrl,
      genre,
      language,
      durationMin,
      releaseDate,
      rating,
    } = body;

    if (!title || !description || !posterUrl || !genre || !language) {
      return NextResponse.json({ error: 'Missing required movie fields.' }, { status: 400 });
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        posterUrl,
        bannerUrl: bannerUrl || null,
        trailerUrl: trailerUrl || null,
        genre,
        language,
        durationMin: Number(durationMin) || 120,
        releaseDate: new Date(releaseDate || Date.now()),
        rating: Number(rating) || 8.0,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, movie }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating movie:', error);
    return NextResponse.json({ error: 'Failed to create movie' }, { status: 500 });
  }
}
