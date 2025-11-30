'use client';

import { Loader } from 'lucide-react';

interface AuthLoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function AuthLoading({ message = 'Loading...', fullScreen = false }: AuthLoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader className="text-blue-600 animate-spin" size={32} style={{ animationDuration: '0.6s' }} />
      <p className="text-gray-600 text-sm font-medium text-center">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      {content}
    </div>
  );
}
