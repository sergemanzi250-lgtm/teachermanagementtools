'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { ActivitySchema, ActivityFormData } from '@/app/Lib/utils/validation';
import { ReusableForm } from '@/app/components/ReusableForm';
import { LoadingOverlay } from '@/app/components/Loading';
import { Button } from '@/app/components/UI';
import { showSuccessToast, showErrorToast } from '@/app/Lib/utils/toast';
import { exportToPDF } from '@/app/Lib/utils/pdf';
import Link from 'next/link';

export default function ActivityGeneratorPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedActivity, setGeneratedActivity] = useState<any>(null);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (data: ActivityFormData) => {
    if (!user?.id) {
      showErrorToast('User not authenticated');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate activity');
      }

      const result = await response.json();
      setGeneratedActivity(result.data);
      showSuccessToast('Activity generated successfully!');
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to generate activity');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (generatedActivity) {
      const htmlContent = `
        <h1>${generatedActivity.title}</h1>
        <p><strong>Type:</strong> ${generatedActivity.activityType}</p>
        <p><strong>Topic:</strong> ${generatedActivity.topic}</p>
        <p><strong>Age Group:</strong> ${generatedActivity.ageGroup}</p>
        <hr>
        <pre>${generatedActivity.content}</pre>
      `;
      exportToPDF(htmlContent, `${generatedActivity.title || 'activity'}.pdf`);
      showSuccessToast('Activity exported as PDF');
    }
  };

  if (authLoading) {
    return <LoadingOverlay isVisible={true} message="Loading..." />;
  }

  if (!user) {
    return null;
  }

  const formFields = {
    topic: { label: 'Activity Topic', required: true, placeholder: 'e.g., Photosynthesis' },
    ageGroup: { label: 'Age Group / Grade Level', required: true, placeholder: 'e.g., Grade 5' },
    activityType: { 
      label: 'Activity Type', 
      type: 'select' as const, 
      required: true,
      options: [
        { value: 'group', label: 'Group Activity' },
        { value: 'hands-on', label: 'Hands-On Activity' },
        { value: 'creative', label: 'Creative Activity' },
        { value: 'individual', label: 'Individual Activity' }
      ]
    },
    duration: { label: 'Duration (minutes)', type: 'number' as const, placeholder: '30' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
              ← Dashboard
            </Link>
            <h1 className="text-lg font-semibold text-gray-700">Activity Generator</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!generatedActivity ? (
          <ReusableForm
            schema={ActivitySchema}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            title="Create Activity"
            description="Generate an AI-powered classroom activity"
            fields={formFields}
            submitButtonText={isLoading ? 'Generating...' : 'Generate Activity'}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{generatedActivity.title}</h2>
              <Button variant="success" onClick={handleExport}>
                📥 Download PDF
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-semibold capitalize">{generatedActivity.activityType}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Topic</p>
                <p className="font-semibold">{generatedActivity.topic}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Age Group</p>
                <p className="font-semibold">{generatedActivity.ageGroup}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{generatedActivity.duration} min</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Generated Activity</h3>
              <div className="max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {generatedActivity.content}
                </pre>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="primary" onClick={() => setGeneratedActivity(null)}>
                Generate Another
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </main>

      <LoadingOverlay isVisible={isLoading} message="Generating activity..." />
    </div>
  );
}
