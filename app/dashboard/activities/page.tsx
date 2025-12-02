'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { LoadingSpinner } from '@/app/components/Loading';
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
      const response = await fetch(`/api/get-activities?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        // Transform the data to match expected format
        const transformedActivities = data.data.map((activity: any) => ({
          id: activity.id,
          title: activity.title || activity.activityTitle || 'Untitled Activity',
          subject: activity.subject || 'No subject',
          activityType: activity.activityType || activity.type || 'General',
          gradeLevel: activity.gradeLevel || activity.className || 'No grade',
          duration: activity.duration || activity.timeAllocation || 30,
          createdAt: activity.createdAt,
        }));
        setActivities(transformedActivities as Activity[]);
      } else {
        throw new Error(data.error || 'Failed to fetch activities');
      }
    } catch (error) {
      showErrorToast('Failed to load activities');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner text="Loading activities..." />
        </div>
      </DashboardLayout>
    );
  }

  const content = (
    <>
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
    </>
  );

  return (
    <DashboardLayout>
      {content}
    </DashboardLayout>
  );
}
