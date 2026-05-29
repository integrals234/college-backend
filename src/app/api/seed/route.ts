import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Clear existing data to prevent duplicates on re-seed
    await prisma.college.deleteMany();

    const c1 = await prisma.college.create({
      data: {
        name: "National Institute of Technology",
        location: "Hamirpur",
        overview: "A premier engineering institution nestled in the Himalayas.",
        rating: 4.2,
        totalFees: 500000,
        minRank: 15000,
        averagePackage: 1000000,
        highestPackage: 3500000,
        courses: { create: [{ name: "Electrical Engineering", tuitionFee: 125000 }] },
        reviews: { create: [{ content: "Great campus and core branch placements.", rating: 4 }] }
      }
    });

    const c2 = await prisma.college.create({
      data: {
        name: "Indian Institute of Technology",
        location: "Delhi",
        overview: "Top tier engineering college with exceptional research facilities.",
        rating: 4.8,
        totalFees: 800000,
        minRank: 1000,
        averagePackage: 2000000,
        highestPackage: 15000000,
        courses: { create: [{ name: "Computer Science", tuitionFee: 200000 }] },
        reviews: { create: [{ content: "Highly competitive but worth it.", rating: 5 }] }
      }
    });

    return NextResponse.json({ message: "Production Database seeded!", data: [c1, c2] });
  } catch (error) {
    return NextResponse.json({ error: "Seed failed." }, { status: 500 });
  }
}