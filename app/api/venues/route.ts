import { NextResponse } from 'next/server';
import { getActiveVenues } from '@/lib/content';

export async function GET() {
  const venues = await getActiveVenues();
  return NextResponse.json(venues);
}
