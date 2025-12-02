import { NextRequest, NextResponse } from 'next/server';
import { generateActivityPrompt, validatePromptInput } from '@/app/Lib/utils/prompts';
import { generateWithGroq, parseJsonFromResponse } from '@/app/Lib/utils/groq';
import { saveActivityMongo } from '@/app/Lib/mongodb/mongodbAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, topic, ageGroup, activityType, duration, className, learningObjectives, materials, additionalNotes } = body;

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

    // Generate prompt using prompt system
    const prompt = generateActivityPrompt({
      topic,
      className: className || ageGroup,
      ageGroup,
      activityType,
      duration: duration || 30,
      learningObjectives,
      materials,
      additionalNotes,
    });

    const generatedContent = await generateWithGroq(prompt);
    const parsedContent = parseJsonFromResponse(generatedContent);

    const activityData = {
      topic,
      ageGroup,
      activityType,
      duration: duration || 30,
      className: className || ageGroup,
      content: generatedContent,
      parsed: parsedContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docId = await saveActivityMongo(userId, activityData);

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
