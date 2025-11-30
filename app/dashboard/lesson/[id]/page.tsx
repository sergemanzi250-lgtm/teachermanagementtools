'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { LoadingOverlay } from '@/app/components/Loading';
import { Button } from '@/app/components/UI';
import { showErrorToast, showSuccessToast } from '@/app/Lib/utils/toast';
import { getLessonPlan, deleteLessonPlan } from '@/app/Lib/firebase/firestore';
import { exportLessonPlanToPDF } from '@/app/Lib/utils/pdf';

interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  className: string;
  format: string;
  content: string;
  createdAt: string;
  [key: string]: any;
}

export default function ViewLessonPlanPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user?.id && id) {
      fetchLessonPlan();
    }
  }, [user?.id, authLoading, router, id]);

  const fetchLessonPlan = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const plan = await getLessonPlan(id);
      setLessonPlan(plan as unknown as LessonPlan);
    } catch (error) {
      showErrorToast('Failed to load lesson plan');
      console.error(error);
      router.push('/dashboard/lessons');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lesson plan?')) return;

    try {
      await deleteLessonPlan(id);
      showSuccessToast('Lesson plan deleted');
      router.push('/dashboard/lessons');
    } catch (error) {
      showErrorToast('Failed to delete lesson plan');
    }
  };

  const handleExport = () => {
    if (lessonPlan) {
      exportLessonPlanToPDF(lessonPlan, `${lessonPlan.title || 'lesson-plan'}.pdf`);
      showSuccessToast('Lesson plan exported as PDF');
    }
  };

  if (authLoading || loading) {
    return <LoadingOverlay isVisible={true} message="Loading lesson plan..." />;
  }

  if (!lessonPlan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard/lessons" className="text-2xl font-bold text-gray-900">
              ← Back to Lessons
            </Link>
            <h1 className="text-lg font-semibold text-gray-700">View Lesson Plan</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{lessonPlan.title}</h1>
              <p className="text-gray-600">{lessonPlan.subject} • {lessonPlan.className}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="success" onClick={handleExport}>
                📥 Download PDF
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                🗑️ Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8 pb-8 border-b">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Subject</p>
              <p className="font-semibold text-gray-900">{lessonPlan.subject}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Class</p>
              <p className="font-semibold text-gray-900">{lessonPlan.className}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Format</p>
              <p className="font-semibold text-gray-900">{lessonPlan.format}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Created</p>
              <p className="font-semibold text-gray-900">{new Date(lessonPlan.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Content</h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {lessonPlan.content}
              </pre>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/dashboard/lessons">
              <Button variant="outline">Back to Lessons</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
