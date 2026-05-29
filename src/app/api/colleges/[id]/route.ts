import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const college = await prisma.college.findUnique({
      where: { id: params.id },
      include: { 
        courses: true, 
        reviews: { orderBy: { createdAt: 'desc' } }, 
        questions: true 
      }
    });

    if (!college) return NextResponse.json({ error: "College not found" }, { status: 404 });
    return NextResponse.json({ data: college });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}