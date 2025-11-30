'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export function LoadingSpinner({ size = 'medium', text = 'Loading...' }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizeClasses[size]} border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin`} />
      {text && <p className="text-gray-600 font-medium">{text}</p>}
    </div>
  );
}

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingOverlay({ isVisible, message = 'Processing...' }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <LoadingSpinner text={message} />
      </div>
    </div>
  );
}

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export function Skeleton({ width = 'w-full', height = 'h-4', className = '' }: SkeletonProps) {
  return (
    <div className={`${width} ${height} ${className} bg-gray-300 rounded animate-pulse`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <Skeleton height="h-6" width="w-3/4" />
      <Skeleton height="h-4" width="w-full" />
      <Skeleton height="h-4" width="w-5/6" />
      <div className="pt-4 flex gap-2">
        <Skeleton height="h-10" width="w-24" className="rounded" />
        <Skeleton height="h-10" width="w-24" className="rounded" />
      </div>
    </div>
  );
}

export default LoadingSpinner;
