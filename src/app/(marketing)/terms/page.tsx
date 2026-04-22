'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-black pt-40 pb-24 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 md:p-20"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-8">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold outfit mb-10">Terms of Service</h1>
          
          <div className="space-y-8 prose prose-invert max-w-none text-gray-400">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using Charity Golf, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. Subscription & Donations</h2>
              <p>Your £10 monthly subscription is split between operational costs, prize pools, and your chosen charity. Donations are processed through our partner platform and are non-refundable.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. Score Verification</h2>
              <p>All scores submitted must be accurate and verifiable. Fraudulent score entry will result in immediate account termination and forfeiture of any potential winnings.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">4. Prize Draws</h2>
              <p>Winners are selected based on our algorithmic matching engine. All decisions are final. Winners must provide verification proof before prizes are disbursed.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
