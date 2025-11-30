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

interface Quiz {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  numberOfQuestions: number;
  content: string;
  createdAt: string;
}

export default function ViewQuizPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user?.id && id) {
      fetchQuiz();
    }
  }, [user?.id, authLoading, router, id]);

  const fetchQuiz = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const doc = await getDocument('quizzes', id);
      if (!doc) {
        showErrorToast('Quiz not found');
        router.push('/dashboard/quizzes');
        return;
      }
      setQuiz(doc as unknown as Quiz);
    } catch (error) {
      showErrorToast('Failed to load quiz');
      console.error(error);
      router.push('/dashboard/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    try {
      await deleteDocument('quizzes', id);
      showSuccessToast('Quiz deleted');
      router.push('/dashboard/quizzes');
    } catch (error) {
      showErrorToast('Failed to delete quiz');
    }
  };

  const handleExport = () => {
    if (quiz) {
      const htmlContent = `
        <h1>${quiz.title}</h1>
        <p><strong>Topic:</strong> ${quiz.topic}</p>
        <p><strong>Difficulty:</strong> ${quiz.difficulty}</p>
        <p><strong>Number of Questions:</strong> ${quiz.numberOfQuestions}</p>
        <hr>
        <pre>${quiz.content}</pre>
      `;
      exportToPDF(htmlContent, `${quiz.title || 'quiz'}.pdf`);
      showSuccessToast('Quiz exported as PDF');
    }
  };

  if (authLoading || loading) {
    return <LoadingOverlay isVisible={true} message="Loading quiz..." />;
  }

  if (!quiz) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard/quizzes" className="text-2xl font-bold text-gray-900">
              ← Back to Quizzes
            </Link>
            <h1 className="text-lg font-semibold text-gray-700">View Quiz</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
              <p className="text-gray-600">{quiz.topic}</p>
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
              <p className="text-sm text-gray-600">Topic</p>
              <p className="font-semibold text-gray-900">{quiz.topic}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Difficulty</p>
              <p className="font-semibold text-gray-900 capitalize">{quiz.difficulty}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Questions</p>
              <p className="font-semibold text-gray-900">{quiz.numberOfQuestions}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Created</p>
              <p className="font-semibold text-gray-900">{new Date(quiz.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions</h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {quiz.content}
              </pre>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/dashboard/quizzes">
              <Button variant="outline">Back to Quizzes</Button>
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
