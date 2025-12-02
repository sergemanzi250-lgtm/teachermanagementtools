import { NextRequest, NextResponse } from 'next/server';
import { generateRubricPrompt, validatePromptInput } from '@/app/Lib/utils/prompts';
import { generateWithGroq, parseJsonFromResponse } from '@/app/Lib/utils/groq';
import { saveRubricMongo } from '@/app/Lib/mongodb/mongodbAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, assignmentDescription, skills, performanceLevels, className, assignmentName } = body;

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

    // Generate prompt using prompt system
    const prompt = generateRubricPrompt({
      assignmentName: assignmentName || 'Assignment',
      className: className || 'General',
      skills: Array.isArray(skills) ? skills : skills.split(',').map((s: string) => s.trim()),
      performanceLevels: performanceLevels || 4,
    });

    const generatedContent = await generateWithGroq(prompt);
    const parsedContent = parseJsonFromResponse(generatedContent);

    const rubricData = {
      assignmentDescription,
      assignmentName: assignmentName || 'Assignment',
      skills: Array.isArray(skills) ? skills : skills.split(',').map((s: string) => s.trim()),
      className: className || 'General',
      performanceLevels: performanceLevels || 4,
      content: generatedContent,
      parsed: parsedContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docId = await saveRubricMongo(userId, rubricData);

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
