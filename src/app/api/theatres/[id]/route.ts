import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.theatre.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Multiplex removed successfully' });
  } catch (error: any) {
    console.error('Error deleting theatre:', error);
    return NextResponse.json({ error: 'Failed to delete multiplex' }, { status: 500 });
  }
}
