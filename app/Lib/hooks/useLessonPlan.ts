'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { showErrorToast, showSuccessToast } from '@/app/Lib/utils/toast';
import { exportLessonPlanToPDF } from '../utils/pdf';
import { RebLessonPlan } from '../types/type';

type LessonPlanWithParsed = RebLessonPlan & { parsed: Record<string, unknown> };

export function useLessonPlan(id?: string) {
  const [lessonPlan, setLessonPlan] = useState<LessonPlanWithParsed | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    load();
  }, [id]);

  async function load() {
    try {
      const res = await fetch(`/api/get-lesson-plan/${id}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setLessonPlan(data.data);
    } catch {
      showErrorToast('Failed to load lesson plan');
      router.push('/dashboard/lessons');
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    if (!confirm('Delete this lesson plan?')) return;
    try {
      const res = await fetch(`/api/delete-lesson-plan/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error();
      showSuccessToast('Deleted');
      router.push('/dashboard/lessons');
    } catch {
      showErrorToast('Failed to delete');
    }
  }

  const exportPDF = () => {
    if (!lessonPlan) return;
    exportLessonPlanToPDF(lessonPlan as any, `${lessonPlan.title}.pdf`);
    showSuccessToast('Exported PDF');
  };

  return { lessonPlan, loading, remove, exportPDF };
}
