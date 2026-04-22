'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Calendar, 
  History, 
  ArrowUpRight, 
  Target, 
  Dice5,
  BadgeCheck,
  Timer
} from 'lucide-react';
import { CustomButton } from '@/components/shared/CustomButton';

const PAST_DRAWS = [
  {
    id: '1',
    month: 'March',
    year: 2026,
    winningNumbers: [12, 34, 42, 18, 5],
    myMatches: 3,
    prize: '£50.00',
    status: 'Paid',
  },
  {
    id: '2',
    month: 'February',
    year: 2026,
    winningNumbers: [38, 22, 15, 40, 9],
    myMatches: 0,
    prize: '£0.00',
    status: null,
  },
];

export default function DrawsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold outfit">Monthly Draws</h1>
          <p className="text-gray-500 mt-1">Check upcoming prize pools and your past performance.</p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl">
           <Timer className="w-5 h-5 text-emerald-500" />
           <span className="text-sm font-bold text-emerald-500">Next Draw: May 12</span>
        </div>
      </div>

      {/* Hero Draw Card */}
      <div className="p-8 md:p-12 rounded-[2rem] bg-gradient-to-br from-emerald-500/20 to-blue-500/10 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <Trophy className="w-64 h-64 text-emerald-500" />
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest mb-4">
                Active Draw
              </div>
              <h2 className="text-4xl md:text-5xl font-black outfit text-white leading-tight">April 2026 Prize Pool</h2>
              <p className="text-gray-400 mt-4 leading-relaxed max-w-md">
                This month's prize pool is calculated from 12,450 active subscribers. 
                20% of every subscription forms the pool.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total Pool</div>
                <div className="text-3xl font-extrabold text-white outfit">£15,240.00</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Participants</div>
                <div className="text-3xl font-extrabold text-white outfit">12,450</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
               <CustomButton size="lg" className="px-10">My Entry Numbers</CustomButton>
               <CustomButton variant="outline" size="lg">Prize Breakdown</CustomButton>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md rounded-3xl border border-white/5 p-8 space-y-6">
             <h3 className="font-bold text-gray-300 uppercase tracking-widest text-xs">Prize Split (20% of Subscriptions)</h3>
             
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-emerald-500/30">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center font-black">5</div>
                      <div className="text-sm font-bold">Jackpot (40%)</div>
                   </div>
                   <div className="text-xl font-black outfit text-emerald-400">£6,096.00</div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-black">4</div>
                      <div className="text-sm font-bold">4-Match (35%)</div>
                   </div>
                   <div className="text-xl font-bold outfit">£5,334.00</div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-black">3</div>
                      <div className="text-sm font-bold">3-Match (25%)</div>
                   </div>
                   <div className="text-xl font-bold outfit">£3,810.00</div>
                </div>
             </div>
             
             <p className="text-[10px] text-gray-600 text-center uppercase tracking-widest font-bold">
               Prizes are split equally among winners in each tier.
             </p>
          </div>
        </div>
      </div>

      {/* Past History */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold outfit flex items-center gap-2">
          <History className="w-6 h-6 text-gray-500" />
          Draw History
        </h2>

        <div className="grid gap-4">
          {PAST_DRAWS.map((draw) => (
            <div key={draw.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex flex-col items-center justify-center border border-white/5">
                     <span className="text-xs font-bold uppercase text-gray-500">{draw.month}</span>
                     <span className="text-lg font-black outfit">{draw.year}</span>
                  </div>
                  <div>
                     <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Winning Numbers</div>
                     <div className="flex gap-2">
                        {draw.winningNumbers.map((num, i) => (
                           <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center font-bold text-white shadow-inner">
                              {num}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-8 md:gap-12">
                  <div className="text-center">
                     <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">My Matches</div>
                     <div className={`text-2xl font-bold outfit ${draw.myMatches > 0 ? 'text-emerald-500' : 'text-gray-700'}`}>
                        {draw.myMatches} / 5
                     </div>
                  </div>
                  <div className="text-center">
                     <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Prize</div>
                     <div className="text-2xl font-bold outfit text-white">{draw.prize}</div>
                  </div>
                  <div>
                     {draw.status ? (
                       <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
                          <BadgeCheck className="w-4 h-4" />
                          {draw.status}
                       </div>
                     ) : (
                       <div className="text-gray-700 text-xs font-bold uppercase tracking-widest">No Win</div>
                     )}
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
