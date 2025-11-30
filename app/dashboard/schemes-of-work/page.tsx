'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { LoadingSpinner } from '@/app/components/Loading';
import { Button } from '@/app/components/UI';
import { showErrorToast } from '@/app/Lib/utils/toast';
import { useRouter } from 'next/navigation';

interface SchemeOfWork {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  term: string;
  numberOfWeeks: number;
  createdAt: string;
}

export default function SchemesOfWorkPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [schemes, setSchemes] = useState<SchemeOfWork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user?.id) {
      fetchSchemes();
    }
  }, [user?.id, authLoading, router]);

  const fetchSchemes = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { getUserSchemesOfWork } = await import('@/app/Lib/firebase/firestore');
      const data = await getUserSchemesOfWork(user.id);
      setSchemes(data as unknown as SchemeOfWork[]);
    } catch (error) {
      showErrorToast('Failed to load schemes of work');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner text="Loading schemes of work..." />
        </div>
      </DashboardLayout>
    );
  }

  const content = (
    <>
      <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Schemes of Work</h2>
            <p className="text-gray-600">Total: {schemes.length} schemes</p>
          </div>
          <Link href="/scheme-of-work-generator">
            <Button variant="primary">+ Create Scheme</Button>
          </Link>
        </div>

        {schemes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No schemes of work yet</p>
            <p className="text-gray-400 mb-6">Create your first scheme to get started</p>
            <Link href="/scheme-of-work-generator">
              <Button variant="primary">Create First Scheme</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {schemes.map(scheme => (
              <div
                key={scheme.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{scheme.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{scheme.subject}</p>
                
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
                    {scheme.term}
                  </span>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                    {scheme.gradeLevel}
                  </span>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {scheme.numberOfWeeks}w
                  </span>
                </div>

                <p className="text-gray-500 text-xs mb-4">
                  Created: {new Date(scheme.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2">
                  <Link href={`/dashboard/scheme/${scheme.id}`} className="flex-1">
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
