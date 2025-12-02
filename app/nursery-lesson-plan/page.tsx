'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader } from 'lucide-react';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { showSuccessToast, showErrorToast } from '@/app/Lib/utils/toast';
import type { NurseryLessonPlanInput } from '@/app/Lib/types/type';

export default function NurseryLessonPlanPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [authLoading, user, router]);
  const [formData, setFormData] = useState<Partial<NurseryLessonPlanInput>>({
    duration: 30,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      if (!formData.schoolName || !formData.theme || !formData.teacherName) {
        throw new Error('Please fill in all required fields');
      }

      const response = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
          format: 'NURSERY',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate lesson plan');
      }

      showSuccessToast('Lesson plan generated successfully!');
      setSuccess(true);
      setTimeout(() => {
        setFormData({ duration: 30 });
        setSuccess(false);
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Nursery Lesson Plan</h1>
          <p className="text-gray-600 mb-8">
            Fill in the details below to generate a nursery lesson plan with AI assistance
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">✓ Lesson plan generated successfully!</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">✗ {error}</p>
              </div>
            )}

            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., Happy Kids Nursery"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teacher Name</label>
                  <input
                    type="text"
                    name="teacherName"
                    value={formData.teacherName || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., Mrs. Sarah"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
                  <input
                    type="text"
                    name="term"
                    value={formData.term || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., Term 1, Term 2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., Numbers, Colors, Shapes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class Level</label>
                  <input
                    type="text"
                    name="classLevel"
                    value={formData.classLevel || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., Nursery 1, Nursery 2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Name</label>
                  <input
                    type="text"
                    name="lessonName"
                    value={formData.lessonName || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., Learning to Count 1-10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration || 30}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                    min="15"
                    max="60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class Size (number of children)</label>
                  <input
                    type="number"
                    name="classSize"
                    value={formData.classSize || 20}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    name="language"
                    value={formData.language || 'English'}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Kinyarwanda">Kinyarwanda</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <input
                    type="text"
                    name="theme"
                    value={formData.theme || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., Animals, Seasons, Family"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Generating...' : 'Generate Lesson Plan'}
              </button>
              <Link
                href="/"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
