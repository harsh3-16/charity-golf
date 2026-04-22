'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Trophy, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CustomButton } from '@/components/shared/CustomButton';
import Link from 'next/link';

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <Target className="w-10 h-10 text-emerald-500" />,
      title: "Play Your Game",
      description: "Play your regular rounds of golf at any course. Keep track of your Stableford scores.",
      details: ["Standard Stableford rules", "Verified course ratings", "Any course worldwide"]
    },
    {
      icon: <Heart className="w-10 h-10 text-blue-500" />,
      title: "Submit & Support",
      description: "Enter your latest 5 scores. 10% of your subscription goes directly to your chosen charity.",
      details: ["Choose from 50+ charities", "Track your total impact", "Rolling 5-score average"]
    },
    {
      icon: <Trophy className="w-10 h-10 text-emerald-400" />,
      title: "Win Monthly Prizes",
      description: "Your scores are matched against our algorithmic draw. Match 3, 4, or 5 to win.",
      details: ["Automated prize distribution", "Verified winner verification", "Huge jackpots every month"]
    }
  ];

  return (
    <div className="relative min-h-screen bg-black pt-40 pb-24 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold outfit mb-6"
          >
            How it <span className="text-emerald-500">Works</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            A simple system designed to reward your performance while making a massive difference in the world.
          </motion.p>
        </div>

        <div className="space-y-24">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16`}
            >
              <div className="flex-1 space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8">
                  {step.icon}
                </div>
                <h2 className="text-4xl font-bold outfit">{step.title}</h2>
                <p className="text-gray-400 text-xl leading-relaxed">{step.description}</p>
                <ul className="space-y-4 pt-4">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-400">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full aspect-video rounded-[2.5rem] bg-gradient-to-tr from-white/[0.02] to-transparent border border-white/5 flex items-center justify-center group">
                 <div className="text-6xl font-black outfit text-white/5 group-hover:text-emerald-500/10 transition-colors">
                    STEP 0{idx + 1}
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 p-12 rounded-[3rem] bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 text-center"
        >
          <h2 className="text-4xl font-bold outfit mb-6">Ready to play with purpose?</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">Join our community today and start tracking your impact on the course.</p>
          <Link href="/signup">
            <CustomButton size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
               Get Started Now
            </CustomButton>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
