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

    // Fetch lesson plans from MongoDB
    const lessonPlans = await getUserDocumentsMongo('lessonPlans', userId);

    return NextResponse.json(
      {
        success: true,
        data: lessonPlans,
        message: 'Lesson plans fetched successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching lesson plans:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch lesson plans',
      },
      { status: 500 }
    );
  }
}