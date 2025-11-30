import { NextRequest, NextResponse } from 'next/server';
import { generateActivity, parseJsonFromResponse } from '@/app/Lib/utils/groq';
import { saveActivity } from '@/app/Lib/firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, topic, ageGroup, activityType, duration } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!topic || !ageGroup || !activityType) {
      return NextResponse.json(
        { success: false, error: 'topic, ageGroup, and activityType are required' },
        { status: 400 }
      );
    }

    const validTypes = ['group', 'hands-on', 'creative', 'individual'];
    if (!validTypes.includes(activityType)) {
      return NextResponse.json(
        { success: false, error: `activityType must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const generatedContent = await generateActivity({
      topic,
      ageGroup,
      activityType,
      duration,
    });

    const parsedContent = parseJsonFromResponse(generatedContent);

    const activityData = {
      topic,
      ageGroup,
      activityType,
      duration: duration || 30,
      content: generatedContent,
      parsed: parsedContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docId = await saveActivity(userId, activityData);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: docId,
          ...activityData,
        },
        message: 'Activity generated successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in generate-activity route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate activity',
      },
      { status: 500 }
    );
  }
}
