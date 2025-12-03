'use client';
<<<<<<< HEAD

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { LoadingOverlay } from '@/app/components/Loading';
import { Button } from '@/app/components/UI';
import { showErrorToast, showSuccessToast } from '@/app/Lib/utils/toast';
import { getLessonPlan, deleteLessonPlan } from '@/app/Lib/firebase/firestore';
import { exportLessonPlanToPDF } from '@/app/Lib/utils/pdf';
import { exportLessonPlanToExcel, exportLessonPlanAsTable } from '@/app/Lib/utils/excel';

interface LessonPlanData {
  id: string;
  title: string;
  subject: string;
  className: string;
  format: string;
  content: string;
  createdAt: string;
  duration?: number;
  parsed?: Record<string, any>;
  [key: string]: any;
}

// Helper function to render structured content with columns and rows
const renderStructuredContent = (lessonPlan: LessonPlanData) => {
  // If we have content with ## headers, use content parsing
  if (lessonPlan.content && lessonPlan.content.includes('##')) {
    return renderContentTables(lessonPlan.content);
  }

  // If the content is already structured (parsed JSON), use that
  if (lessonPlan.parsed && typeof lessonPlan.parsed === 'object') {
    const parsedData = lessonPlan.parsed as Record<string, any>;
    
    // Group related fields into sections
    const sections = {
      'Basic Information': ['title', 'subject', 'className', 'format', 'duration', 'createdAt'],
      'Teaching Details': ['teaching_activities', 'learner_activities', 'timing_for_each_step', 'teaching_and_learning_activities_description'],
      'Assessment': ['assessment_method', 'assessment_tools', 'assessmentCriteria'],
      'Materials & Resources': ['learning_materials', 'equipmentRequired', 'materials'],
      'Competencies & Objectives': ['key_unity_competence', 'general_competencies', 'learningObjectives', 'keyCompetencies', 'sessionObjective'],
      'Additional Details': ['location', 'term', 'date', 'schoolName', 'teacherName', 'instructorName', 'sessionNumber', 'sessionDate']
    };

    return (
      <div className="space-y-6">
        {Object.entries(sections).map(([sectionName, fields]) => {
          const sectionData = Object.entries(parsedData)
            .filter(([key]) => fields.includes(key) && !['id', '_id', 'userId', 'updatedAt'].includes(key))
            .map(([key, value]) => ({
              field: formatFieldName(key),
              value: renderValue(value)
            }));

          if (sectionData.length === 0) return null;

          return (
            <div key={sectionName} className="bg-white rounded-lg shadow-lg border-2 border-blue-200 hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
                <h3 className="text-lg font-bold">{sectionName}</h3>
              </div>
              <div className="overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {sectionData.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                        <td className="px-6 py-4 w-1/3 border-r-2 border-blue-300">
                          <span className="font-bold text-black text-sm uppercase tracking-wide">
                            {item.field}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-black font-medium text-base leading-relaxed">
                            {item.value}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback to raw content display
  if (lessonPlan.content) {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
        <pre className="whitespace-pre-wrap text-black font-medium text-base leading-relaxed font-sans">
          {lessonPlan.content}
        </pre>
      </div>
    );
  }

  return (
    <div className="text-center py-8 text-gray-800 bg-gray-100 rounded-lg">
      <p className="text-lg font-semibold">Structured view not available for this lesson plan format.</p>
    </div>
  );
};

// Helper function to format field names
const formatFieldName = (key: string) => {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};

// Helper function to parse content and create structured tables
const parseContentToSections = (content: string) => {
  const sections: Record<string, string> = {};
  const lines = content.split('\n');
  let currentSection = '';
  let currentContent = '';
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Check if this line is a section header (starts with ##)
    if (trimmedLine.startsWith('## ')) {
      // Save previous section if exists
      if (currentSection && currentContent.trim()) {
        sections[currentSection] = currentContent.trim();
      }
      
      // Start new section
      currentSection = trimmedLine.replace('## ', '').replace(/\s*-\s*$/, '');
      currentContent = '';
    } else {
      // Add content to current section
      if (currentSection) {
        currentContent += line + '\n';
      }
    }
  });
  
  // Don't forget the last section
  if (currentSection && currentContent.trim()) {
    sections[currentSection] = currentContent.trim();
  }
  
  return sections;
};

// Helper function to render content in structured tables
const renderContentTables = (content: string) => {
  const sections = parseContentToSections(content);
  
  return (
    <div className="space-y-6">
      {Object.entries(sections).map(([sectionName, sectionContent], index) => {
        // Split content into lines for processing
        const lines = sectionContent.split('\n').filter(line => line.trim());
        
        return (
          <div key={index} className="bg-white rounded-lg shadow-lg border-2 border-blue-200 hover:shadow-xl transition-shadow overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
              <h3 className="text-lg font-bold">{sectionName}</h3>
            </div>
            <div className="overflow-hidden">
              <table className="w-full min-w-full">
                <tbody>
                  {lines.map((line, lineIndex) => {
                    const trimmedLine = line.trim();
                    
                    // Skip empty lines
                    if (!trimmedLine) return null;
                    
                    // Check if it's a numbered/bulleted item
                    const isBulletPoint = /^(\d+\.|\-|\*)\s/.test(trimmedLine);
                    
                    return (
                      <tr key={lineIndex} className={lineIndex % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                        <td className="px-6 py-3 w-1/3 border-r-2 border-blue-300">
                          <span className="font-bold text-black text-sm">
                            {isBulletPoint ? 
                              (trimmedLine.match(/^(\d+\.|\-|\*)\s(.+)$/)?.[1] || '•') + ' ' : 
                              (lineIndex + 1) + '.'
                            }
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="text-black font-medium text-base leading-relaxed">
                            {isBulletPoint ? 
                              trimmedLine.replace(/^(\d+\.|\-|\*)\s/, '') : 
                              trimmedLine
                            }
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Note: renderFormattedContent and renderTableView functions are no longer used
// since we only display structured content now

// Helper to render different value types with better visibility
const renderValue = (value: any) => {
  if (Array.isArray(value)) {
    return (
      <ul className="list-disc pl-5 space-y-1">
        {value.map((item, index) => (
          <li key={index} className="text-black font-medium">{renderValue(item)}</li>
        ))}
      </ul>
    );
  } else if (typeof value === 'object' && value !== null) {
    return (
      <div className="pl-4 border-l-4 border-blue-300 space-y-2">
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="mb-2">
            <span className="font-bold text-gray-800">{formatFieldName(k)}: </span>
            <span className="text-black">{renderValue(v)}</span>
          </div>
        ))}
      </div>
    );
  } else {
    return <span className="text-black font-medium">{String(value)}</span>;
  }
};

// Note: renderTableView function is no longer used since we only display structured content

export default function ViewLessonPlanPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [lessonPlan, setLessonPlan] = useState<LessonPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  // Removed view mode state since we only need structured view

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user?.id && id) {
      fetchLessonPlan();
    }
  }, [user?.id, authLoading, router, id]);

  const fetchLessonPlan = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/get-lesson-plan/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setLessonPlan(data.data as LessonPlanData);
      } else {
        throw new Error(data.error || 'Failed to fetch lesson plan');
      }
    } catch (error) {
      showErrorToast('Failed to load lesson plan');
      console.error(error);
      router.push('/dashboard/lessons');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lesson plan?')) return;

    try {
      const response = await fetch(`/api/delete-lesson-plan/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        showSuccessToast('Lesson plan deleted');
        router.push('/dashboard/lessons');
      } else {
        throw new Error(data.error || 'Failed to delete lesson plan');
      }
    } catch (error) {
      showErrorToast('Failed to delete lesson plan');
    }
  };

  const handleExport = () => {
    if (lessonPlan) {
      exportLessonPlanToPDF(lessonPlan, `${lessonPlan.title || 'lesson-plan'}.pdf`);
      showSuccessToast('Lesson plan exported as PDF');
    }
  };

  const handleExportExcel = () => {
    if (lessonPlan) {
      const filename = `${lessonPlan.title || 'lesson-plan'}.xlsx`;
      const success = exportLessonPlanToExcel(lessonPlan, filename);
      if (success) {
        showSuccessToast('Lesson plan exported as Excel');
      } else {
        showErrorToast('Failed to export lesson plan as Excel');
      }
    }
  };

  const handleExportTable = () => {
    if (lessonPlan) {
      const filename = `${lessonPlan.title || 'lesson-plan-table'}.xlsx`;
      const success = exportLessonPlanAsTable(lessonPlan, filename);
      if (success) {
        showSuccessToast('Lesson plan exported as Excel table');
      } else {
        showErrorToast('Failed to export lesson plan table');
      }
    }
  };

  if (authLoading || loading) {
    return <LoadingOverlay isVisible={true} message="Loading lesson plan..." />;
  }

  if (!lessonPlan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <nav className="bg-white shadow-sm sticky top-0 z-40 w-full">
        <div className="w-full px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard/lessons" className="text-2xl font-bold text-gray-900">
              ← Back to Lessons
            </Link>
            <h1 className="text-lg font-semibold text-gray-700">View Lesson Plan</h1>
          </div>
        </div>
      </nav>

      <main className="w-full px-2 sm:px-4 lg:px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{lessonPlan.title}</h1>
              <p className="text-gray-600">{lessonPlan.subject} • {lessonPlan.className}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="success" onClick={handleExport}>
                📥 Download PDF
              </Button>
              <Button variant="primary" onClick={handleExportExcel}>
                📊 Excel (Multi-sheet)
              </Button>
              <Button variant="primary" onClick={handleExportTable}>
                📋 Excel (Table)
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                🗑️ Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 pb-8 border-b">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Subject</p>
              <p className="font-semibold text-gray-900">{lessonPlan.subject}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Class</p>
              <p className="font-semibold text-gray-900">{lessonPlan.className}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Format</p>
              <p className="font-semibold text-gray-900">{lessonPlan.format}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Created</p>
              <p className="font-semibold text-gray-900">{new Date(lessonPlan.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Content</h2>
            <div className="bg-gray-50 p-4 lg:p-6 rounded-lg border-2 border-gray-300 h-[100vh] overflow-y-auto w-full">
              {renderStructuredContent(lessonPlan)}
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/dashboard/lessons">
              <Button variant="outline">Back to Lessons</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
=======
import { useParams } from 'next/navigation';
import { LoadingOverlay } from '@/app/components/Loading';
import { useLessonPlan } from '@/app/Lib/hooks/useLessonPlan';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import LessonHeader from '@/app/components/lesson-plan/LessonHeader';
import LessonMeta from '@/app/components/lesson-plan/LessonMeta';
import LessonContent from '@/app/components/lesson-plan/LessonContent';

export default function LessonPlanPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id as string;
  const { lessonPlan, loading, remove, exportPDF } = useLessonPlan(id);

  if (loading) return <LoadingOverlay isVisible message="Loading..." />;
  if (!lessonPlan) return null;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        <LessonHeader
          title={lessonPlan.title}
          subject={lessonPlan.subject}
          className={lessonPlan.className}
          onExportPDF={exportPDF}
          onDelete={remove}
        />
        <LessonMeta data={lessonPlan} />
        <LessonContent parsed={lessonPlan.parsed} />
      </div>
    </DashboardLayout>
>>>>>>> 50d166d (feat: add complete teacher management system with AI lesson planning)
  );
}
