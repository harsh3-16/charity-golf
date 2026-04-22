'use client';

import React, { useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Shield, 
  CreditCard, 
  Mail, 
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { CustomButton } from '@/components/shared/CustomButton';
import { useGetQuery } from '@/hooks/useApi';
import { apiUrls } from '@/lib/apiUrls';
import { Skeleton } from '@/components/shared/Skeleton';
import { ErrorState } from '@/components/shared/ErrorState';

export default function AdminUsersPage() {
  const { data: users, loading, error, getQuery } = useGetQuery();

  useEffect(() => {
    getQuery({ url: apiUrls.admin.usersList });
  }, [getQuery]);

  if (error) {
    return <ErrorState onRetry={() => getQuery({ url: apiUrls.admin.usersList })} />;
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold outfit">User Management</h1>
          <p className="text-gray-500 mt-1">View and manage all registered subscribers and administrators.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-all text-white w-64"
              />
           </div>
           <CustomButton variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Filter</CustomButton>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01]">
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">User</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Role & Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Subscription</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Impact Cause</th>
              <th className="px-8 py-5 text-right text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                   <td className="px-8 py-6"><Skeleton className="h-10 w-48" /></td>
                   <td className="px-8 py-6"><Skeleton className="h-10 w-32" /></td>
                   <td className="px-8 py-6"><Skeleton className="h-10 w-32" /></td>
                   <td className="px-8 py-6"><Skeleton className="h-10 w-40" /></td>
                   <td className="px-8 py-6 text-right"><Skeleton className="h-10 w-10 ml-auto" /></td>
                </tr>
              ))
            ) : (
              users?.map((user: any) => (
                <tr key={user.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-500 text-xs">
                          {user.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-white mb-0.5">{user.full_name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                             <Mail className="w-3 h-3" /> {user.email}
                          </div>
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-2">
                       <div className="flex items-center gap-2">
                          <Shield className={`w-3.5 h-3.5 ${user.role === 'admin' ? 'text-blue-500' : 'text-gray-500'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'text-blue-500' : 'text-gray-500'}`}>
                             {user.role}
                          </span>
                       </div>
                       <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                         user.subscription_status === 'active' 
                           ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                           : 'bg-red-500/10 text-red-500 border-red-500/20'
                       }`}>
                          {user.subscription_status === 'active' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                          {user.subscription_status}
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                       <div className="text-sm font-bold text-white flex items-center gap-2">
                          <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                          {user.subscription_plan ? (user.subscription_plan.charAt(0).toUpperCase() + user.subscription_plan.slice(1)) : 'None'}
                       </div>
                       {user.subscription_renewal_date && (
                         <div className="text-[10px] text-gray-500 flex items-center gap-1 font-medium">
                            <Calendar className="w-3 h-3" />
                            Renews {new Date(user.subscription_renewal_date).toLocaleDateString()}
                         </div>
                       )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                       <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{user.charities?.name || 'Not Selected'}</div>
                       <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> {user.charity_contribution_percentage || 10}% Contribution
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 rounded-lg bg-white/5 text-gray-600 hover:text-white transition-all">
                       <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
