import { NextResponse } from 'next/server';
import { getFooterData } from '@/lib/data-access';

export async function GET() {
  try {
    const footerData = await getFooterData();
    
    return NextResponse.json(footerData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching footer data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch footer data' },
      { status: 500 }
    );
  }
}