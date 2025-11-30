'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { UnitPlanSchema, UnitPlanFormData } from '@/app/Lib/utils/validation';
import { ReusableForm } from '@/app/components/ReusableForm';
import { LoadingOverlay } from '@/app/components/Loading';
import { Button } from '@/app/components/UI';
import { showSuccessToast, showErrorToast } from '@/app/Lib/utils/toast';
import { exportToPDF } from '@/app/Lib/utils/pdf';
import Link from 'next/link';

export default function UnitPlanGeneratorPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedUnit, setGeneratedUnit] = useState<any>(null);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (data: UnitPlanFormData) => {
    if (!user?.id) {
      showErrorToast('User not authenticated');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/unit-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate unit plan');
      }

      const result = await response.json();
      setGeneratedUnit(result.data);
      showSuccessToast('Unit plan generated successfully!');
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to generate unit plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (generatedUnit) {
      const htmlContent = `
        <h1>${generatedUnit.title}</h1>
        <p><strong>Subject:</strong> ${generatedUnit.subject}</p>
        <p><strong>Grade Level:</strong> ${generatedUnit.gradeLevel}</p>
        <p><strong>Unit Number:</strong> ${generatedUnit.unitNumber}</p>
        <hr>
        <pre>${generatedUnit.content}</pre>
      `;
      exportToPDF(htmlContent, `${generatedUnit.title || 'unit-plan'}.pdf`);
      showSuccessToast('Unit plan exported as PDF');
    }
  };

  if (authLoading || !user) {
    return null;
  }

  const formFields = {
    title: { label: 'Unit Title', required: true, placeholder: 'e.g., Nouns and Verbs' },
    duration: { label: 'Duration (in weeks)', type: 'number' as const, required: true, placeholder: '4' },
    competencies: { label: 'Competencies', type: 'textarea' as const, required: true, placeholder: 'List the competencies to develop' },
    content: { label: 'Content Overview (optional)', type: 'textarea' as const, placeholder: 'Overview of the unit content' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
              ← Dashboard
            </Link>
            <h1 className="text-lg font-semibold text-gray-700">Unit Plan Generator</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!generatedUnit ? (
          <ReusableForm
            schema={UnitPlanSchema}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            title="Create Unit Plan"
            description="Generate an AI-powered unit plan for your subject"
            fields={formFields}
            submitButtonText={isLoading ? 'Generating...' : 'Generate Unit Plan'}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{generatedUnit.title}</h2>
              <Button variant="success" onClick={handleExport}>
                📥 Download PDF
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Subject</p>
                <p className="font-semibold">{generatedUnit.subject}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Grade</p>
                <p className="font-semibold">{generatedUnit.gradeLevel}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Unit #</p>
                <p className="font-semibold">{generatedUnit.unitNumber}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold">Generated</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Generated Unit Plan</h3>
              <div className="max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {generatedUnit.content}
                </pre>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="primary" onClick={() => setGeneratedUnit(null)}>
                Generate Another
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </main>

      <LoadingOverlay isVisible={isLoading} message="Generating unit plan..." />
    </div>
  );
}
