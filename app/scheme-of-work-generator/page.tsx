'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { SchemeOfWorkSchema, SchemeOfWorkFormData } from '@/app/Lib/utils/validation';
import { ReusableForm } from '@/app/components/ReusableForm';
import { LoadingOverlay } from '@/app/components/Loading';
import { Button } from '@/app/components/UI';
import { showSuccessToast, showErrorToast } from '@/app/Lib/utils/toast';
import { exportToPDF } from '@/app/Lib/utils/pdf';
import Link from 'next/link';

export default function SchemeOfWorkGeneratorPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedScheme, setGeneratedScheme] = useState<any>(null);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (data: SchemeOfWorkFormData) => {
    if (!user?.id) {
      showErrorToast('User not authenticated');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-scheme-of-work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate scheme of work');
      }

      const result = await response.json();
      setGeneratedScheme(result.data);
      showSuccessToast('Scheme of work generated successfully!');
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to generate scheme of work');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (generatedScheme) {
      const htmlContent = `
        <h1>${generatedScheme.title}</h1>
        <p><strong>Subject:</strong> ${generatedScheme.subject}</p>
        <p><strong>Grade Level:</strong> ${generatedScheme.gradeLevel}</p>
        <p><strong>Term:</strong> ${generatedScheme.term}</p>
        <hr>
        <pre>${generatedScheme.content}</pre>
      `;
      exportToPDF(htmlContent, `${generatedScheme.title || 'scheme-of-work'}.pdf`);
      showSuccessToast('Scheme of work exported as PDF');
    }
  };

  if (authLoading) {
    return <LoadingOverlay isVisible={true} message="Loading..." />;
  }

  if (!user) {
    return null;
  }

  const formFields = {
    subject: { label: 'Subject', required: true, placeholder: 'e.g., Mathematics' },
    grade: { label: 'Grade/Level', required: true, placeholder: 'e.g., Grade 6' },
    weeks: { label: 'Number of Weeks', type: 'number' as const, required: true, placeholder: '12' },
    topics: { label: 'Topics to Include', type: 'textarea' as const, required: true, placeholder: 'List topics separated by commas' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
              ← Dashboard
            </Link>
            <h1 className="text-lg font-semibold text-gray-700">Scheme of Work Generator</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!generatedScheme ? (
          <ReusableForm
            schema={SchemeOfWorkSchema}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            title="Create Scheme of Work"
            description="Generate an AI-powered curriculum plan"
            fields={formFields}
            submitButtonText={isLoading ? 'Generating...' : 'Generate Scheme of Work'}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{generatedScheme.title}</h2>
              <Button variant="success" onClick={handleExport}>
                📥 Download PDF
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Subject</p>
                <p className="font-semibold">{generatedScheme.subject}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Grade</p>
                <p className="font-semibold">{generatedScheme.gradeLevel}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Term</p>
                <p className="font-semibold">{generatedScheme.term}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Weeks</p>
                <p className="font-semibold">{generatedScheme.numberOfWeeks}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Generated Scheme of Work</h3>
              <div className="max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {generatedScheme.content}
                </pre>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="primary" onClick={() => setGeneratedScheme(null)}>
                Generate Another
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </main>

      <LoadingOverlay isVisible={isLoading} message="Generating scheme of work..." />
    </div>
  );
}
