'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { LoadingOverlay } from '@/app/components/Loading';
import { Button } from '@/app/components/UI';
import { showErrorToast, showSuccessToast } from '@/app/Lib/utils/toast';
import { getDocument, deleteDocument } from '@/app/Lib/firebase/firestore';
import { exportToPDF } from '@/app/Lib/utils/pdf';

interface Activity {
  id: string;
  title: string;
  subject: string;
  activityType: string;
  gradeLevel: string;
  duration: number;
  content: string;
  createdAt: string;
}

export default function ViewActivityPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user?.id && id) {
      fetchActivity();
    }
  }, [user?.id, authLoading, router, id]);

  const fetchActivity = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const doc = await getDocument('activities', id);
      if (!doc) {
        showErrorToast('Activity not found');
        router.push('/dashboard/activities');
        return;
      }
      setActivity(doc as unknown as Activity);
    } catch (error) {
      showErrorToast('Failed to load activity');
      console.error(error);
      router.push('/dashboard/activities');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
      await deleteDocument('activities', id);
      showSuccessToast('Activity deleted');
      router.push('/dashboard/activities');
    } catch (error) {
      showErrorToast('Failed to delete activity');
    }
  };

  const handleExport = () => {
    if (activity) {
      const htmlContent = `
        <h1>${activity.title}</h1>
        <p><strong>Subject:</strong> ${activity.subject}</p>
        <p><strong>Type:</strong> ${activity.activityType}</p>
        <p><strong>Grade Level:</strong> ${activity.gradeLevel}</p>
        <p><strong>Duration:</strong> ${activity.duration} minutes</p>
        <hr>
        <pre>${activity.content}</pre>
      `;
      exportToPDF(htmlContent, `${activity.title || 'activity'}.pdf`);
      showSuccessToast('Activity exported as PDF');
    }
  };

  if (authLoading || loading) {
    return <LoadingOverlay isVisible={true} message="Loading activity..." />;
  }

  if (!activity) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard/activities" className="text-2xl font-bold text-gray-900">
              ← Back to Activities
            </Link>
            <h1 className="text-lg font-semibold text-gray-700">View Activity</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{activity.title}</h1>
              <p className="text-gray-600">{activity.subject}</p>
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
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-semibold text-gray-900 capitalize">{activity.activityType}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Subject</p>
              <p className="font-semibold text-gray-900">{activity.subject}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Grade</p>
              <p className="font-semibold text-gray-900">{activity.gradeLevel}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-semibold text-gray-900">{activity.duration} min</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Activity Details</h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {activity.content}
              </pre>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/dashboard/activities">
              <Button variant="outline">Back to Activities</Button>
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
