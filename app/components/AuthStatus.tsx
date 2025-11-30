'use client';

import Link from 'next/link';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface AuthStatusProps {
  variant?: 'banner' | 'inline';
}

export function AuthStatus({ variant = 'inline' }: AuthStatusProps) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Loader size={18} className="animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (variant === 'banner') {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-blue-600" size={20} />
              <div>
                <p className="text-sm font-medium text-blue-900">Sign in to get started</p>
                <p className="text-xs text-blue-700">Create and generate AI-powered lesson plans</p>
              </div>
            </div>
            <Link
              href="/signin"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      );
    }

    return (
      <Link
        href="/signin"
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        <AlertCircle size={18} />
        Sign in required
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-600">
      <CheckCircle size={18} />
      <span className="text-sm font-medium">Signed in as {user?.displayName}</span>
    </div>
  );
}
