'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { LoadingOverlay, Skeleton } from '@/app/components/Loading';
import { Button } from '@/app/components/UI';
import { showErrorToast } from '@/app/Lib/utils/toast';
import { getUserLessonPlans } from '@/app/Lib/firebase/firestore';
import { useRouter } from 'next/navigation';

interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  className: string;
  format: string;
  createdAt: string;
}

export default function LessonPlansPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user?.id) {
      fetchLessonPlans();
    }
  }, [user?.id, authLoading, router]);

  const fetchLessonPlans = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const plans = await getUserLessonPlans(user.id);
      setLessonPlans(plans as unknown as LessonPlan[]);
    } catch (error) {
      showErrorToast('Failed to load lesson plans');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingOverlay isVisible={true} message="Loading lesson plans..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
              ← Dashboard
            </Link>
            <h1 className="text-lg font-semibold text-gray-700">Lesson Plans</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Lesson Plans</h2>
            <p className="text-gray-600">Total: {lessonPlans.length} lesson plans</p>
          </div>
          <div className="flex gap-3">
            <Link href="/reb-lesson-plan">
              <Button variant="primary">+ REB Plan</Button>
            </Link>
            <Link href="/rtb-session-plan">
              <Button variant="primary">+ RTB Plan</Button>
            </Link>
            <Link href="/nursery-lesson-plan">
              <Button variant="primary">+ Nursery Plan</Button>
            </Link>
          </div>
        </div>

        {lessonPlans.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No lesson plans yet</p>
            <p className="text-gray-400 mb-6">Create your first lesson plan to get started</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/reb-lesson-plan">
                <Button variant="primary">Create REB Plan</Button>
              </Link>
              <Link href="/rtb-session-plan">
                <Button variant="primary">Create RTB Plan</Button>
              </Link>
              <Link href="/nursery-lesson-plan">
                <Button variant="primary">Create Nursery Plan</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lessonPlans.map(plan => (
              <div
                key={plan.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.subject}</p>
                
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {plan.format}
                  </span>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                    {plan.className}
                  </span>
                </div>

                <p className="text-gray-500 text-xs mb-4">
                  Created: {new Date(plan.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2">
                  <Link href={`/dashboard/lesson/${plan.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">View</Button>
                  </Link>
                  <button
                    onClick={() => {
                      // Implement delete later
                      showErrorToast('Delete coming soon');
                    }}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
