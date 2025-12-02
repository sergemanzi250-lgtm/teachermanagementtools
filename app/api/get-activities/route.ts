import { NextRequest, NextResponse } from 'next/server';
import { getUserDocumentsMongo } from '@/app/Lib/mongodb/mongodbAdmin';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch activities from MongoDB
    const activities = await getUserDocumentsMongo('activities', userId);

    return NextResponse.json(
      {
        success: true,
        data: activities,
        message: 'Activities fetched successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch activities',
      },
      { status: 500 }
    );
  }
}