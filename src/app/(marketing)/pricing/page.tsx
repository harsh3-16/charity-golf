'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Target, Star, Trophy } from 'lucide-react';
import { CustomButton } from '@/components/shared/CustomButton';
import Link from 'next/link';

const PLANS = [
  {
    name: "Monthly Impact",
    price: "10",
    period: "month",
    description: "Perfect for regular golfers who want to make a difference.",
    features: [
      "Access to All Draws",
      "Choose Your Charity",
      "Verified Score Tracking",
      "Interactive Dashboard",
      "10% Direct Donation"
    ],
    cta: "Start Monthly",
    popular: true
  },
  {
    name: "Annual Legacy",
    price: "100",
    period: "year",
    description: "The best value for committed players making deep impact.",
    features: [
      "2 Months Free",
      "Priority Winner Verification",
      "Exclusive Annual Badges",
      "Quarterly Impact Reports",
      "Priority Support"
    ],
    cta: "Start Annual",
    popular: false
  }
];

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-black pt-40 pb-24 px-6 overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold outfit mb-6"
          >
            Invest in your <span className="text-emerald-500">Game & Impact</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Simple pricing with no hidden fees. Choose your contribution level and join the movement.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.2 }}
              className={`relative p-10 rounded-[2.5rem] border ${plan.popular ? 'border-emerald-500 bg-emerald-500/[0.03]' : 'border-white/5 bg-white/[0.02]'} flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full uppercase tracking-widest">
                   Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold outfit mb-2">{plan.name}</h2>
                <div className="flex items-baseline gap-1 mb-4">
                   <span className="text-5xl font-black outfit">£{plan.price}</span>
                   <span className="text-gray-500 font-medium">/{plan.period}</span>
                </div>
                <p className="text-gray-500 text-sm">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                     <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-500" />
                     </div>
                     {feature}
                  </div>
                ))}
              </div>

              <Link href="/signup">
                <CustomButton 
                  className="w-full" 
                  variant={plan.popular ? 'primary' : 'outline'}
                >
                  {plan.cta}
                </CustomButton>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { icon: <Target className="w-6 h-6" />, label: "Score Accuracy", value: "99.9%" },
             { icon: <Star className="w-6 h-6" />, label: "Active Members", value: "12,400+" },
             { icon: <Trophy className="w-6 h-6" />, label: "Paid Winnings", value: "£420k+" },
           ].map((stat, i) => (
             <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
                   {stat.icon}
                </div>
                <div className="text-3xl font-bold outfit mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm uppercase tracking-widest font-bold">{stat.label}</div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
