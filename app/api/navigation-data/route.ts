import { NextResponse } from 'next/server';
import { getNavigationData } from '@/lib/data-access';

export async function GET() {
  try {
    const navigationData = await getNavigationData();
    
    return NextResponse.json(navigationData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching navigation data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation data' },
      { status: 500 }
    );
  }
}