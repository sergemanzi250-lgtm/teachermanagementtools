/**
 * EXAMPLE: How to Implement Prompts in Your API Routes
 * This file shows implementation patterns for all document types
 * 
 * Copy and adapt these patterns for your actual API routes
 */

// ============================================================================
// EXAMPLE 1: REB LESSON PLAN GENERATION
// ============================================================================

/*
// File: app/api/generate-lesson-plan/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { generateRebLessonPlanPrompt, validatePromptInput } from '@/app/Lib/utils/prompts';
import { generateWithGroq } from '@/app/Lib/utils/groq';
import { saveLessonPlan } from '@/app/Lib/firebase/firestore';
import { RebLessonPlanInput } from '@/app/Lib/types/type';

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

    // Validate form input
    const validation = validatePromptInput(input);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Generate prompt using the system
    const prompt = generateRebLessonPlanPrompt(input as RebLessonPlanInput);

    // Call Groq API with enhanced prompt
    const generatedContent = await generateWithGroq(prompt);

    // Prepare data for Firestore
    const lessonPlanData = {
      format: 'REB',
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
          ...lessonPlanData,
        },
        message: 'REB lesson plan generated successfully',
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
*/

// ============================================================================
// EXAMPLE 2: RTB SESSION PLAN GENERATION
// ============================================================================

/*
// File: app/api/generate-session-plan/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { generateRtbSessionPlanPrompt, validatePromptInput } from '@/app/Lib/utils/prompts';
import { generateWithGroq } from '@/app/Lib/utils/groq';
import { saveSessionPlan } from '@/app/Lib/firebase/firestore';
import { RtbSessionPlanInput } from '@/app/Lib/types/type';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...input } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate input
    const validation = validatePromptInput(input);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Generate RTB-specific prompt
    const prompt = generateRtbSessionPlanPrompt(input as RtbSessionPlanInput);
    const generatedContent = await generateWithGroq(prompt);

    const sessionPlanData = {
      format: 'RTB',
      userId,
      content: generatedContent,
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docId = await saveSessionPlan(userId, sessionPlanData);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: docId,
          content: generatedContent,
          ...sessionPlanData,
        },
        message: 'RTB session plan generated successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error generating RTB session plan:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate session plan' },
      { status: 500 }
    );
  }
}
*/

// ============================================================================
// EXAMPLE 3: ACTIVITY GENERATION
// ============================================================================

/*
// File: app/api/generate-activity/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { generateActivityPrompt, enhancePromptWithRequirements } from '@/app/Lib/utils/prompts';
import { generateWithGroq } from '@/app/Lib/utils/groq';
import { saveActivity } from '@/app/Lib/firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, topic, className, activityType, duration, ...optionalFields } = body;

    if (!userId || !topic || !className || !activityType || !duration) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let prompt = generateActivityPrompt({
      topic,
      className,
      activityType,
      duration,
      ...optionalFields,
    });

    // Optionally enhance prompt for specific requirements
    if (optionalFields.inclusiveEducation) {
      prompt = enhancePromptWithRequirements(prompt, {
        emphasis: ['Include strategies for inclusive education', 'Differentiate for various learning needs'],
        mustInclude: ['Differentiation strategies', 'Adaptations for learners with disabilities'],
      });
    }

    const generatedContent = await generateWithGroq(prompt);

    const activityData = {
      userId,
      topic,
      className,
      activityType,
      duration,
      content: generatedContent,
      ...optionalFields,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docId = await saveActivity(userId, activityData);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: docId,
          content: generatedContent,
          ...activityData,
        },
        message: 'Activity generated successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error generating activity:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate activity' },
      { status: 500 }
    );
  }
}
*/

// ============================================================================
// EXAMPLE 4: QUIZ GENERATION
// ============================================================================

/*
// File: app/api/generate-quiz/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { generateQuizPrompt } from '@/app/Lib/utils/prompts';
import { generateWithGroq, parseJsonFromResponse } from '@/app/Lib/utils/groq';
import { saveQuiz } from '@/app/Lib/firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, topic, className, numberOfQuestions, difficulty, ...optionalFields } = body;

    if (!userId || !topic || !className || !numberOfQuestions || !difficulty) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = generateQuizPrompt({
      topic,
      className,
      numberOfQuestions,
      difficulty,
      ...optionalFields,
    });

    const generatedContent = await generateWithGroq(prompt);
    const parsedQuiz = parseJsonFromResponse(generatedContent);

    const quizData = {
      userId,
      topic,
      className,
      numberOfQuestions,
      difficulty,
      content: generatedContent,
      parsed: parsedQuiz,
      ...optionalFields,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docId = await saveQuiz(userId, quizData);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: docId,
          content: generatedContent,
          parsed: parsedQuiz,
          ...quizData,
        },
        message: 'Quiz generated successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}
*/

// ============================================================================
// EXAMPLE 5: RUBRIC GENERATION
// ============================================================================

/*
// File: app/api/generate-rubric/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { generateRubricPrompt } from '@/app/Lib/utils/prompts';
import { generateWithGroq, parseJsonFromResponse } from '@/app/Lib/utils/groq';
import { saveRubric } from '@/app/Lib/firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, assignmentName, className, skills, ...optionalFields } = body;

    if (!userId || !assignmentName || !className || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid required fields' },
        { status: 400 }
      );
    }

    const prompt = generateRubricPrompt({
      assignmentName,
      className,
      skills,
      ...optionalFields,
    });

    const generatedContent = await generateWithGroq(prompt);
    const parsedRubric = parseJsonFromResponse(generatedContent);

    const rubricData = {
      userId,
      assignmentName,
      className,
      skills,
      content: generatedContent,
      parsed: parsedRubric,
      ...optionalFields,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docId = await saveRubric(userId, rubricData);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: docId,
          content: generatedContent,
          parsed: parsedRubric,
          ...rubricData,
        },
        message: 'Rubric generated successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error generating rubric:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate rubric' },
      { status: 500 }
    );
  }
}
*/

// ============================================================================
// EXAMPLE 6: SCHEME OF WORK GENERATION
// ============================================================================

/*
// File: app/api/generate-scheme-of-work/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { generateSchemeOfWorkPrompt } from '@/app/Lib/utils/prompts';
import { generateWithGroq } from '@/app/Lib/utils/groq';
import { saveSchemeOfWork } from '@/app/Lib/firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subject, className, weeks, topics, ...optionalFields } = body;

    if (!userId || !subject || !className || !weeks || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid required fields' },
        { status: 400 }
      );
    }

    const prompt = generateSchemeOfWorkPrompt({
      subject,
      className,
      weeks,
      topics,
      ...optionalFields,
    });

    const generatedContent = await generateWithGroq(prompt);

    const schemeData = {
      userId,
      subject,
      className,
      weeks,
      topics,
      content: generatedContent,
      ...optionalFields,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docId = await saveSchemeOfWork(userId, schemeData);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: docId,
          content: generatedContent,
          ...schemeData,
        },
        message: 'Scheme of work generated successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error generating scheme of work:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate scheme of work' },
      { status: 500 }
    );
  }
}
*/

// ============================================================================
// REUSABLE PATTERNS & UTILITIES
// ============================================================================

/*
// Pattern 1: Error Handling Wrapper
const handleGenerationError = (error: unknown, operationType: string) => {
  console.error(`Error during ${operationType}:`, error);
  
  if (error instanceof Error) {
    if (error.message.includes('API')) {
      return { success: false, error: 'API service unavailable' };
    }
    if (error.message.includes('validation')) {
      return { success: false, error: 'Invalid input data' };
    }
  }
  
  return { success: false, error: `Failed to ${operationType}` };
};

// Pattern 2: Response formatter
const formatSuccessResponse = (data: any, message: string) => {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status: 201 }
  );
};

// Pattern 3: Input normalization
const normalizeFormInput = (input: any) => {
  return {
    ...input,
    // Trim all strings
    ...(Object.fromEntries(
      Object.entries(input).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    )),
  };
};

// Pattern 4: Conditional prompt enhancement
const enhancePromptIfNeeded = (
  basePrompt: string,
  flags: { inclusiveEducation?: boolean; complexTopic?: boolean; lowResource?: boolean }
) => {
  let prompt = basePrompt;

  if (flags.inclusiveEducation) {
    prompt = enhancePromptWithRequirements(prompt, {
      emphasis: ['Inclusive teaching strategies', 'Accessibility considerations'],
    });
  }

  if (flags.complexTopic) {
    prompt = enhancePromptWithRequirements(prompt, {
      emphasis: ['Break complex concepts into simple steps', 'Provide multiple explanations'],
    });
  }

  if (flags.lowResource) {
    prompt = enhancePromptWithRequirements(prompt, {
      emphasis: ['Use minimal/locally available resources', 'Simple classroom setup'],
      mustInclude: ['Affordable alternatives', 'No-cost options'],
    });
  }

  return prompt;
};
*/

// ============================================================================
// EXPORT FOR USE IN COMPONENTS
// ============================================================================

export const promptExamples = {
  reb: 'generateRebLessonPlanPrompt',
  rtb: 'generateRtbSessionPlanPrompt',
  nursery: 'generateNurseryLessonPlanPrompt',
  activity: 'generateActivityPrompt',
  quiz: 'generateQuizPrompt',
  rubric: 'generateRubricPrompt',
  scheme: 'generateSchemeOfWorkPrompt',
};

export const importInstructions = `
To use these prompts in your API routes:

1. Import the prompt generators:
   import { generateRebLessonPlanPrompt, generateRtbSessionPlanPrompt, ... } from '@/app/Lib/utils/prompts';

2. Import Groq utilities:
   import { generateWithGroq, parseJsonFromResponse } from '@/app/Lib/utils/groq';

3. Import Firebase utilities:
   import { saveLessonPlan, saveActivity, ... } from '@/app/Lib/firebase/firestore';

4. Follow the pattern in examples above for your specific API route

5. Test with sample form data to ensure proper integration
`;
