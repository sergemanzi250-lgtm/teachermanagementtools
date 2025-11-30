'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { LoadingOverlay } from '@/app/components/Loading';
import { Button } from '@/app/components/UI';
import { showErrorToast } from '@/app/Lib/utils/toast';
import { getUserQuizzes } from '@/app/Lib/firebase/firestore';
import { useRouter } from 'next/navigation';

interface Quiz {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  numberOfQuestions: number;
  createdAt: string;
}

export default function QuizzesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user?.id) {
      fetchQuizzes();
    }
  }, [user?.id, authLoading, router]);

  const fetchQuizzes = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await getUserQuizzes(user.id);
      setQuizzes(data as unknown as Quiz[]);
    } catch (error) {
      showErrorToast('Failed to load quizzes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingOverlay isVisible={true} message="Loading quizzes..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
              ← Dashboard
            </Link>
            <h1 className="text-lg font-semibold text-gray-700">Quizzes</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Quizzes</h2>
            <p className="text-gray-600">Total: {quizzes.length} quizzes</p>
          </div>
          <Link href="/quiz-generator">
            <Button variant="primary">+ Create Quiz</Button>
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No quizzes yet</p>
            <p className="text-gray-400 mb-6">Create your first quiz to get started</p>
            <Link href="/quiz-generator">
              <Button variant="primary">Create First Quiz</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map(quiz => (
              <div
                key={quiz.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{quiz.topic}</p>
                
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                    quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {quiz.difficulty}
                  </span>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {quiz.numberOfQuestions} Q's
                  </span>
                </div>

                <p className="text-gray-500 text-xs mb-4">
                  Created: {new Date(quiz.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2">
                  <Link href={`/dashboard/quiz/${quiz.id}`} className="flex-1">
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
