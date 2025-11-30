import { NextRequest, NextResponse } from 'next/server';
import { generateSchemeOfWork, parseJsonFromResponse } from '@/app/Lib/utils/groq';
import { saveSchemeOfWork } from '@/app/Lib/firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subject, grade, weeks, topics } = body;

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

    const generatedContent = await generateSchemeOfWork({
      subject,
      grade,
      weeks,
      topics,
    });

    const parsedContent = parseJsonFromResponse(generatedContent);

    const schemeData = {
      subject,
      grade,
      weeks,
      topics,
      content: generatedContent,
      parsed: parsedContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docId = await saveSchemeOfWork(userId, schemeData);

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
