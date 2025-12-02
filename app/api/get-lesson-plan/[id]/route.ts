import { NextRequest, NextResponse } from 'next/server';
import { getDocumentMongo } from '@/app/Lib/mongodb/mongodbAdmin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Lesson plan ID is required' },
        { status: 400 }
      );
    }

    // Fetch lesson plan from MongoDB
    const lessonPlan = await getDocumentMongo('lessonPlans', id);

    if (!lessonPlan) {
      return NextResponse.json(
        { success: false, error: 'Lesson plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: lessonPlan,
        message: 'Lesson plan fetched successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching lesson plan:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch lesson plan',
      },
      { status: 500 }
    );
  }
}