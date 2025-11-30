'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { RubricSchema, RubricFormData } from '@/app/Lib/utils/validation';
import { ReusableForm } from '@/app/components/ReusableForm';
import { LoadingOverlay } from '@/app/components/Loading';
import { Button } from '@/app/components/UI';
import { showSuccessToast, showErrorToast } from '@/app/Lib/utils/toast';
import { exportToPDF } from '@/app/Lib/utils/pdf';
import Link from 'next/link';

export default function RubricGeneratorPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRubric, setGeneratedRubric] = useState<any>(null);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (data: RubricFormData) => {
    if (!user?.id) {
      showErrorToast('User not authenticated');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-rubric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate rubric');
      }

      const result = await response.json();
      setGeneratedRubric(result.data);
      showSuccessToast('Rubric generated successfully!');
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to generate rubric');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (generatedRubric) {
      const htmlContent = `
        <h1>${generatedRubric.title}</h1>
        <p><strong>Assignment:</strong> ${generatedRubric.assignment}</p>
        <p><strong>Criteria:</strong> ${generatedRubric.criteria}</p>
        <hr>
        <pre>${generatedRubric.content}</pre>
      `;
      exportToPDF(htmlContent, `${generatedRubric.title || 'rubric'}.pdf`);
      showSuccessToast('Rubric exported as PDF');
    }
  };

  if (authLoading) {
    return <LoadingOverlay isVisible={true} message="Loading..." />;
  }

  if (!user) {
    return null;
  }

  const formFields = {
    assignmentDescription: { label: 'Assignment Description', type: 'textarea' as const, required: true, placeholder: 'Describe the assignment' },
    skills: { label: 'Skills to Assess', type: 'textarea' as const, required: true, placeholder: 'List skills separated by commas' },
    performanceLevels: { label: 'Number of Performance Levels (3-6)', type: 'number' as const, placeholder: '4' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
              ← Dashboard
            </Link>
            <h1 className="text-lg font-semibold text-gray-700">Rubric Generator</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!generatedRubric ? (
          <ReusableForm
            schema={RubricSchema}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            title="Create Rubric"
            description="Generate an AI-powered assessment rubric"
            fields={formFields}
            submitButtonText={isLoading ? 'Generating...' : 'Generate Rubric'}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{generatedRubric.title}</h2>
              <Button variant="success" onClick={handleExport}>
                📥 Download PDF
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Assignment</p>
                <p className="font-semibold">{generatedRubric.assignment}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Grade Level</p>
                <p className="font-semibold">{generatedRubric.gradeLevel || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Generated Rubric</h3>
              <div className="max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {generatedRubric.content}
                </pre>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="primary" onClick={() => setGeneratedRubric(null)}>
                Generate Another
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </main>

      <LoadingOverlay isVisible={isLoading} message="Generating rubric..." />
    </div>
  );
}
