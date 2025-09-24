import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const blogs = await db.blogs.findMany();
  return NextResponse.json(blogs);
};
