'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter,
  Eye,
  MoreVertical,
  Banknote,
  ArrowUpRight
} from 'lucide-react';
import { CustomButton } from '@/components/shared/CustomButton';
import { useGetQuery, usePatchQuery } from '@/hooks/useApi';
import { apiUrls } from '@/lib/apiUrls';
import { toast } from '@/components/shared/Toast';
import { Skeleton } from '@/components/shared/Skeleton';



export default function AdminWinnersPage() {
  const [selectedProof, setSelectedProof] = useState<any>(null);
  const { data: verifications, loading, getQuery } = useGetQuery();
  const { patchQuery: approveWinner, loading: approving } = usePatchQuery();
  const { patchQuery: rejectWinner, loading: rejecting } = usePatchQuery();

  React.useEffect(() => {
    getQuery({ url: apiUrls.winnings.list });
  }, [getQuery]);

  const handleApprove = async (id: string) => {
    await approveWinner({
      url: apiUrls.winnings.approve(id),
      onSuccess: () => {
        toast.success('Winner approved!');
        setSelectedProof(null);
        getQuery({ url: apiUrls.winnings.list });
      }
    });
  };

  const handleReject = async (id: string) => {
    const notes = prompt('Please enter rejection reason:');
    if (notes === null) return;

    await rejectWinner({
      url: apiUrls.winnings.reject(id),
      body: { notes },
      onSuccess: () => {
        toast.success('Winner rejected.');
        setSelectedProof(null);
        getQuery({ url: apiUrls.winnings.list });
      }
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold outfit">Winner Verifications</h1>
          <p className="text-gray-500 mt-1">Review proof of scores and authorize prize payouts.</p>
        </div>
        <div className="flex items-center gap-3">
           <CustomButton variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Filter</CustomButton>
           <CustomButton size="sm" leftIcon={<Banknote className="w-4 h-4" />}>Process Batch Payout</CustomButton>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01]">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">User / Draw</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Tier / Amount</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Submission</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                   <td className="px-8 py-6"><Skeleton className="h-10 w-48" /></td>
                   <td className="px-8 py-6"><Skeleton className="h-10 w-32" /></td>
                   <td className="px-8 py-6"><Skeleton className="h-10 w-24" /></td>
                   <td className="px-8 py-6"><Skeleton className="h-8 w-24 rounded-full" /></td>
                   <td className="px-8 py-6 text-right"><Skeleton className="h-10 w-24 ml-auto" /></td>
                </tr>
              ))
            ) : (
              verifications?.map((win: any) => (
                <tr key={win.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-500 text-xs">
                          {win.users?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-white mb-1">{win.users?.full_name}</div>
                          <div className="text-[10px] uppercase font-bold text-gray-600 tracking-wider font-mono">
                            {new Date(0, (win.draw_entries?.draws?.month || 1) - 1).toLocaleString('default', { month: 'long' })} {win.draw_entries?.draws?.year} Draw
                          </div>
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                        <div className="font-black text-white hover:text-blue-500 transition-colors cursor-pointer flex items-center gap-2">
                          £{win.draw_entries?.prize_amount?.toLocaleString()}
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{win.draw_entries?.match_count}-Number Match</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setSelectedProof(win)}
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-gray-400 hover:text-blue-500"
                          title="View Proof"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <div className="text-xs font-medium text-gray-500">
                          {new Date(win.submitted_at).toLocaleDateString()}
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {win.admin_status === 'pending' ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black tracking-widest uppercase border border-amber-500/20">
                          <Clock className="w-3 h-3" /> PENDING REVIEW
                      </div>
                    ) : win.admin_status === 'approved' ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black tracking-widest uppercase border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> APPROVED
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black tracking-widest uppercase border border-red-500/20">
                          <XCircle className="w-3 h-3" /> REJECTED
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                        {win.admin_status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(win.id)}
                              className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 transition-all hover:text-black"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleReject(win.id)}
                              className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 transition-all hover:text-white"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button className="p-2 rounded-lg bg-white/5 text-gray-600 hover:text-white">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Proof Preview Modal */}
      <AnimatePresence>
        {selectedProof && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm"
              onClick={() => setSelectedProof(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl max-h-[90vh] bg-[#050505] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col relative z-10"
            >
               <div className="p-10 border-b border-white/5 flex items-center justify-between">
                  <div>
                     <h2 className="text-3xl font-extrabold outfit">{selectedProof.users?.full_name}</h2>
                     <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Proof Verification / {new Date(0, (selectedProof.draw_entries?.draws?.month || 1) - 1).toLocaleString('default', { month: 'long' })} Draw</p>
                  </div>
                  <button 
                    onClick={() => setSelectedProof(null)}
                    className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 hover:text-white transition-all shadow-inner"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-10 bg-black/50">
                  <div className="aspect-[16/10] bg-white rounded-3xl overflow-hidden shadow-2xl relative group">
                     <img 
                      src={selectedProof.proof_screenshot_url} 
                      alt="Proof"
                      className="w-full h-full object-cover"
                     />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <CustomButton variant="secondary" size="sm" leftIcon={<ExternalLink className="w-4 h-4" />}>
                           Open Original
                        </CustomButton>
                     </div>
                  </div>
               </div>

               <div className="p-10 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                  <div className="flex gap-4">
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                        <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Claimed Score</div>
                        <div className="text-xl font-black text-white">{selectedProof.draw_entries?.match_count}-Number Match</div>
                     </div>
                     <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                        <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Submission Date</div>
                        <div className="text-xl font-black text-white">{new Date(selectedProof.submitted_at).toLocaleDateString()}</div>
                     </div>
                  </div>

                  <div className="flex gap-4">
                     {selectedProof.admin_status === 'pending' && (
                       <>
                        <CustomButton 
                          variant="outline" 
                          size="lg" 
                          className="px-12 text-red-500 border-red-500/20 hover:bg-red-500/10"
                          onClick={() => handleReject(selectedProof.id)}
                          loading={rejecting}
                        >
                          Reject Proof
                        </CustomButton>
                        <CustomButton 
                          size="lg" 
                          className="px-12 bg-emerald-500 hover:bg-emerald-400 text-black font-black"
                          onClick={() => handleApprove(selectedProof.id)}
                          loading={approving}
                        >
                          Approve Winner
                        </CustomButton>
                       </>
                     )}
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
