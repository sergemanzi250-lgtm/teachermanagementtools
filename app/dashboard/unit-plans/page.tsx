'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { LoadingSpinner } from '@/app/components/Loading';
import { Button } from '@/app/components/UI';
import { showErrorToast } from '@/app/Lib/utils/toast';
import { useRouter } from 'next/navigation';

interface UnitPlan {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  unitNumber: number;
  createdAt: string;
}

export default function UnitPlansPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [units, setUnits] = useState<UnitPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user?.id) {
      fetchUnitPlans();
    }
  }, [user?.id, authLoading, router]);

  const fetchUnitPlans = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { getUserUnitPlans } = await import('@/app/Lib/firebase/firestore');
      const data = await getUserUnitPlans(user.id);
      setUnits(data as unknown as UnitPlan[]);
    } catch (error) {
      showErrorToast('Failed to load unit plans');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner text="Loading unit plans..." />
        </div>
      </DashboardLayout>
    );
  }

  const content = (
    <>
      <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Unit Plans</h2>
            <p className="text-gray-600">Total: {units.length} unit plans</p>
          </div>
          <Link href="/unit-plan-generator">
            <Button variant="primary">+ Create Unit Plan</Button>
          </Link>
        </div>

        {units.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No unit plans yet</p>
            <p className="text-gray-400 mb-6">Create your first unit plan to get started</p>
            <Link href="/unit-plan-generator">
              <Button variant="primary">Create First Unit Plan</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {units.map(unit => (
              <div
                key={unit.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{unit.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{unit.subject}</p>
                
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-teal-100 text-teal-800 rounded">
                    Unit {unit.unitNumber}
                  </span>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                    {unit.gradeLevel}
                  </span>
                </div>

                <p className="text-gray-500 text-xs mb-4">
                  Created: {new Date(unit.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2">
                  <Link href={`/dashboard/unit/${unit.id}`} className="flex-1">
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
