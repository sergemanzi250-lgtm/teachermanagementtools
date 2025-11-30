import { NextRequest, NextResponse } from 'next/server';
import { generateLessonPlan, parseJsonFromResponse } from '@/app/Lib/utils/groq';
import { saveLessonPlan } from '@/app/Lib/firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { userId, format, ...input } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!format || !['REB', 'RTB', 'NURSERY'].includes(format)) {
      return NextResponse.json(
        { success: false, error: 'Valid format (REB, RTB, NURSERY) is required' },
        { status: 400 }
      );
    }

    // Generate lesson plan using Groq
    const generatedContent = await generateLessonPlan({
      subject: input.subject || '',
      grade: input.className || input.grade || '',
      topic: input.title || input.topic || '',
      duration: input.duration || 60,
      objectives: input.objectives || input.key_unity_competence || '',
      notes: input.notes || '',
    });

    // Parse the response
    const parsedContent = parseJsonFromResponse(generatedContent);

    // Prepare data for Firestore
    const lessonPlanData = {
      format,
      userId,
      content: generatedContent,
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to Firestore
    const docId = await saveLessonPlan(userId, lessonPlanData);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: docId,
          content: generatedContent,
          parsed: parsedContent,
          ...lessonPlanData,
        },
        message: 'Lesson plan generated successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in generate-lesson-plan route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate lesson plan',
      },
      { status: 500 }
    );
  }
}

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

    return NextResponse.json(
      { success: true, message: 'GET endpoint ready for fetching lesson plans' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in generate-lesson-plan GET route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch lesson plan',
      },
      { status: 500 }
    );
  }
}
