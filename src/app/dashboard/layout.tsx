'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Trophy,
  Target,
  Heart,
  Settings,
  LogOut,
  Bell,
  Wallet,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/store/authSlice';
import { usePostQuery } from '@/hooks/useApi';
import { apiUrls } from '@/lib/apiUrls';
import { toast } from '@/components/shared/Toast';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Target, label: 'My Scores', href: '/dashboard/scores' },
  { icon: Heart, label: 'Charity', href: '/dashboard/charity' },
  { icon: Trophy, label: 'Monthly Draws', href: '/dashboard/draws' },
  { icon: Wallet, label: 'Winnings', href: '/dashboard/winnings' },
];

function SidebarContent({
  pathname,
  onLinkClick,
}: {
  pathname: string;
  onLinkClick?: () => void;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { postQuery } = usePostQuery();

  const handleLogout = async () => {
    try {
      await postQuery({ url: apiUrls.auth.logout });
      dispatch(logout());
      sessionStorage.removeItem('auth_checked');
      toast.success('Signed out successfully');
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <>
      <div className="p-8">
        <Link href="/" className="flex items-center gap-2" onClick={onLinkClick}>
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
            <Target className="text-black w-5 h-5" aria-hidden="true" />
          </div>
          <span className="text-lg font-bold tracking-tight outfit">
            CHARITY<span className="text-emerald-500">GOLF</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1" aria-label="Dashboard navigation">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm',
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-gray-500 hover:text-white hover:bg-white/[0.02]'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="w-5 h-5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-1 border-t border-white/5">
        <Link
          href="/dashboard/settings"
          onClick={onLinkClick}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.02] transition-all font-medium text-sm"
        >
          <Settings className="w-5 h-5" aria-hidden="true" />
          Settings
        </Link>
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/80 hover:text-red-500 hover:bg-red-500/5 transition-all font-medium text-sm"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeLabel = MENU_ITEMS.find((i) => i.href === pathname)?.label || 'Settings';

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#050505] border-r border-white/5 z-50 hidden lg:flex flex-col">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[#050505] border-r border-white/5 z-50 flex flex-col lg:hidden"
            >
              <SidebarContent
                pathname={pathname}
                onLinkClick={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 relative">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-8 sticky top-0 bg-black/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              id="dashboard-menu-toggle"
              className="lg:hidden w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 text-gray-400" aria-hidden="true" />
            </button>
            <h2 className="text-xl font-bold outfit uppercase tracking-wider text-gray-400">
              {activeLabel}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-400" aria-hidden="true" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-black" aria-label="Unread notifications" />
            </button>

            <div className="flex items-center gap-3 ml-2">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold">Harsh Arora</div>
                <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                  Active Plan
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 border-2 border-black shadow-lg" />
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
