'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  Dice5, 
  Heart, 
  CheckSquare, 
  Settings, 
  LogOut, 
  ShieldCheck,
  Search,
  Bell
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';
import { logout } from '@/store/authSlice';
import { usePostQuery } from '@/hooks/useApi';
import { apiUrls } from '@/lib/apiUrls';
import { toast } from '@/components/shared/Toast';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ADMIN_MENU = [
  { icon: BarChart3, label: 'Stats Overview', href: '/admin' },
  { icon: Users, label: 'Manage Users', href: '/admin/users' },
  { icon: Dice5, label: 'Draw Engine', href: '/admin/draws' },
  { icon: Heart, label: 'Charities', href: '/admin/charities' },
  { icon: CheckSquare, label: 'Verifications', href: '/admin/winners' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
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
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0a0a0a] border-r border-white/5 z-50 hidden lg:flex flex-col">
        <div className="p-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <ShieldCheck className="text-black w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight outfit uppercase">Admin<span className="text-blue-500">Panel</span></span>
          </Link>
        </div>

        <div className="px-4 mb-8">
           <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center overflow-hidden">
                 {user?.avatar_url ? (
                   <img src={user.avatar_url} alt={user.full_name || ''} className="w-full h-full object-cover" />
                 ) : (
                   <ShieldCheck className="w-5 h-5 text-blue-500" />
                 )}
              </div>
              <div>
                 <div className="text-xs font-bold text-white leading-none mb-1">{user?.full_name || 'Admin'}</div>
                 <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Super Admin</div>
              </div>
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {ADMIN_MENU.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                  isActive 
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                    : "text-gray-500 hover:text-white hover:bg-white/[0.02]"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-1 border-t border-white/5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.02] transition-all font-medium text-sm"
          >
            <Settings className="w-5 h-5" />
            Exit to App
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/80 hover:text-red-500 hover:bg-red-500/5 transition-all font-medium text-sm"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 relative">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-black/80 backdrop-blur-md z-40">
           <div className="flex-1 max-w-md relative hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="text" 
                placeholder="Search users, transactions, draws..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-2 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
              />
           </div>

           <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all relative">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-black" />
              </button>
              
              <div className="w-px h-6 bg-white/10 mx-2" />
              
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center font-bold text-blue-500 uppercase">
                    {(user?.full_name || 'AD').substring(0, 2)}
                 </div>
              </div>
           </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
