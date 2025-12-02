import { NextRequest, NextResponse } from 'next/server';
import { deleteDocumentMongo } from '@/app/Lib/mongodb/mongodbAdmin';

export async function DELETE(
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

    // Delete lesson plan from MongoDB
    await deleteDocumentMongo('lessonPlans', id);

    return NextResponse.json(
      {
        success: true,
        message: 'Lesson plan deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting lesson plan:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete lesson plan',
      },
      { status: 500 }
    );
  }
}