'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Upload, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Image as ImageIcon,
  X,
  ArrowUpRight
} from 'lucide-react';
import { CustomButton } from '@/components/shared/CustomButton';

const MOCK_WINNINGS = [
  {
    id: '1',
    drawMonth: 'March 2026',
    amount: '£50.00',
    matchCount: 3,
    status: 'paid',
    dateAdded: '2026-03-12',
    proofUrl: 'https://example.com/proof.jpg',
  },
  {
    id: '2',
    drawMonth: 'January 2026',
    amount: '£5,200.00',
    matchCount: 5,
    status: 'pending',
    dateAdded: '2026-01-12',
    proofUrl: null,
  },
];

export default function WinningsPage() {
  const [selectedWinning, setSelectedWinning] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setSelectedWinning(null);
      // In real app, update state/db
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold outfit">My Winnings</h1>
          <p className="text-gray-500 mt-1">Submit proof of your scores to claim your prizes.</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
           <div className="text-right">
              <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Total Earned</div>
              <div className="text-xl font-black text-emerald-500">£5,250.00</div>
           </div>
           <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-emerald-500" />
           </div>
        </div>
      </div>

      <div className="grid gap-6">
        {MOCK_WINNINGS.map((win, idx) => (
          <motion.div
            key={win.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-white/10 transition-all group"
          >
            <div className="flex items-center gap-8">
               <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${win.matchCount === 5 ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-white/5 border-white/10'}`}>
                  <Trophy className="w-8 h-8" />
               </div>
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-xl font-bold outfit">{win.drawMonth} Draw</span>
                     <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest text-gray-400">{win.matchCount} Match</span>
                  </div>
                  <div className="text-3xl font-black outfit text-white mb-2">{win.amount}</div>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                     <Clock className="w-3 h-3" /> Won on {win.dateAdded}
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
               {win.status === 'paid' ? (
                  <div className="flex flex-col items-end gap-2">
                     <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-bold border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4" />
                        Payout Confirmed
                     </div>
                     <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Received via Bank Transfer</span>
                  </div>
               ) : win.proofUrl ? (
                  <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 text-sm font-bold border border-amber-500/20">
                        <Clock className="w-4 h-4" />
                        Awaiting Verification
                      </div>
                      <CustomButton variant="outline" size="sm">View Proof</CustomButton>
                  </div>
               ) : (
                  <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                     <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 text-sm font-bold border border-red-500/20">
                        <AlertCircle className="w-4 h-4" />
                        Proof Required
                     </div>
                     <CustomButton 
                      onClick={() => setSelectedWinning(win)}
                      size="sm" 
                      className="px-8 w-full md:w-auto"
                      leftIcon={<Upload className="w-4 h-4" />}
                     >
                        Upload Screenshot
                     </CustomButton>
                  </div>
               )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-blue-500/5 border border-blue-500/10 space-y-4">
         <h4 className="font-bold text-blue-400 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Verification Rules
         </h4>
         <p className="text-sm text-gray-500 leading-relaxed max-w-3xl">
           To ensure fairness, all winners must upload a screenshot of their registered club score 
           or a photo of their signed scorecard within 48 hours of the draw. Once our admins 
           verify the match, your prize will be marked for payment. Payouts are processed on the 
           last Friday of every month.
         </p>
      </div>

      {/* Upload Modal (Simplified) */}
      <AnimatePresence>
        {selectedWinning && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setSelectedWinning(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 relative z-10"
            >
              <button 
                onClick={() => setSelectedWinning(null)}
                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-3xl font-extrabold outfit mb-2">Claim Prize</h2>
              <p className="text-gray-500 mb-8">Upload proof for the {selectedWinning.drawMonth} draw win.</p>

              <form onSubmit={handleUpload} className="space-y-8">
                <div className="border-2 border-dashed border-white/10 rounded-3xl p-12 text-center hover:border-emerald-500/50 transition-all cursor-pointer group">
                   <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                   </div>
                   <div className="text-sm font-bold text-gray-300">Click or drag to upload</div>
                   <div className="text-xs text-gray-600 mt-2">PNG, JPG or PDF up to 10MB</div>
                </div>

                <div className="flex flex-col gap-4">
                  <CustomButton size="lg" type="submit" loading={uploading}>
                    Submit for Verification
                  </CustomButton>
                  <button type="button" onClick={() => setSelectedWinning(null)} className="text-gray-500 hover:text-white text-sm font-medium">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Info(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}
