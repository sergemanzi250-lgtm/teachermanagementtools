'use client';
import { useParams } from 'next/navigation';
import { LoadingOverlay } from '@/app/components/Loading';
import { useLessonPlan } from '@/app/Lib/hooks/useLessonPlan';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import LessonHeader from '@/app/components/lesson-plan/LessonHeader';
import LessonMeta from '@/app/components/lesson-plan/LessonMeta';
import CleanLessonContent from '@/app/components/lesson-plan/CleanLessonContent';
import { processUserContent } from '@/app/Lib/utils/cleanContent';

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
        <CleanLessonContent content={lessonPlan.content || JSON.stringify(lessonPlan.parsed)} />
      </div>
    </DashboardLayout>
  );
}
