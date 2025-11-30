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

interface SchemeOfWork {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  term: string;
  numberOfWeeks: number;
  content: string;
  createdAt: string;
}

export default function ViewSchemeOfWorkPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [scheme, setScheme] = useState<SchemeOfWork | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user?.id && id) {
      fetchScheme();
    }
  }, [user?.id, authLoading, router, id]);

  const fetchScheme = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const doc = await getDocument('schemesOfWork', id);
      if (!doc) {
        showErrorToast('Scheme of work not found');
        router.push('/dashboard/schemes-of-work');
        return;
      }
      setScheme(doc as unknown as SchemeOfWork);
    } catch (error) {
      showErrorToast('Failed to load scheme of work');
      console.error(error);
      router.push('/dashboard/schemes-of-work');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this scheme of work?')) return;

    try {
      await deleteDocument('schemesOfWork', id);
      showSuccessToast('Scheme of work deleted');
      router.push('/dashboard/schemes-of-work');
    } catch (error) {
      showErrorToast('Failed to delete scheme of work');
    }
  };

  const handleExport = () => {
    if (scheme) {
      const htmlContent = `
        <h1>${scheme.title}</h1>
        <p><strong>Subject:</strong> ${scheme.subject}</p>
        <p><strong>Grade Level:</strong> ${scheme.gradeLevel}</p>
        <p><strong>Term:</strong> ${scheme.term}</p>
        <p><strong>Number of Weeks:</strong> ${scheme.numberOfWeeks}</p>
        <hr>
        <pre>${scheme.content}</pre>
      `;
      exportToPDF(htmlContent, `${scheme.title || 'scheme-of-work'}.pdf`);
      showSuccessToast('Scheme of work exported as PDF');
    }
  };

  if (authLoading || loading) {
    return <LoadingOverlay isVisible={true} message="Loading scheme of work..." />;
  }

  if (!scheme) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard/schemes-of-work" className="text-2xl font-bold text-gray-900">
              ← Back to Schemes
            </Link>
            <h1 className="text-lg font-semibold text-gray-700">View Scheme of Work</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{scheme.title}</h1>
              <p className="text-gray-600">{scheme.subject}</p>
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
              <p className="font-semibold text-gray-900">{scheme.subject}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Grade</p>
              <p className="font-semibold text-gray-900">{scheme.gradeLevel}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Term</p>
              <p className="font-semibold text-gray-900">{scheme.term}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Weeks</p>
              <p className="font-semibold text-gray-900">{scheme.numberOfWeeks}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Scheme Details</h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {scheme.content}
              </pre>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/dashboard/schemes-of-work">
              <Button variant="outline">Back to Schemes</Button>
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
