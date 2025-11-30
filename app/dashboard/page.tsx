'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import {
  FileText,
  Plus,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { getUserLessonPlans, getUserQuizzes } from '@/app/Lib/firebase/firestore';
import { showErrorToast } from '@/app/Lib/utils/toast';

interface Stats {
  lessonPlans: number;
  quizzes: number;
  rubrics: number;
  thisMonth: number;
}

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ lessonPlans: 0, quizzes: 0, rubrics: 0, thisMonth: 0 });
  const [recentPlansData, setRecentPlansData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const plans = await getUserLessonPlans(user.id, 10);
        const quizzes = await getUserQuizzes(user.id);
        
        // Calculate stats efficiently
        const now = new Date();
        const thisMonthPlans = plans.filter((p: any) => {
          const planDate = new Date(p.createdAt);
          return planDate.getMonth() === now.getMonth() && planDate.getFullYear() === now.getFullYear();
        }).length;

        setStats({
          lessonPlans: plans.length,
          quizzes: quizzes.length,
          rubrics: 0,
          thisMonth: thisMonthPlans,
        });

        setRecentPlansData(plans.slice(0, 5));
      } catch (error) {
        showErrorToast('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user?.id]);

  if (authLoading || isLoading) {
    return null;
  }

  if (!user) {
    return null;
  }

  // Memoize stats configuration to prevent recalculation
  const statsList = useMemo(() => [
    {
      label: 'Total Lesson Plans',
      value: stats.lessonPlans,
      icon: FileText,
      color: 'blue',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'This Month',
      value: stats.thisMonth,
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Quizzes Created',
      value: stats.quizzes,
      icon: CheckCircle,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Total Documents',
      value: stats.lessonPlans + stats.quizzes,
      icon: FileText,
      color: 'purple',
      bgColor: 'bg-purple-50',
    },
  ], [stats]);

  const quickActions = useMemo(() => [
    {
      label: 'Create REB Lesson Plan',
      href: '/reb-lesson-plan',
      icon: Plus,
      color: 'blue',
    },
    {
      label: 'Create RTB Session Plan',
      href: '/rtb-session-plan',
      icon: Plus,
      color: 'purple',
    },
    {
      label: 'Create Nursery Lesson Plan',
      href: '/nursery-lesson-plan',
      icon: Plus,
      color: 'green',
    },
    {
      label: 'Create Quiz',
      href: '/quiz-generator',
      icon: Plus,
      color: 'yellow',
    },
    {
      label: 'Create Rubric',
      href: '/rubric-generator',
      icon: Plus,
      color: 'red',
    },
    {
      label: 'Create Activity',
      href: '/activity-generator',
      icon: Plus,
      color: 'orange',
    },
    {
      label: 'Create Unit Plan',
      href: '/unit-plan-generator',
      icon: Plus,
      color: 'teal',
    },
    {
      label: 'Create Scheme',
      href: '/scheme-of-work-generator',
      icon: Plus,
      color: 'indigo',
    },
  ], []);

  const dashboardContent = (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.displayName}! 👋
        </h1>
        <p className="text-gray-600">
          Here's your lesson planning dashboard. Let's create amazing lessons today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsList.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className={`text-${stat.color}-600`} size={24} />
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const colorMap: { [key: string]: { border: string; bg: string; hover: string; icon: string } } = {
              blue: { border: 'border-blue-300', bg: 'bg-blue-50', hover: 'hover:bg-blue-100', icon: 'text-blue-600' },
              purple: { border: 'border-purple-300', bg: 'bg-purple-50', hover: 'hover:bg-purple-100', icon: 'text-purple-600' },
              green: { border: 'border-green-300', bg: 'bg-green-50', hover: 'hover:bg-green-100', icon: 'text-green-600' },
              yellow: { border: 'border-yellow-300', bg: 'bg-yellow-50', hover: 'hover:bg-yellow-100', icon: 'text-yellow-600' },
              red: { border: 'border-red-300', bg: 'bg-red-50', hover: 'hover:bg-red-100', icon: 'text-red-600' },
              orange: { border: 'border-orange-300', bg: 'bg-orange-50', hover: 'hover:bg-orange-100', icon: 'text-orange-600' },
              teal: { border: 'border-teal-300', bg: 'bg-teal-50', hover: 'hover:bg-teal-100', icon: 'text-teal-600' },
              indigo: { border: 'border-indigo-300', bg: 'bg-indigo-50', hover: 'hover:bg-indigo-100', icon: 'text-indigo-600' },
            };
            const colors = colorMap[action.color] || colorMap['blue'];
            return (
              <Link
                key={action.label}
                href={action.href}
                className={`p-4 rounded-lg border-2 border-dashed hover:shadow-lg transition-all ${colors.border} ${colors.bg} ${colors.hover}`}
              >
                <Icon size={24} className={`mb-2 ${colors.icon}`} />
                <p className="font-medium text-gray-900 text-sm">{action.label}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Lesson Plans */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Lesson Plans</h2>
            <Link href="/dashboard/lessons" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          {recentPlansData.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No lesson plans yet. Create your first one!</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Format
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentPlansData.map((plan: any, index: number) => (
                  <tr
                    key={plan.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      index === recentPlansData.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{plan.title || 'Untitled'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{plan.subject || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {plan.format || 'REB'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 text-sm">
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/lessons/${plan.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Browse All Documents */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Link href="/dashboard/lessons">
          <div className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <BookOpen className="mx-auto mb-2 text-blue-600" size={24} />
            <p className="text-sm font-medium text-gray-900">Lesson Plans</p>
            <p className="text-xs text-gray-500">{stats.lessonPlans} total</p>
          </div>
        </Link>
        <Link href="/dashboard/quizzes">
          <div className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <FileText className="mx-auto mb-2 text-yellow-600" size={24} />
            <p className="text-sm font-medium text-gray-900">Quizzes</p>
            <p className="text-xs text-gray-500">{stats.quizzes} total</p>
          </div>
        </Link>
        <Link href="/dashboard/rubrics">
          <div className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CheckCircle className="mx-auto mb-2 text-purple-600" size={24} />
            <p className="text-sm font-medium text-gray-900">Rubrics</p>
            <p className="text-xs text-gray-500">View all</p>
          </div>
        </Link>
        <Link href="/dashboard/activities">
          <div className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <Plus className="mx-auto mb-2 text-orange-600" size={24} />
            <p className="text-sm font-medium text-gray-900">Activities</p>
            <p className="text-xs text-gray-500">View all</p>
          </div>
        </Link>
        <Link href="/dashboard/schemes-of-work">
          <div className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <TrendingUp className="mx-auto mb-2 text-indigo-600" size={24} />
            <p className="text-sm font-medium text-gray-900">Schemes</p>
            <p className="text-xs text-gray-500">View all</p>
          </div>
        </Link>
        <Link href="/dashboard/unit-plans">
          <div className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <BookOpen className="mx-auto mb-2 text-teal-600" size={24} />
            <p className="text-sm font-medium text-gray-900">Unit Plans</p>
            <p className="text-xs text-gray-500">View all</p>
          </div>
        </Link>
      </div>
    </>
  );

  return (
    <DashboardLayout>
      {dashboardContent}
    </DashboardLayout>
  );
}
