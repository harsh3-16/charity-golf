'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Wallet, 
  Heart, 
  Trophy, 
  ArrowUpRight, 
  BadgeCheck,
  TrendingUp,
  Clock,
  Loader2
} from 'lucide-react';
import { useGetQuery } from '@/hooks/useApi';
import { apiUrls } from '@/lib/apiUrls';
import { Skeleton } from '@/components/shared/Skeleton';
import { ErrorState } from '@/components/shared/ErrorState';

export default function AdminOverviewPage() {
  const { data: stats, loading: statsLoading, error: statsError, getQuery: getStats } = useGetQuery();
  const { data: revenue, loading: revenueLoading, getQuery: getRevenue } = useGetQuery();
  const { data: charityStats, loading: charityLoading, getQuery: getCharityStats } = useGetQuery();

  useEffect(() => {
    const controller = new AbortController();
    getStats({ url: apiUrls.admin.stats, signal: controller.signal });
    getRevenue({ url: apiUrls.admin.revenue, signal: controller.signal });
    getCharityStats({ url: apiUrls.admin.charityStats, signal: controller.signal });
    return () => controller.abort();
  }, [getStats, getRevenue, getCharityStats]);

  if (statsError) {
    return <ErrorState onRetry={() => {
      getStats({ url: apiUrls.admin.stats });
      getRevenue({ url: apiUrls.admin.revenue });
      getCharityStats({ url: apiUrls.admin.charityStats });
    }} />;
  }

  const statCards = [
    {
      label: 'Total Active Users',
      value: stats?.activeSubs.toLocaleString() || '0',
      change: `${stats?.totalUsers.toLocaleString()} registered`,
      trend: 'up',
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Current Prize Pool',
      value: `£${(stats?.prizePool || 0).toLocaleString()}`,
      change: 'Active Draw',
      trend: 'up',
      icon: Trophy,
      color: 'emerald',
    },
    {
      label: 'Total Charity Split',
      value: `£${(stats?.charityPaid || 0).toLocaleString()}`,
      change: 'Lifetime impact',
      trend: 'up',
      icon: Heart,
      color: 'rose',
    },
    {
      label: 'Pending Verifications',
      value: stats?.pendingVerifications.toString() || '0',
      change: 'Requires review',
      trend: 'neutral',
      icon: BadgeCheck,
      color: 'amber',
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold outfit">Platform Overview</h1>
          <p className="text-gray-500 mt-1">Real-time performance metrics and platform health.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              <Clock className="w-4 h-4 text-blue-500" />
              Last sync: {stats?.lastSync ? new Date(stats.lastSync).toLocaleTimeString() : '...'}
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading || !stats ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-[2rem]" />)
        ) : (
          statCards.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col gap-4 group hover:border-blue-500/20 transition-all pointer-events-none"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${stat.color}-500/10 text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <div>
                <div className="text-gray-600 text-[10px] font-black uppercase tracking-widest">{stat.label}</div>
                <div className="text-3xl font-black outfit mt-1">{stat.value}</div>
                <div className={`text-[11px] font-bold mt-2 ${stat.trend === 'up' ? 'text-emerald-500' : 'text-blue-500'}`}>
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Subscription Revenue */}
        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold outfit">Subscription Revenue</h2>
              {revenueLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
           </div>
           
           <div className="h-64 flex items-end gap-2 px-2">
              {revenueLoading || !revenue ? (
                <div className="w-full h-full flex items-center justify-center">
                   <Skeleton className="w-full h-full rounded-2xl" />
                </div>
              ) : (
                revenue.chartData.map((m: any, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.min(100, (m.value / (revenue.mrr * 10 || 1)) * 100)}%` }}
                      transition={{ delay: i * 0.1, duration: 1 }}
                      className="w-full bg-gradient-to-t from-blue-500/20 to-blue-500 rounded-t-lg relative group min-h-[4px]"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                          £{m.value.toLocaleString()}
                      </div>
                    </motion.div>
                    <span className="text-[10px] text-gray-700 font-bold">{m.label}</span>
                  </div>
                ))
              )}
           </div>
           
           <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                 <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Monthly Recurring Revenue</div>
                 <div className="text-xl font-bold outfit">£{(revenue?.mrr || 0).toLocaleString()}.00</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                 <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Projected Yearly</div>
                 <div className="text-xl font-bold outfit">£{(revenue?.yearlyRevenue || 0).toLocaleString()}.00</div>
              </div>
           </div>
        </div>

        {/* Charity Distribution */}
        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col min-h-[450px]">
           <h2 className="text-xl font-bold outfit mb-8">Charity Split</h2>
           
           <div className="space-y-6 flex-1">
              {charityLoading || !charityStats ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)
              ) : charityStats.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm italic">
                   No active contributions yet.
                </div>
              ) : (
                charityStats.map((charity: any, idx: number) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-gray-400">{charity.name}</span>
                        <span className="text-sm font-bold text-white">{charity.amount} ({charity.perc}%)</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${charity.perc}%` }}
                          transition={{ delay: idx * 0.1, duration: 1 }}
                          className={`h-full bg-${charity.color}-500 shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                        />
                    </div>
                  </div>
                ))
              )}
           </div>
           
           <div className="mt-8 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-500/80 uppercase">Next Charity Payout</span>
              <span className="text-sm font-black text-white outfit">
                {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
           </div>
        </div>
      </div>
    </div>
  );
}
