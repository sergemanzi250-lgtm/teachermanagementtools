import { NextRequest, NextResponse } from 'next/server';
import { generateQuizPrompt, validatePromptInput } from '@/app/Lib/utils/prompts';
import { generateWithGroq, parseJsonFromResponse } from '@/app/Lib/utils/groq';
import { saveQuizMongo } from '@/app/Lib/mongodb/mongodbAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, topic, numberOfQuestions, difficulty, questionTypes, className, learningObjectives, additionalNotes } = body;

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

    // Generate prompt using prompt system
    const prompt = generateQuizPrompt({
      topic,
      className: className || 'General',
      numberOfQuestions,
      difficulty,
      questionTypes,
      learningObjectives,
      additionalNotes,
    });

    const generatedContent = await generateWithGroq(prompt);
    const parsedContent = parseJsonFromResponse(generatedContent);

    const quizData = {
      topic,
      numberOfQuestions,
      difficulty,
      className: className || 'General',
      content: generatedContent,
      parsed: parsedContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docId = await saveQuizMongo(userId, quizData);

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
