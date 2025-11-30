'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { UserMenu } from './UserMenu';
import { Menu, X, Bell, Search } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { isAuthenticated, loading } = useAuth();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Logo & Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} className="text-gray-700" />
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                M
              </div>
              <span className="hidden sm:block font-bold text-xl text-gray-900">Mwalimu Tools</span>
            </Link>
          </div>

          {/* Center - Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search lesson plans..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Right Side - Notifications & User Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Search */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {showSearch ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Search size={24} className="text-gray-700" />
              )}
            </button>

            {/* Notifications */}
            {isAuthenticated && !loading && (
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                <Bell size={24} className="text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                
                {/* Notification Tooltip */}
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                      <p className="font-medium text-blue-900">New lesson plan template available</p>
                      <p className="text-blue-700 text-xs mt-1">5 minutes ago</p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                      <p className="font-medium text-green-900">Your lesson plan was approved</p>
                      <p className="text-green-700 text-xs mt-1">1 hour ago</p>
                    </div>
                  </div>
                  <Link
                    href="/notifications"
                    className="block text-center py-2 text-blue-600 hover:text-blue-700 text-sm font-medium border-t border-gray-200 pt-3"
                  >
                    View All
                  </Link>
                </div>
              </button>
            )}

            {/* User Menu */}
            {!loading && (
              isAuthenticated ? <UserMenu /> : (
                <Link
                  href="/signin"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Sign In
                </Link>
              )
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search lesson plans..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
