import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const searchSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  maxFees: z.coerce.number().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    // 1. Validation System
    const validated = searchSchema.safeParse(params);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid parameters", details: validated.error.format() }, { status: 400 });
    }

    const { query, location, maxFees, page, limit } = validated.data;
    const skip = (page - 1) * limit;

    // 2. Dynamic Filtering System
    const filterConditions: any = {};
    if (query) filterConditions.name = { contains: query };
    if (location) filterConditions.location = { contains: location };
    if (maxFees) filterConditions.totalFees = { lte: maxFees };

    // 3. Pagination Execution
    const [colleges, totalCount] = await Promise.all([
      prisma.college.findMany({
        where: filterConditions,
        skip,
        take: limit,
        orderBy: { rating: 'desc' },
      }),
      prisma.college.count({ where: filterConditions })
    ]);

    return NextResponse.json({ 
      data: colleges, 
      meta: { total: totalCount, page, limit, totalPages: Math.ceil(totalCount / limit) } 
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}