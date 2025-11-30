'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export function LoadingSpinner({ size = 'medium', text = 'Loading...' }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className={`${sizeClasses[size]} border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin`} style={{ animationDuration: '0.6s' }} />
      {text && <p className="text-gray-500 text-sm font-medium">{text}</p>}
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" style={{ animation: 'fadeIn 0.15s ease-in-out' }}>
      <div className="bg-white rounded-lg p-6 shadow-lg">
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
    <div className={`${width} ${height} ${className} bg-gray-200 rounded animate-pulse`} style={{ animationDuration: '1.5s' }} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
      <Skeleton height="h-5" width="w-3/4" />
      <Skeleton height="h-3" width="w-full" />
      <Skeleton height="h-3" width="w-5/6" />
      <div className="pt-2 flex gap-2">
        <Skeleton height="h-8" width="w-20" className="rounded" />
        <Skeleton height="h-8" width="w-20" className="rounded" />
      </div>
    </div>
  );
}

export default LoadingSpinner;
