import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const compareSchema = z.object({
  ids: z.string().min(1, "Must provide college IDs to compare")
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const validated = compareSchema.safeParse({ ids: searchParams.get('ids') });
    
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid request", details: validated.error.format() }, { status: 400 });
    }

    // Split the comma-separated IDs (e.g., ?ids=uuid1,uuid2)
    const collegeIds = validated.data.ids.split(',');

    if (collegeIds.length > 3) {
      return NextResponse.json({ error: "Can only compare up to 3 colleges at once" }, { status: 400 });
    }

    const colleges = await prisma.college.findMany({
      where: {
        id: { in: collegeIds }
      },
      select: {
        id: true,
        name: true,
        location: true,
        rating: true,
        totalFees: true,
        averagePackage: true,
        highestPackage: true,
      }
    });

    return NextResponse.json({ data: colleges });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}