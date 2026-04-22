'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-black pt-40 pb-24 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 md:p-20"
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-8">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold outfit mb-10">Privacy Policy</h1>
          
          <div className="space-y-8 prose prose-invert max-w-none text-gray-400">
            <p>Your privacy is paramount. We only collect the data necessary to provide our service and track your impact on charities.</p>
            
            <section>
              <h2 className="text-xl font-bold text-white mb-4">What We Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Basic identification (Name, Email)</li>
                <li>Golf performance data (Stableford Scores)</li>
                <li>Payment information (Processed securely via Stripe)</li>
                <li>Charity preferences</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-white mb-4">How We Use It</h2>
              <p>We use your data to calculate draw entries, process donations, and improve the Charity Golf experience. We never sell your data to third parties.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
