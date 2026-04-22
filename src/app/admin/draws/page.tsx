'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dice5, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Trophy,
  History,
  Settings2,
  Table as TableIcon
} from 'lucide-react';
import { CustomButton } from '@/components/shared/CustomButton';
import { usePostQuery } from '@/hooks/useApi';
import { apiUrls } from '@/lib/apiUrls';
import { toast } from '@/components/shared/Toast';

export default function AdminDrawsPage() {
  const [mode, setMode] = useState<'random' | 'hot' | 'cold'>('hot');
  const [status, setStatus] = useState<'idle' | 'simulating' | 'simulated' | 'published'>('idle');
  const [simResults, setSimResults] = useState<any>(null);

  const { postQuery: simulateDraw, loading: simulating } = usePostQuery();
  const { postQuery: publishRealDraw, loading: publishing } = usePostQuery();

  const runSimulation = async () => {
    setStatus('simulating');
    const res = await simulateDraw({
      url: apiUrls.draws.simulate,
      body: { mode }
    });
    
    if (res) {
      setSimResults({
        numbers: res.numbers,
        winners: res.winners,
        metrics: res.metrics, // Store raw metrics for publishing
        payouts: {
          jackpot: `£${res.metrics.jackpot.toLocaleString()}`,
          pool4: `£${(res.metrics.pool4match / (res.winners.match4 || 1)).toLocaleString()} each`,
          pool3: `£${(res.metrics.pool3match / (res.winners.match3 || 1)).toLocaleString()} each`,
        },
        totalPool: `£${res.metrics.totalPool.toLocaleString()}`,
        activeSubscribers: res.activeSubscribers
      });
      setStatus('simulated');
    } else {
      setStatus('idle');
    }
  };

  const publishDraw = async () => {
    if (!confirm('Are you sure? This will lock results and notify all users via email.')) return;
    
    const res = await publishRealDraw({
      url: apiUrls.draws.publish,
      body: { 
        numbers: simResults.numbers, 
        metrics: simResults.metrics,
        mode 
      }
    });

    if (res) {
      toast.success('Draw published successfully!');
      setStatus('published');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold outfit">Draw Engine</h1>
          <p className="text-gray-500 mt-1">Configure and execute monthly prize draws based on user performance.</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest">
           April 2026 Cycle
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Configuration */}
        <div className="lg:col-span-1 space-y-6">
           <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8">
              <div className="space-y-4">
                 <h2 className="text-lg font-bold outfit flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-blue-500" />
                    Draw Mode
                 </h2>
                 <div className="grid gap-3">
                    {[
                      { id: 'hot', label: 'HOT Numbers', desc: '5 most frequent scores', icon: TrendingUp },
                      { id: 'cold', label: 'COLD Numbers', desc: '5 least frequent scores', icon: History },
                      { id: 'random', label: 'RANDOM', desc: 'Standard lottery style', icon: Dice5 },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMode(m.id as any)}
                        disabled={status === 'published'}
                        className={`p-4 rounded-2xl border text-left transition-all ${mode === m.id ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-white/5 hover:border-white/20'}`}
                      >
                         <div className="flex items-center gap-3 mb-1">
                            <m.icon className={`w-4 h-4 ${mode === m.id ? 'text-blue-500' : 'text-gray-500'}`} />
                            <span className={`text-sm font-bold ${mode === m.id ? 'text-white' : 'text-gray-400'}`}>{m.label}</span>
                         </div>
                         <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{m.desc}</p>
                      </button>
                    ))}
                 </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-6">
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium">Subscribers</span>
                    <span className="text-white font-bold">12,450</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium">Estimated Pool</span>
                    <span className="text-white font-bold">£15,240.00</span>
                 </div>
                 
                 {status === 'published' ? (
                   <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      <span className="text-sm font-bold text-emerald-500">Results Published</span>
                   </div>
                 ) : (
                   <CustomButton 
                    className="w-full bg-blue-500 hover:bg-blue-400 text-black shadow-[0_0_20px_rgba(59,130,246,0.3)] font-bold py-4"
                    onClick={runSimulation}
                    loading={simulating}
                    disabled={simulating}
                   >
                     {status === 'simulated' ? 'Re-run Simulation' : 'Run Simulation'}
                   </CustomButton>
                 )}
              </div>
           </div>
        </div>

        {/* Results / Simulation */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {status === 'idle' || status === 'simulating' ? (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[400px] rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center justify-center p-12 text-center"
              >
                 <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Play className={`w-8 h-8 ${status === 'simulating' ? 'text-blue-500 animate-pulse' : 'text-gray-700'}`} />
                 </div>
                 <h2 className="text-xl font-bold outfit mb-2">Ready to Simulate?</h2>
                 <p className="text-gray-500 max-w-sm">Choose a draw mode and run the simulation to see potential winners and prize distributions.</p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Drawn Numbers */}
                <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Dice5 className="w-32 h-32 text-blue-500" />
                   </div>
                   <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Simulated Winning Numbers</h3>
                   <div className="flex gap-4">
                      {simResults.numbers.map((num: number, i: number) => (
                        <motion.div 
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1, type: 'spring' }}
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white/10 flex items-center justify-center shadow-xl"
                        >
                           <span className="text-2xl font-black text-black outfit">{num}</span>
                        </motion.div>
                      ))}
                   </div>
                </div>

                {/* Winner Breakdown */}
                <div className="grid md:grid-cols-3 gap-6">
                   {[
                     { label: '5-NUMBER MATCH', count: simResults.winners.match5, pool: simResults.payouts.jackpot, color: 'blue' },
                     { label: '4-NUMBER MATCH', count: simResults.winners.match4, pool: simResults.payouts.pool4, color: 'emerald' },
                     { label: '3-NUMBER MATCH', count: simResults.winners.match3, pool: simResults.payouts.pool3, color: 'amber' },
                   ].map((tier, idx) => (
                     <div key={idx} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">{tier.label}</div>
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-xl bg-${tier.color}-500/10 flex items-center justify-center`}>
                              <Users className={`w-5 h-5 text-${tier.color}-500`} />
                           </div>
                           <div className="text-2xl font-bold outfit">{tier.count} <span className="text-xs font-medium text-gray-600 uppercase">Winners</span></div>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                           <div className="text-xs font-bold text-gray-400 capitalize">Prize: {tier.pool}</div>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="p-8 rounded-[2.5rem] bg-blue-500 text-black flex items-center justify-between">
                   <div>
                      <h3 className="text-2xl font-black outfit">Ready to Lock?</h3>
                      <p className="text-sm font-bold opacity-70">Publishing will finalize results and start winner notifications.</p>
                   </div>
                   <CustomButton 
                    onClick={publishDraw}
                    variant="secondary" 
                    size="lg" 
                    className="px-12 font-black uppercase tracking-widest disabled:opacity-50"
                    loading={publishing}
                    disabled={status === 'published' || publishing}
                   >
                     {status === 'published' ? 'Already Published' : 'Publish Results'}
                   </CustomButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
