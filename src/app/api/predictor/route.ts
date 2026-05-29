import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rank = Number(searchParams.get('rank') || 0);

    const colleges = await prisma.college.findMany({
      where: { minRank: { gte: rank } },
      take: 5,
      orderBy: { minRank: 'asc' }
    });

    return NextResponse.json({ data: colleges });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}