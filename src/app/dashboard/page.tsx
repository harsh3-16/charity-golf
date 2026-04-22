'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  ArrowUpRight,
  Heart,
  Trophy,
  History,
  Users,
  X,
  Percent
} from 'lucide-react';
import { CustomButton } from '@/components/shared/CustomButton';
import { useGetQuery, usePatchQuery } from '@/hooks/useApi';
import { CharityCard } from '@/components/shared/CharityCard';
import { toast } from '@/components/shared/Toast';
import { apiUrls } from '@/lib/apiUrls';
import { Skeleton } from '@/components/shared/Skeleton';
import { ErrorState } from '@/components/shared/ErrorState';
import Link from 'next/link';

export default function DashboardPage() {
  const { 
    data: subStatus, 
    loading: subLoading, 
    error: subError, 
    getQuery: getSubStatus 
  } = useGetQuery();

  const { 
    data: drawMetrics, 
    loading: drawLoading, 
    error: drawError, 
    getQuery: getDrawMetrics 
  } = useGetQuery();

  const [showCharityModal, setShowCharityModal] = useState(false);
  const [selectedCharityId, setSelectedCharityId] = useState<string>('');
  const [percentage, setPercentage] = useState<number>(10);

  const { 
    data: charities, 
    getQuery: getCharities 
  } = useGetQuery();

  const { 
    patchQuery: updateCharity, 
    loading: updatingCharity 
  } = usePatchQuery();

  useEffect(() => {
    const controller = new AbortController();
    getSubStatus({ url: apiUrls.subscriptions.status, signal: controller.signal });
    getDrawMetrics({ url: apiUrls.draws.upcoming, signal: controller.signal });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (showCharityModal && subStatus) {
      getCharities({ url: apiUrls.charities.list });
      setSelectedCharityId(subStatus.charity?.id || '');
      setPercentage(subStatus.percentage || 10);
    }
  }, [showCharityModal, getCharities, subStatus]);

  const handleUpdateCharity = async () => {
    await updateCharity({
      url: apiUrls.users.updateCharity,
      body: { 
        charity_id: selectedCharityId, 
        charity_contribution_percentage: percentage 
      },
      onSuccess: () => {
        toast.success('Charity settings updated!');
        setShowCharityModal(false);
        getSubStatus({ url: apiUrls.subscriptions.status });
      }
    });
  };

  if (subError || drawError) {
    return (
      <ErrorState 
        onRetry={() => {
          getSubStatus({ url: apiUrls.subscriptions.status });
          getDrawMetrics({ url: apiUrls.draws.upcoming });
        }} 
      />
    );
  }

  const isLoading = subLoading || drawLoading || !subStatus || !drawMetrics;

  const statCards = [
    {
      label: 'Next Draw Pool',
      value: drawMetrics ? `£${drawMetrics.jackpot_amount.toLocaleString()}` : '...',
      change: drawMetrics ? `${drawMetrics.active_entries.toLocaleString()} entries` : '...',
      icon: Trophy,
      color: 'emerald' as const,
    },
    {
      label: 'Total Donated',
      value: subStatus ? `£${subStatus.total_donated.toFixed(2)}` : '...',
      change: 'Lifetime impact',
      icon: Heart,
      color: 'rose' as const,
    },
    {
      label: 'Winnings',
      value: subStatus ? `£${subStatus.total_winnings.toFixed(2)}` : '...',
      change: subStatus?.total_winnings > 0 ? 'Prizes claimed' : 'No prizes yet',
      icon: TrendingUp,
      color: 'blue' as const,
    },
    {
      label: 'Renewal Date',
      value: subStatus?.renewal_date 
        ? new Date(subStatus.renewal_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : '...',
      change: subStatus ? `${subStatus.plan === 'monthly' ? 'Monthly' : 'Yearly'} Plan` : '...',
      icon: Calendar,
      color: 'amber' as const,
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold outfit">Welcome back</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your impact and games this month.</p>
        </div>
        <div className="flex items-center gap-3">
           <CustomButton variant="outline" size="sm">Download Report</CustomButton>
           <Link href="/dashboard/scores">
             <CustomButton size="sm">Enter Score</CustomButton>
           </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
             </div>
          ))
        ) : (
          statCards.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${stat.color}-500/10 text-${stat.color}-500`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-700" />
              </div>
              <div>
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</div>
                <div className="text-2xl font-bold outfit mt-1">{stat.value}</div>
                <div className={`text-[10px] font-bold mt-2 text-${stat.color}-500/80`}>{stat.change}</div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Draw Status */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
             <Trophy className="w-64 h-64 text-emerald-500" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold outfit mb-6 flex items-center gap-2">
              <History className="w-6 h-6 text-emerald-500" />
              Upcoming Prize Draw
            </h2>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                {isLoading ? (
                  <div className="space-y-6">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="text-gray-500 text-sm font-medium mb-2">Draw Date</div>
                      <div className="text-xl font-bold text-white">
                        {new Date(drawMetrics.draw_date).toLocaleDateString('en-GB', {
                          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm font-medium mb-2">Current Entries</div>
                      <div className="text-xl font-bold text-white">
                        {drawMetrics.active_entries.toLocaleString()} Subscribers
                      </div>
                    </div>
                    <CustomButton className="w-full">View My Numbers</CustomButton>
                  </>
                )}
              </div>
              
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-black border border-white/5">
                {isLoading ? (
                  <Skeleton className="h-16 w-32" />
                ) : (
                  <>
                    <div className="text-5xl font-black outfit text-emerald-500 mb-2 uppercase"> LIVE </div>
                    <div className="text-gray-500 text-sm font-bold uppercase tracking-widest">Entry Period Open</div>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-6 overflow-hidden">
                       <div className="h-full w-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Charity Spotlight */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500 to-blue-600 group relative cursor-pointer overflow-hidden">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
              <CustomButton variant="secondary" size="sm" onClick={() => setShowCharityModal(true)}>Manage Selection</CustomButton>
           </div>
           
           <div className="relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 mb-6">
                 <Heart className="text-emerald-500 w-6 h-6 fill-current" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">My Charity</h3>
              
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48 bg-white/10" />
                  <Skeleton className="h-12 w-full bg-white/10" />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold outfit text-white mb-4">
                    {subStatus.charity?.name || 'Loading...'}
                  </h2>
                  <p className="text-white/70 text-sm leading-relaxed mb-auto">
                    {subStatus.charity?.description || 'Your performance directly supports global initiatives.'}
                  </p>
                  
                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                     <div>
                        <div className="text-xl font-bold text-white">{subStatus.percentage}%</div>
                        <div className="text-[10px] text-white/50 uppercase font-bold">Contribution</div>
                     </div>
                     <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-emerald-600 bg-white/20" />
                        ))}
                     </div>
                  </div>
                </>
              )}
           </div>
        </div>
      </div>

      {/* Charity Management Modal */}
      <AnimatePresence>
        {showCharityModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm"
              onClick={() => setShowCharityModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl max-h-[90vh] bg-[#050505] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col relative z-10"
            >
               <div className="p-8 border-b border-white/5 flex items-center justify-between">
                  <div>
                     <h2 className="text-2xl font-extrabold outfit">Impact Settings</h2>
                     <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Manage your charity and contribution</p>
                  </div>
                  <button 
                    onClick={() => setShowCharityModal(false)}
                    className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 hover:text-white transition-all shadow-inner"
                  >
                    <X className="w-5 h-5" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-8 space-y-12">
                  {/* Step 1: Charity Selection */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <Heart className="w-4 h-4 text-emerald-500" />
                       1. Select Your Cause
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {charities?.map((charity: any) => (
                         <CharityCard 
                          key={charity.id}
                          charity={charity}
                          selected={selectedCharityId === charity.id}
                          onSelect={setSelectedCharityId}
                         />
                       ))}
                       {!charities && [...Array(3)].map((_, i) => (
                         <div key={i} className="h-48 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />
                       ))}
                    </div>
                  </div>

                  {/* Step 2: Percentage Selection */}
                  <div className="space-y-6 pt-6 border-t border-white/5">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <Percent className="w-4 h-4 text-emerald-500" />
                       2. Contribution Level (Min 10%)
                    </h3>
                    
                    <div className="flex items-center gap-8 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                       <div className="flex-1 space-y-4">
                          <input 
                            type="range" 
                            min="10" 
                            max="50" 
                            step="5"
                            value={percentage}
                            onChange={(e) => setPercentage(parseInt(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                          />
                          <div className="flex justify-between text-[10px] font-black text-gray-600 uppercase tracking-widest">
                             <span>10% (Standard)</span>
                             <span>25%</span>
                             <span>50% (Legacy)</span>
                          </div>
                       </div>
                       <div className="w-24 h-24 rounded-2xl bg-black border border-emerald-500/20 flex flex-col items-center justify-center">
                          <span className="text-3xl font-black text-emerald-500 outfit">{percentage}%</span>
                          <span className="text-[8px] font-bold text-gray-500 uppercase">Share</span>
                       </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed italic">
                      Increasing your contribution level direct more impact to your chosen cause without increasing your monthly subscription fee.
                    </p>
                  </div>
               </div>

               <div className="p-8 bg-white/[0.01] border-t border-white/5 flex items-center justify-end gap-4">
                  <CustomButton variant="outline" onClick={() => setShowCharityModal(false)}>Cancel</CustomButton>
                  <CustomButton 
                    loading={updatingCharity} 
                    onClick={handleUpdateCharity}
                    className="px-12"
                  >
                    Save Changes
                  </CustomButton>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
