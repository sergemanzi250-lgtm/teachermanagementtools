'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader } from 'lucide-react';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { showSuccessToast, showErrorToast } from '@/app/Lib/utils/toast';
import type { RtbSessionPlanInput } from '@/app/Lib/types/type';

export default function RtbSessionPlanPage() {
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
  const [formData, setFormData] = useState<Partial<RtbSessionPlanInput>>({
    duration: 60,
    sessionNumber: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['duration', 'sessionNumber'].includes(name) ? parseInt(value) : value
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

      if (!formData.instructorName) {
        throw new Error('Please fill in all required fields');
      }

      const response = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
          format: 'RTB',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate session plan');
      }

      showSuccessToast('Session plan generated successfully!');
      setSuccess(true);
      setTimeout(() => {
        setFormData({ duration: 60, sessionNumber: 1 });
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create RTB TVET Session Plan</h1>
          <p className="text-gray-600 mb-8">
            A RTB-certified Session Plan is designed to provide structured teaching and learning processes for TVET learners
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">✓ Session plan generated successfully!</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">✗ {error}</p>
              </div>
            )}

            {/* Institution Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                  <input
                    type="text"
                    name="sector"
                    value={formData.sector || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., Hospitality/Security Services"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trade</label>
                  <input
                    type="text"
                    name="trade"
                    value={formData.trade || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., Food and Beverage Services"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <input
                    type="text"
                    name="level"
                    value={formData.level || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., Level 3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teacher Name</label>
                  <input
                    type="text"
                    name="instructorName"
                    value={formData.instructorName || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., Alex Umbugara"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Module Title</label>
                  <input
                    type="text"
                    name="moduleTitle"
                    value={formData.moduleTitle || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., Food and Beverage Service Operations"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Week</label>
                  <input
                    type="text"
                    name="week"
                    value={formData.week || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., Week 4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class Size</label>
                  <input
                    type="number"
                    name="classSize"
                    value={formData.classSize || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., 25"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class Name</label>
                  <input
                    type="text"
                    name="className"
                    value={formData.className || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., H/B-L3A"
                  />
                </div>
              </div>
            </div>

            {/* Course Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Topic and Learning Outcomes</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topic of Session</label>
                  <textarea
                    name="topicOfSession"
                    value={formData.topicOfSession || ''}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., Table Setting, Preparation..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Learning Outcomes</label>
                  <textarea
                    name="learningOutcomes"
                    value={formData.learningOutcomes || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., Demonstrate proper table setting and service techniques..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Indicative Content</label>
                  <textarea
                    name="indicativeContent"
                    value={formData.indicativeContent || ''}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., Client budget, tips, local dishes, service equipment..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Range</label>
                  <textarea
                    name="range"
                    value={formData.range || ''}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., From preparing the guest list to ensuring the menu is executed..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facilitation Technique</label>
                  <textarea
                    name="facilitationTechnique"
                    value={formData.facilitationTechnique || ''}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="e.g., Brainstorming, Guided Discovery, Simulation, Experimental Learning, Simile"
                  />
                </div>
              </div>
            </div>

            {/* Session Learning Objectives */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Language and Duration</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language/Usumu/Langue/Lughe</label>
                  <select
                    name="language"
                    value={formData.language || 'English'}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Kinyarwanda">Kinyarwanda</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration || 60}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    min="30"
                    max="180"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Development Steps</label>
                  <input
                    type="number"
                    name="numberOfDevelopmentSteps"
                    value={formData.numberOfDevelopmentSteps || 4}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    min="1"
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
                {loading ? 'Generating...' : 'generate'}
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

