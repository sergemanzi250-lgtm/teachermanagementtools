'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { LoadingOverlay } from '@/app/components/Loading';
import { Button } from '@/app/components/UI';
import { showErrorToast } from '@/app/Lib/utils/toast';
import { useRouter } from 'next/navigation';

interface Activity {
  id: string;
  title: string;
  subject: string;
  activityType: string;
  gradeLevel: string;
  duration: number;
  createdAt: string;
}

export default function ActivitiesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user?.id) {
      fetchActivities();
    }
  }, [user?.id, authLoading, router]);

  const fetchActivities = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { getUserActivities } = await import('@/app/Lib/firebase/firestore');
      const data = await getUserActivities(user.id);
      setActivities(data as unknown as Activity[]);
    } catch (error) {
      showErrorToast('Failed to load activities');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingOverlay isVisible={true} message="Loading activities..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
              ← Dashboard
            </Link>
            <h1 className="text-lg font-semibold text-gray-700">Activities</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Activities</h2>
            <p className="text-gray-600">Total: {activities.length} activities</p>
          </div>
          <Link href="/activity-generator">
            <Button variant="primary">+ Create Activity</Button>
          </Link>
        </div>

        {activities.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No activities yet</p>
            <p className="text-gray-400 mb-6">Create your first activity to get started</p>
            <Link href="/activity-generator">
              <Button variant="primary">Create First Activity</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.map(activity => (
              <div
                key={activity.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{activity.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{activity.subject}</p>
                
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded capitalize">
                    {activity.activityType}
                  </span>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                    {activity.gradeLevel}
                  </span>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {activity.duration}m
                  </span>
                </div>

                <p className="text-gray-500 text-xs mb-4">
                  Created: {new Date(activity.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2">
                  <Link href={`/dashboard/activity/${activity.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">View</Button>
                  </Link>
                  <button
                    onClick={() => showErrorToast('Delete coming soon')}
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
