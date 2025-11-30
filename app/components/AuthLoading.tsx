'use client';

import { Loader } from 'lucide-react';

interface AuthLoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function AuthLoading({ message = 'Loading...', fullScreen = false }: AuthLoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-indigo-600 rounded-full opacity-10 animate-pulse"></div>
        <Loader className="absolute inset-0 text-blue-600 animate-spin" size={40} />
      </div>
      <p className="text-gray-600 font-medium text-center">{message}</p>
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
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
}
