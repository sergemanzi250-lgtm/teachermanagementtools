import { NextRequest, NextResponse } from 'next/server';
import { saveUnitPlan, updateDocument, deleteDocument, getDocument, getUserDocuments, COLLECTIONS } from '@/app/Lib/firebase/firestore';

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

    const unitPlanData = {
      title,
      duration,
      competencies,
      content: content || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docId = await saveUnitPlan(userId, unitPlanData);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: docId,
          ...unitPlanData,
        },
        message: 'Unit plan saved successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in save-unit-plan route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save unit plan',
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
      const plan = await getDocument(COLLECTIONS.UNIT_PLANS, planId);
      return NextResponse.json(
        {
          success: true,
          data: plan,
        },
        { status: 200 }
      );
    }

    // Get all plans for user
    const plans = await getUserDocuments(COLLECTIONS.UNIT_PLANS, userId);
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

    await updateDocument(COLLECTIONS.UNIT_PLANS, planId, updates);

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

    await deleteDocument(COLLECTIONS.UNIT_PLANS, planId);

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
