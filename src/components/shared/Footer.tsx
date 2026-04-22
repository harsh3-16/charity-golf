import React from 'react';
import { Target } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-20 px-6 border-t border-white/5 bg-black relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="text-center md:text-left">
          <Link href="/" className="flex items-center gap-2 justify-center md:justify-start mb-6">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
              <Target className="text-black w-5 h-5" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold tracking-tight outfit">
              CHARITY<span className="text-emerald-500">GOLF</span>
            </span>
          </Link>
          <p className="text-gray-500 text-sm max-w-xs">
            Elevating the game of golf to serve the greater good. Join us today.
          </p>
        </div>
        <div className="flex gap-8 text-sm font-medium text-gray-500">
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
        <div className="text-gray-600 text-sm">© 2026 Charity Golf Ltd.</div>
      </div>
    </footer>
  );
}
