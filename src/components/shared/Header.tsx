'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import { usePostQuery } from '@/hooks/useApi';
import { apiUrls } from '@/lib/apiUrls';
import { toast } from '@/components/shared/Toast';
import Link from 'next/link';
import { CustomButton } from '@/components/shared/CustomButton';

const NAV_LINKS = [
  { href: '/charities', label: 'Charities' },
  { href: '/how-it-works', label: 'How it Works' },
  { href: '/pricing', label: 'Pricing' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const { postQuery } = usePostQuery();

  const handleLogout = async () => {
    try {
      await postQuery({ url: apiUrls.auth.logout });
      dispatch(logout());
      toast.success('Signed out successfully');
      setMobileMenuOpen(false);
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const dashboardHref = user?.role === 'admin' ? '/admin' : '/dashboard';
  const dashboardLabel = user?.role === 'admin' ? 'Admin Panel' : 'Dashboard';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-md" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="Charity Golf Home">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center transform rotate-3">
            <Target className="text-black w-6 h-6" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold tracking-tight outfit">
            CHARITY<span className="text-emerald-500">GOLF</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <>
              <Link href={dashboardHref} className="text-white hover:text-emerald-400 flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                {dashboardLabel}
              </Link>
              <button 
                onClick={handleLogout}
                className="text-red-500/80 hover:text-red-500 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white hover:text-emerald-400">
                Sign In
              </Link>
              <Link href="/signup">
                <CustomButton size="sm">Subscribe Now</CustomButton>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white font-medium py-2 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-white/5" />
              {isAuthenticated ? (
                <>
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white hover:text-emerald-400 font-medium py-2 flex items-center gap-2 transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    {dashboardLabel}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-400 font-medium py-2 flex items-center gap-2 transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white hover:text-emerald-400 font-medium py-2 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <CustomButton size="sm" className="w-full">
                      Subscribe Now
                    </CustomButton>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
