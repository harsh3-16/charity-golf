'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Info, CheckCircle2, Save } from 'lucide-react';
import { CustomButton } from '@/components/shared/CustomButton';
import { CharityCard } from '@/components/shared/CharityCard';

const MOCK_CHARITIES = [
  {
    id: '1',
    name: 'The Golf Foundation',
    description: 'Helping young people from all backgrounds enjoy the personal and social benefits of golf.',
    image_url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Cancer Research UK',
    description: 'The world’s leading cancer charity dedicated to saving lives through research.',
    image_url: 'https://images.unsplash.com/photo-1579152276511-73678224c581?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'British Heart Foundation',
    description: 'Funding research to keep hearts beating and blood flowing.',
    image_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Macmillan Cancer Support',
    description: 'Providing physical, financial and emotional support for people with cancer.',
    image_url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop',
  }
];

export default function CharityDashboardPage() {
  const [selectedId, setSelectedId] = useState('1');
  const [contribution, setContribution] = useState(10);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold outfit">Charity Selection</h1>
          <p className="text-gray-500 mt-1">Choose the cause your subscription supports and adjust your contribution.</p>
        </div>
        <CustomButton 
          onClick={handleSave} 
          loading={isSaving}
          leftIcon={showSuccess ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          className={showSuccess ? "bg-emerald-500 text-black" : ""}
        >
          {showSuccess ? "Settings Saved" : "Save Changes"}
        </CustomButton>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {MOCK_CHARITIES.map(charity => (
              <CharityCard 
                key={charity.id}
                charity={charity}
                selected={selectedId === charity.id}
                onSelect={(id) => setSelectedId(id)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
               <Heart className="w-32 h-32 text-emerald-500" />
            </div>

            <div className="relative z-10">
              <h2 className="text-xl font-bold outfit mb-2">Contribution Level</h2>
              <p className="text-gray-500 text-sm">Every subscription is split by default: 70% Ops, 20% Prizes, 10% Charity. You can increase the charity share below.</p>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-end mb-4">
                 <div className="text-gray-400 text-sm font-bold uppercase tracking-wider">Your Share</div>
                 <div className="text-4xl font-black outfit text-emerald-500">{contribution}%</div>
              </div>
              
              <input 
                type="range" 
                min="10" 
                max="50" 
                step="5"
                className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500"
                value={contribution}
                onChange={(e) => setContribution(parseInt(e.target.value))}
              />
              
              <div className="flex justify-between text-[10px] font-bold text-gray-600 uppercase tracking-widest px-1">
                 <span>10% (Min)</span>
                 <span>50% (Max)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3 relative z-10">
               <Info className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
               <p className="text-xs text-emerald-500/80 leading-relaxed font-medium">
                 Increasing your percentage will directly decrease the platform's operation share. The prize pool remains unaffected.
               </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 border border-white/5 space-y-4">
             <div className="text-3xl font-black outfit text-white">Monthly Impact</div>
             <div className="space-y-3">
                <div className="flex justify-between text-sm">
                   <span className="text-gray-400">Subscription Fee</span>
                   <span className="text-white font-bold">£10.00</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-gray-400">To {MOCK_CHARITIES.find(c => c.id === selectedId)?.name}</span>
                   <span className="text-emerald-400 font-bold">£{(10 * contribution / 100).toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-white/5 flex justify-between text-sm">
                   <span className="text-gray-400">Prize Pool Contribution</span>
                   <span className="text-white font-bold">£2.00</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
