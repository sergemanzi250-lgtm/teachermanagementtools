import { NextRequest, NextResponse } from 'next/server';
import { generateSchemeOfWorkPrompt, validatePromptInput } from '@/app/Lib/utils/prompts';
import { generateWithGroq, parseJsonFromResponse } from '@/app/Lib/utils/groq';
import { saveSchemeOfWorkMongo } from '@/app/Lib/mongodb/mongodbAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subject, grade, weeks, topics, className, term, competencies, additionalNotes } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!subject || !grade || !weeks || !topics || topics.length === 0) {
      return NextResponse.json(
        { success: false, error: 'subject, grade, weeks, and topics array are required' },
        { status: 400 }
      );
    }

    // Generate prompt using prompt system
    const prompt = generateSchemeOfWorkPrompt({
      subject,
      className: className || grade,
      weeks,
      topics: Array.isArray(topics) ? topics : topics.split(',').map((t: string) => t.trim()),
      term,
      competencies,
      additionalNotes,
    });

    const generatedContent = await generateWithGroq(prompt);
    const parsedContent = parseJsonFromResponse(generatedContent);

    const schemeData = {
      subject,
      grade,
      weeks,
      topics: Array.isArray(topics) ? topics : topics.split(',').map((t: string) => t.trim()),
      className: className || grade,
      term,
      competencies,
      content: generatedContent,
      parsed: parsedContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docId = await saveSchemeOfWorkMongo(userId, schemeData);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: docId,
          ...schemeData,
        },
        message: 'Scheme of work generated successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in generate-scheme-of-work route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate scheme of work',
      },
      { status: 500 }
    );
  }
}
