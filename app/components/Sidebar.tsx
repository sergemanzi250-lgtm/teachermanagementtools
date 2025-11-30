'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Settings,
  Users,
  BarChart3,
  LogOut,
  ChevronDown,
  Plus,
  History,
  HelpCircle,
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const isAdmin = user?.role === 'admin';

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const baseNavItems = [
    {
      label: 'Dashboard',
      href: isAdmin ? '/admin/dashboard' : '/dashboard',
      icon: LayoutDashboard,
      submenu: undefined,
    },
    {
      label: 'Create Lesson',
      href: '#',
      icon: Plus,
      submenu: [
        { label: 'REB Lesson Plan', href: '/reb-lesson-plan' },
        { label: 'RTB Session Plan', href: '/rtb-session-plan' },
        { label: 'Nursery Lesson Plan', href: '/nursery-lesson-plan' },
      ],
    },
    {
      label: 'My Lesson Plans',
      href: '/lesson-plans',
      icon: FileText,
      submenu: undefined,
    },
    {
      label: 'Recent Activities',
      href: '/activities',
      icon: History,
      submenu: undefined,
    },
  ];

  const adminNavItems = [
    {
      label: 'Users Management',
      href: '/admin/users',
      icon: Users,
      submenu: undefined,
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      submenu: undefined,
    },
    {
      label: 'Reports',
      href: '/admin/reports',
      icon: FileText,
      submenu: undefined,
    },
  ];

  const navItems = isAdmin ? [...baseNavItems, ...adminNavItems] : baseNavItems;

  const bottomNavItems = [
    {
      label: 'Settings',
      href: '/settings',
      icon: Settings,
    },
    {
      label: 'Help & Support',
      href: '/help',
      icon: HelpCircle,
    },
  ];

  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    const Icon = item.icon;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenu === item.label;

    return (
      <div key={item.label}>
        {hasSubmenu ? (
          <button
            onClick={() => setExpandedMenu(isExpanded ? null : item.label)}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
              isExpanded ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </div>
            <ChevronDown
              size={18}
              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        ) : (
          <Link
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive(item.href)
                ? 'bg-blue-100 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon size={20} />
            <span className="font-medium">{item.label}</span>
          </Link>
        )}

        {/* Submenu */}
        {hasSubmenu && isExpanded && (
          <div className="pl-4 mt-2 space-y-1 border-l-2 border-blue-200">
            {item.submenu.map((subitem) => (
              <Link
                key={subitem.href}
                href={subitem.href}
                onClick={onClose}
                className={`block px-4 py-2 rounded-lg transition-colors text-sm ${
                  isActive(subitem.href)
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {subitem.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform md:translate-x-0 md:w-64 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Main Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </nav>

          {/* Bottom Navigation */}
          <nav className="px-4 py-4 border-t border-gray-200 space-y-1">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate capitalize">
                  {user?.role || 'teacher'}
                </p>
              </div>
            </div>

            <Link
              href="/signin"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm border border-red-200"
            >
              <LogOut size={18} />
              Sign Out
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
