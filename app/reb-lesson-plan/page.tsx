'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader, ChevronDown } from 'lucide-react';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { showSuccessToast, showErrorToast } from '@/app/Lib/utils/toast';
import type { RebLessonPlanInput } from '@/app/Lib/types/type';

export default function RebLessonPlanPage() {
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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basics: true,
    overview: false,
    additional: false,
  });
  
  const [formData, setFormData] = useState<Partial<RebLessonPlanInput>>({
    duration: 40,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
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

      if (!formData.schoolName || !formData.subject || !formData.className) {
        throw new Error('Please fill in all required fields');
      }

      const response = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
          format: 'REB',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate lesson plan');
      }

      showSuccessToast('Lesson plan generated successfully!');
      setSuccess(true);
      setTimeout(() => {
        setFormData({ duration: 40 });
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
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Lesson Plan</h1>
            <p className="text-gray-600 mb-8">
              Fill in the details below to generate a comprehensive lesson plan.
            </p>

            <form onSubmit={handleSubmit} className="space-y-0">
              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 font-medium">✓ Lesson plan generated successfully!</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 font-medium">✗ {error}</p>
                </div>
              )}

              {/* SECTION 1: Lesson Plan Details */}
              <div className="border-b">
                <button
                  type="button"
                  onClick={() => toggleSection('basics')}
                  className="w-full px-8 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h2 className="text-lg font-semibold text-gray-900">Lesson Plan Details</h2>
                  <ChevronDown 
                    size={24} 
                    className={`text-gray-600 transition-transform ${expandedSections.basics ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {expandedSections.basics && (
                  <div className="px-8 py-6 border-t bg-gray-50">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
                        <input
                          type="text"
                          name="schoolName"
                          value={formData.schoolName || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          placeholder="Charles Lwanga Primary School"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
                        <input
                          type="text"
                          name="teacherName"
                          value={formData.teacherName || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          placeholder="DAVID MUZI CHIMSANO"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          placeholder="Subject"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Class Level</label>
                        <input
                          type="text"
                          name="className"
                          value={formData.className || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          placeholder="e.g., Primary 5, Secondary 2"
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          placeholder="e.g., Term 1, Term 2, Term 3"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                        <input
                          type="number"
                          name="duration"
                          value={formData.duration || 40}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          min="15"
                          max="120"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Class Size</label>
                        <input
                          type="number"
                          name="classSize"
                          value={formData.classSize || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          placeholder="e.g., 40"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          placeholder="Classroom"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                        <select
                          name="language"
                          value={formData.language || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        >
                          <option value="">Select language</option>
                          <option value="English">English</option>
                          <option value="French">French</option>
                          <option value="Kinyarwanda">Kinyarwanda</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Special Needs (Optional)</label>
                        <input
                          type="text"
                          name="type_of_special_educational_needs"
                          value={formData.type_of_special_educational_needs || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          placeholder="Any special accommodations"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2: Lesson Overview */}
              <div className="border-b">
                <button
                  type="button"
                  onClick={() => toggleSection('overview')}
                  className="w-full px-8 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h2 className="text-lg font-semibold text-gray-900">Lesson Overview</h2>
                  <ChevronDown 
                    size={24} 
                    className={`text-gray-600 transition-transform ${expandedSections.overview ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {expandedSections.overview && (
                  <div className="px-8 py-6 border-t bg-gray-50 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit No.</label>
                      <input
                        type="text"
                        name="lessonUnit"
                        value={formData.lessonUnit || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        placeholder="e.g., Unit 1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        placeholder="Enter unit title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Key Unit Competence</label>
                      <textarea
                        name="key_unity_competence"
                        value={formData.key_unity_competence || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        placeholder="Enter the key unity competence for this lesson"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lesson No.</label>
                      <input
                        type="text"
                        name="lessonNumber"
                        value={formData.lessonNumber || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        placeholder="e.g., Lesson 1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
                      <input
                        type="text"
                        name="lessonTitle"
                        value={formData.lessonTitle || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        placeholder="Enter lesson title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">General Competencies</label>
                      <textarea
                        name="general_competencies"
                        value={formData.general_competencies || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        placeholder="Enter general competencies"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Learning Materials</label>
                      <textarea
                        name="learning_materials"
                        value={formData.learning_materials || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        placeholder="List the learning materials needed"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: Additional Options */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection('additional')}
                  className="w-full px-8 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h2 className="text-lg font-semibold text-gray-900">Additional Options</h2>
                  <ChevronDown 
                    size={24} 
                    className={`text-gray-600 transition-transform ${expandedSections.additional ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {expandedSections.additional && (
                  <div className="px-8 py-6 border-t bg-gray-50">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="include-activities"
                        name="includeActivities"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <label htmlFor="include-activities" className="ml-2 text-sm text-gray-700">
                        Include AI-generated activities description
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="bg-gray-50 px-8 py-6 border-t flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Generating...' : 'Submit'}
                </button>
                <Link
                  href="/dashboard"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
