import { NextRequest, NextResponse } from 'next/server';
import { generateWithGroq, parseJsonFromResponse } from '@/app/Lib/utils/groq';
import { saveUnitPlanMongo, updateDocumentMongo, deleteDocumentMongo, getDocumentMongo, getUserDocumentsMongo, COLLECTIONS } from '@/app/Lib/mongodb/mongodbAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, duration, competencies, content } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!title || !duration || !competencies) {
      return NextResponse.json(
        { success: false, error: 'title, duration, and competencies are required' },
        { status: 400 }
      );
    }

    // Generate AI content for unit plan
    const prompt = `Create a comprehensive unit plan with the following specifications:

Title: ${title}
Duration: ${duration} weeks
Competencies to Develop: ${competencies}
${content ? `Content Overview: ${content}` : ''}

Please generate a detailed unit plan that includes:
1. Unit Overview
2. Learning Objectives aligned with the competencies
3. Weekly Breakdown (${duration} weeks)
4. Assessment Methods
5. Resources Needed
6. Learning Activities
7. Differentiation Strategies for different learner needs
8. Cross-Cutting Issues Integration (Gender, Inclusion, Environment, etc.)
9. Teacher Guidance Notes

Ensure the unit plan is practical, implementable, and aligned with Rwanda's education standards.`;

    const generatedContent = await generateWithGroq(prompt);
    const parsedContent = parseJsonFromResponse(generatedContent);

    const unitPlanData = {
      title,
      duration,
      competencies,
      content: generatedContent,
      parsed: parsedContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docId = await saveUnitPlanMongo(userId, unitPlanData);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: docId,
          ...unitPlanData,
        },
        message: 'Unit plan generated successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in unit-plan route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate unit plan',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const planId = searchParams.get('planId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (planId) {
      // Get specific plan
      const plan = await getDocumentMongo(COLLECTIONS.UNIT_PLANS, planId);
      return NextResponse.json(
        {
          success: true,
          data: plan,
        },
        { status: 200 }
      );
    }

    // Get all plans for user
    const plans = await getUserDocumentsMongo(COLLECTIONS.UNIT_PLANS, userId);
    return NextResponse.json(
      {
        success: true,
        data: plans,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET unit-plan route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch unit plans',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, ...updates } = body;

    if (!planId) {
      return NextResponse.json(
        { success: false, error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    await updateDocumentMongo(COLLECTIONS.UNIT_PLANS, planId, updates);

    return NextResponse.json(
      {
        success: true,
        message: 'Unit plan updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PATCH unit-plan route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update unit plan',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const planId = searchParams.get('planId');

    if (!planId) {
      return NextResponse.json(
        { success: false, error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    await deleteDocumentMongo(COLLECTIONS.UNIT_PLANS, planId);

    return NextResponse.json(
      {
        success: true,
        message: 'Unit plan deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE unit-plan route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete unit plan',
      },
      { status: 500 }
    );
  }
}
