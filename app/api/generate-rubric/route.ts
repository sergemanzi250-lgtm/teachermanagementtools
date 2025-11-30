import { NextRequest, NextResponse } from 'next/server';
import { generateRubric, parseJsonFromResponse } from '@/app/Lib/utils/groq';
import { saveRubric } from '@/app/Lib/firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, assignmentDescription, skills, performanceLevels } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!assignmentDescription || !skills || skills.length === 0) {
      return NextResponse.json(
        { success: false, error: 'assignmentDescription and skills array are required' },
        { status: 400 }
      );
    }

    const generatedContent = await generateRubric({
      assignmentDescription,
      skills,
      performanceLevels,
    });

    const parsedContent = parseJsonFromResponse(generatedContent);

    const rubricData = {
      assignmentDescription,
      skills,
      content: generatedContent,
      parsed: parsedContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docId = await saveRubric(userId, rubricData);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: docId,
          ...rubricData,
        },
        message: 'Rubric generated successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in generate-rubric route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate rubric',
      },
      { status: 500 }
    );
  }
}
