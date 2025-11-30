'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { LoadingOverlay } from '@/app/components/Loading';
import { Button } from '@/app/components/UI';
import { showErrorToast } from '@/app/Lib/utils/toast';
import { getUserRubrics } from '@/app/Lib/firebase/firestore';
import { useRouter } from 'next/navigation';

interface Rubric {
  id: string;
  title: string;
  assignment: string;
  criteria: string;
  createdAt: string;
}

export default function RubricsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user?.id) {
      fetchRubrics();
    }
  }, [user?.id, authLoading, router]);

  const fetchRubrics = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await getUserRubrics(user.id);
      setRubrics(data as unknown as Rubric[]);
    } catch (error) {
      showErrorToast('Failed to load rubrics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingOverlay isVisible={true} message="Loading rubrics..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
              ← Dashboard
            </Link>
            <h1 className="text-lg font-semibold text-gray-700">Rubrics</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Rubrics</h2>
            <p className="text-gray-600">Total: {rubrics.length} rubrics</p>
          </div>
          <Link href="/rubric-generator">
            <Button variant="primary">+ Create Rubric</Button>
          </Link>
        </div>

        {rubrics.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No rubrics yet</p>
            <p className="text-gray-400 mb-6">Create your first rubric to get started</p>
            <Link href="/rubric-generator">
              <Button variant="primary">Create First Rubric</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rubrics.map(rubric => (
              <div
                key={rubric.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{rubric.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{rubric.assignment}</p>
                
                <div className="mb-4">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                    Assessment Rubric
                  </span>
                </div>

                <p className="text-gray-500 text-xs mb-4">
                  Created: {new Date(rubric.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2">
                  <Link href={`/dashboard/rubric/${rubric.id}`} className="flex-1">
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
