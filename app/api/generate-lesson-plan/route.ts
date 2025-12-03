import { NextRequest, NextResponse } from 'next/server';
import {
  parseJsonFromResponse,
  generateWithGroq,
} from '@/app/Lib/utils/groq';
import { saveLessonPlanMongo } from '@/app/Lib/mongodb/mongodbAdmin';
import { stripHTML } from '@/app/Lib/utils/sanitize';
import {
  generateRebLessonPlanPrompt,
  generateRtbSessionPlanPrompt,
  generateNurseryLessonPlanPrompt,
  validatePromptInput,
} from '@/app/Lib/utils/prompts';

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

    // Validate form inputs
    const validation = validatePromptInput({ ...input, format });
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Generate content based on format using enhanced prompts
    let generatedContent: string;

    if (format === 'REB') {
      const prompt = generateRebLessonPlanPrompt(input);
      generatedContent = await generateWithGroq(prompt);
    } else if (format === 'RTB') {
      const prompt = generateRtbSessionPlanPrompt(input);
      generatedContent = await generateWithGroq(prompt);
      // Strip HTML tags from RTB generated content
      generatedContent = stripHTML(generatedContent);
    } else if (format === 'NURSERY') {
      const prompt = generateNurseryLessonPlanPrompt(input);
      generatedContent = await generateWithGroq(prompt);
    } else {
      throw new Error('Invalid format');
    }

    // Parse the response
    const parsedContent = parseJsonFromResponse(generatedContent);

    // Prepare data for Firestore
    const lessonPlanData = {
      format,
      userId,
      content: generatedContent,
      parsed: parsedContent,
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to MongoDB
    const docId = await saveLessonPlanMongo(userId, lessonPlanData);

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
