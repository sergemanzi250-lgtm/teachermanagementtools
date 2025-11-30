'use client';

import Link from 'next/link';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import {
  Users,
  FileText,
  TrendingUp,
  AlertCircle,
  BarChart3,
  Activity,
  Award,
  Clock,
  ArrowRight,
  UserCheck,
  Download,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  // Mock data - in production, fetch from backend
  const adminStats = [
    {
      label: 'Total Users',
      value: '1,248',
      change: '+12%',
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Active Teachers',
      value: '847',
      change: '+8%',
      icon: UserCheck,
      color: 'green',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Lesson Plans Created',
      value: '12,456',
      change: '+24%',
      icon: FileText,
      color: 'purple',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'System Health',
      value: '99.8%',
      change: '+0.1%',
      icon: Activity,
      color: 'green',
      bgColor: 'bg-green-50',
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: 'Sarah Uwimana',
      email: 'sarah@school.rw',
      role: 'teacher',
      school: 'Kigali Primary School',
      joinDate: '2025-11-28',
      status: 'active',
    },
    {
      id: 2,
      name: 'Jean Baptiste',
      email: 'jbaptiste@school.rw',
      role: 'teacher',
      school: 'Muhima Secondary School',
      joinDate: '2025-11-27',
      status: 'active',
    },
    {
      id: 3,
      name: 'Marie Ingabire',
      email: 'marie@training.rw',
      role: 'admin',
      school: 'RTVET Center',
      joinDate: '2025-11-25',
      status: 'active',
    },
    {
      id: 4,
      name: 'Paul Kagame',
      email: 'paul@school.rw',
      role: 'teacher',
      school: 'Huye Primary School',
      joinDate: '2025-11-20',
      status: 'inactive',
    },
  ];

  const systemMetrics = [
    {
      label: 'API Response Time',
      value: '145ms',
      status: 'good',
    },
    {
      label: 'Database Uptime',
      value: '99.98%',
      status: 'excellent',
    },
    {
      label: 'Storage Used',
      value: '284GB / 500GB',
      status: 'good',
    },
    {
      label: 'Active Sessions',
      value: '324',
      status: 'normal',
    },
  ];

  const reportsData = [
    {
      title: 'Monthly Usage Report',
      icon: BarChart3,
      color: 'blue',
    },
    {
      title: 'User Growth Analytics',
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Content Performance',
      icon: Award,
      color: 'purple',
    },
    {
      title: 'System Logs',
      icon: Clock,
      color: 'gray',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard 🔧
        </h1>
        <p className="text-gray-600">
          System overview and management tools
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className={`text-${stat.color}-600`} size={24} />
                </div>
                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* System Metrics & Reports Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* System Metrics */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">System Metrics</h2>
          <div className="space-y-4">
            {systemMetrics.map((metric) => (
              <div key={metric.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{metric.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{metric.value}</p>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    metric.status === 'excellent'
                      ? 'bg-green-500'
                      : metric.status === 'good'
                      ? 'bg-green-400'
                      : 'bg-yellow-400'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Reports */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Reports</h2>
          <div className="grid grid-cols-2 gap-4">
            {reportsData.map((report) => {
              const Icon = report.icon;
              return (
                <Link
                  key={report.title}
                  href={`/admin/reports/${report.title.toLowerCase().replace(' ', '-')}`}
                  className={`p-4 rounded-lg border border-gray-200 hover:shadow-lg hover:border-${report.color}-300 transition-all`}
                >
                  <Icon size={24} className={`text-${report.color}-600 mb-2`} />
                  <p className="font-medium text-gray-900 text-sm">{report.title}</p>
                  <p className="text-xs text-gray-500 mt-2">View report →</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Users</h2>
            <Link href="/admin/users" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Manage Users <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  School
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                    index === recentUsers.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{user.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600 text-sm">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600 text-sm">{user.school}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600 text-sm">{user.joinDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadge(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
