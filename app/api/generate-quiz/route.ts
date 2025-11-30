import { NextRequest, NextResponse } from 'next/server';
import { generateQuiz, parseJsonFromResponse } from '@/app/Lib/utils/groq';
import { saveQuiz } from '@/app/Lib/firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, topic, numberOfQuestions, difficulty, questionTypes } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!topic || !numberOfQuestions || !difficulty) {
      return NextResponse.json(
        { success: false, error: 'Topic, numberOfQuestions, and difficulty are required' },
        { status: 400 }
      );
    }

    const generatedContent = await generateQuiz({
      topic,
      numberOfQuestions,
      difficulty,
      questionTypes,
    });

    const parsedContent = parseJsonFromResponse(generatedContent);

    const quizData = {
      topic,
      numberOfQuestions,
      difficulty,
      content: generatedContent,
      parsed: parsedContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docId = await saveQuiz(userId, quizData);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: docId,
          ...quizData,
        },
        message: 'Quiz generated successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in generate-quiz route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate quiz',
      },
      { status: 500 }
    );
  }
}
