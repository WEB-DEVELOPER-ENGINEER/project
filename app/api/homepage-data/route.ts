import { NextResponse } from 'next/server';
import { getHomepageData } from '@/lib/data-access';

export async function GET() {
  try {
    const homepageData = await getHomepageData();
    
    return NextResponse.json(homepageData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage data' },
      { status: 500 }
    );
  }
}