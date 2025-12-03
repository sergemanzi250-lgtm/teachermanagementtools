import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb, COLLECTIONS } from '@/app/Lib/mongodb/mongodbAdmin';

export async function GET(request: NextRequest) {
  try {
    const database = await getMongoDb();
    
    // Fetch all lesson plans from MongoDB to check what's available
    const lessonPlans = await database.collection(COLLECTIONS.LESSON_PLANS).find({}).toArray();
    
    // Extract just the basic info for listing
    const summary = lessonPlans.map((plan: any) => ({
      id: plan._id.toString(),
      title: plan.title || plan.lessonTitle || 'Untitled',
      subject: plan.subject || 'No subject',
      className: plan.className || plan.class || 'No class',
      format: plan.format || 'Unknown',
      createdAt: plan.createdAt,
      hasContent: !!plan.content,
      contentPreview: plan.content ? plan.content.substring(0, 100) + '...' : 'No content'
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          totalPlans: lessonPlans.length,
          plans: summary
        },
        message: 'Database content retrieved successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching test data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch test data',
      },
      { status: 500 }
    );
  }
}