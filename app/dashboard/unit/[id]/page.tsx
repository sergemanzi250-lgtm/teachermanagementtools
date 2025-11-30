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

interface UnitPlan {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  unitNumber: number;
  content: string;
  createdAt: string;
}

export default function ViewUnitPlanPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [unit, setUnit] = useState<UnitPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user?.id && id) {
      fetchUnit();
    }
  }, [user?.id, authLoading, router, id]);

  const fetchUnit = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const doc = await getDocument('unitPlans', id);
      if (!doc) {
        showErrorToast('Unit plan not found');
        router.push('/dashboard/unit-plans');
        return;
      }
      setUnit(doc as unknown as UnitPlan);
    } catch (error) {
      showErrorToast('Failed to load unit plan');
      console.error(error);
      router.push('/dashboard/unit-plans');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this unit plan?')) return;

    try {
      await deleteDocument('unitPlans', id);
      showSuccessToast('Unit plan deleted');
      router.push('/dashboard/unit-plans');
    } catch (error) {
      showErrorToast('Failed to delete unit plan');
    }
  };

  const handleExport = () => {
    if (unit) {
      const htmlContent = `
        <h1>${unit.title}</h1>
        <p><strong>Subject:</strong> ${unit.subject}</p>
        <p><strong>Grade Level:</strong> ${unit.gradeLevel}</p>
        <p><strong>Unit Number:</strong> ${unit.unitNumber}</p>
        <hr>
        <pre>${unit.content}</pre>
      `;
      exportToPDF(htmlContent, `${unit.title || 'unit-plan'}.pdf`);
      showSuccessToast('Unit plan exported as PDF');
    }
  };

  if (authLoading || loading) {
    return <LoadingOverlay isVisible={true} message="Loading unit plan..." />;
  }

  if (!unit) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard/unit-plans" className="text-2xl font-bold text-gray-900">
              ← Back to Unit Plans
            </Link>
            <h1 className="text-lg font-semibold text-gray-700">View Unit Plan</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{unit.title}</h1>
              <p className="text-gray-600">{unit.subject}</p>
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
              <p className="font-semibold text-gray-900">{unit.subject}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Grade</p>
              <p className="font-semibold text-gray-900">{unit.gradeLevel}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Unit #</p>
              <p className="font-semibold text-gray-900">{unit.unitNumber}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Created</p>
              <p className="font-semibold text-gray-900">{new Date(unit.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unit Details</h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {unit.content}
              </pre>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/dashboard/unit-plans">
              <Button variant="outline">Back to Unit Plans</Button>
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
