'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { QuizSchema, QuizFormData } from '@/app/Lib/utils/validation';
import { ReusableForm } from '@/app/components/ReusableForm';
import { LoadingOverlay } from '@/app/components/Loading';
import { Button } from '@/app/components/UI';
import { showSuccessToast, showErrorToast } from '@/app/Lib/utils/toast';
import { exportToPDF } from '@/app/Lib/utils/pdf';
import Link from 'next/link';

export default function QuizGeneratorPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (data: QuizFormData) => {
    if (!user?.id) {
      showErrorToast('User not authenticated');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate quiz');
      }

      const result = await response.json();
      setGeneratedQuiz(result.data);
      showSuccessToast('Quiz generated successfully!');
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to generate quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (generatedQuiz) {
      const htmlContent = `
        <h1>${generatedQuiz.title}</h1>
        <p><strong>Topic:</strong> ${generatedQuiz.topic}</p>
        <p><strong>Difficulty:</strong> ${generatedQuiz.difficulty}</p>
        <p><strong>Number of Questions:</strong> ${generatedQuiz.numberOfQuestions}</p>
        <hr>
        <pre>${generatedQuiz.content}</pre>
      `;
      exportToPDF(htmlContent, `${generatedQuiz.title || 'quiz'}.pdf`);
      showSuccessToast('Quiz exported as PDF');
    }
  };

  if (authLoading) {
    return <LoadingOverlay isVisible={true} message="Loading..." />;
  }

  if (!user) {
    return null;
  }

  const formFields = {
    topic: { label: 'Quiz Topic', required: true, placeholder: 'e.g., Photosynthesis' },
    numberOfQuestions: { label: 'Number of Questions', type: 'number' as const, required: true, placeholder: '10' },
    difficulty: { 
      label: 'Difficulty Level', 
      type: 'select' as const, 
      required: true,
      options: [
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' }
      ]
    },
    questionTypes: { label: 'Question Types', type: 'textarea' as const, placeholder: 'e.g., Multiple choice, True/False' },
    targetAudience: { label: 'Target Audience', placeholder: 'e.g., P4 Students' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
              ← Dashboard
            </Link>
            <h1 className="text-lg font-semibold text-gray-700">Quiz Generator</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!generatedQuiz ? (
          <ReusableForm
            schema={QuizSchema}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            title="Create Quiz"
            description="Generate an AI-powered quiz on any topic"
            fields={formFields}
            submitButtonText={isLoading ? 'Generating...' : 'Generate Quiz'}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{generatedQuiz.title}</h2>
              <Button variant="success" onClick={handleExport}>
                📥 Download PDF
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Topic</p>
                <p className="font-semibold">{generatedQuiz.topic}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Difficulty</p>
                <p className="font-semibold capitalize">{generatedQuiz.difficulty}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Questions</p>
                <p className="font-semibold">{generatedQuiz.numberOfQuestions}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Generated Quiz</h3>
              <div className="max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {generatedQuiz.content}
                </pre>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="primary" onClick={() => setGeneratedQuiz(null)}>
                Generate Another
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </main>

      <LoadingOverlay isVisible={isLoading} message="Generating quiz..." />
    </div>
  );
}
