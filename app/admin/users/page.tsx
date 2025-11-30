'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Trash2,
  Edit,
  Ban,
  CheckCircle,
  Mail,
  Phone,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock data - in production, fetch from backend
  const allUsers = [
    {
      id: 1,
      name: 'Sarah Uwimana',
      email: 'sarah@school.rw',
      phone: '+250 798 123 456',
      role: 'teacher',
      school: 'Kigali Primary School',
      district: 'Kigali City',
      joinDate: '2025-11-28',
      status: 'active',
      lessonPlans: 12,
    },
    {
      id: 2,
      name: 'Jean Baptiste',
      email: 'jbaptiste@school.rw',
      phone: '+250 799 234 567',
      role: 'teacher',
      school: 'Muhima Secondary School',
      district: 'Kigali City',
      joinDate: '2025-11-27',
      status: 'active',
      lessonPlans: 8,
    },
    {
      id: 3,
      name: 'Marie Ingabire',
      email: 'marie@training.rw',
      phone: '+250 797 345 678',
      role: 'admin',
      school: 'RTVET Center',
      district: 'Kigali City',
      joinDate: '2025-11-25',
      status: 'active',
      lessonPlans: 0,
    },
    {
      id: 4,
      name: 'Paul Kagame',
      email: 'paul@school.rw',
      phone: '+250 796 456 789',
      role: 'teacher',
      school: 'Huye Primary School',
      district: 'Huye District',
      joinDate: '2025-11-20',
      status: 'inactive',
      lessonPlans: 5,
    },
    {
      id: 5,
      name: 'Beatrice Nyirambiza',
      email: 'beatrice@school.rw',
      phone: '+250 795 567 890',
      role: 'teacher',
      school: 'Butare Secondary School',
      district: 'Huye District',
      joinDate: '2025-11-15',
      status: 'active',
      lessonPlans: 15,
    },
    {
      id: 6,
      name: 'David Mwangi',
      email: 'david@school.rw',
      phone: '+250 794 678 901',
      role: 'teacher',
      school: 'Ruhengeri School',
      district: 'Musanze District',
      joinDate: '2025-11-10',
      status: 'suspended',
      lessonPlans: 3,
    },
  ];

  // Filter users based on search and filters
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.school.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Users Management</h1>
        <p className="text-gray-600">Manage and monitor all system users</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="all">All Roles</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">All Users</h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredUsers.length} of {allUsers.length} users
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
            <Plus size={20} />
            Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  School
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Plans
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                    index === filteredUsers.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{user.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Mail size={16} />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Phone size={16} />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{user.school}</p>
                      <p className="text-xs text-gray-500">{user.district}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{user.lessonPlans}</p>
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
                    <p className="text-gray-600 text-sm">{user.joinDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-blue-50 rounded transition-colors text-blue-600">
                        <Edit size={18} />
                      </button>
                      {user.status === 'active' ? (
                        <button className="p-1 hover:bg-red-50 rounded transition-colors text-red-600">
                          <Ban size={18} />
                        </button>
                      ) : (
                        <button className="p-1 hover:bg-green-50 rounded transition-colors text-green-600">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button className="p-1 hover:bg-red-50 rounded transition-colors text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-600 font-medium mb-2">No users found</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
