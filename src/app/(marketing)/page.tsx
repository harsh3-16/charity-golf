'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Trophy, Target, ArrowRight, Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CustomButton } from '@/components/shared/CustomButton';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8"
          >
            <Heart className="w-4 h-4 fill-current" aria-hidden="true" />
            <span>Over £120,450 donated this month</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold outfit tracking-tight leading-tight mb-8"
          >
            Play Golf.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
              Change Lives.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            The world's first subscription-based golf community where your performance yields impact.
            Enter your scores, win monthly prize draws, and support charities that matter.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <Link href="/signup">
              <CustomButton size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Start Your Impact
              </CustomButton>
            </Link>
            <Link href="/how-it-works">
              <CustomButton variant="outline" size="lg">
                See How it Works
              </CustomButton>
            </Link>
          </motion.div>

          {/* Live Pool Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm max-w-3xl mx-auto"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div>
                <span className="text-gray-500 text-sm uppercase tracking-widest font-bold">
                  Estimated Jackpot
                </span>
                <div className="text-4xl md:text-6xl font-extrabold outfit mt-2 text-white">
                  £15,240<span className="text-emerald-500 animate-pulse text-3xl md:text-4xl ml-2">.00</span>
                </div>
              </div>
              <div className="h-px w-full md:h-12 md:w-px bg-white/10" />
              <div>
                <span className="text-gray-500 text-sm uppercase tracking-widest font-bold">Next Draw</span>
                <div className="text-2xl md:text-3xl font-bold outfit mt-2 text-white">
                  12 Days : 14h : 22m
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold outfit mb-4">Simple Steps, Huge Impact</h2>
            <p className="text-gray-400">Join the movement in three easy steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Star className="w-8 h-8 text-emerald-400" aria-hidden="true" />,
                title: '1. Subscribe',
                desc: 'Join the community for £10/month. 10% goes directly to your chosen charity from second one.',
              },
              {
                icon: <Target className="w-8 h-8 text-blue-400" aria-hidden="true" />,
                title: '2. Track Scores',
                desc: 'Enter your latest 5 Stableford scores. Our engine uses these to generate the monthly winning numbers.',
              },
              {
                icon: <Trophy className="w-8 h-8 text-emerald-500" aria-hidden="true" />,
                title: '3. Win & Give',
                desc: 'Match your scores with the monthly draw to win huge cash prizes. Every win increases the charity pot.',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="relative p-8 rounded-2xl bg-black border border-white/5 hover:border-emerald-500/30 transition-colors group"
              >
                <div className="mb-6">{step.icon}</div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Charity */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold outfit mb-4">
                This Month's Featured Charity
              </h2>
              <p className="text-gray-400 text-lg">
                Every month we spotlight a partner making a difference in the world of sports and community development.
              </p>
            </div>
            <Link
              href="/charities"
              className="text-emerald-400 font-semibold hover:text-emerald-300 flex items-center gap-2 mb-2"
            >
              View all charities <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-[16/9] rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 relative">
              <Image
                src="https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2070&auto=format&fit=crop"
                alt="Golfer on the course during a charity event"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 mb-4">
                <Target className="text-black w-8 h-8" aria-hidden="true" />
              </div>
              <h3 className="text-3xl font-bold outfit">The Golf Foundation</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                The Golf Foundation is a charity that helps young people from all backgrounds enjoy the personal
                and social benefits of golf. Through their 'Golf Rocks' and 'Tri-Golf' initiatives, they've
                introduced over 500,000 children to the game this year alone.
              </p>
              <div className="flex items-center gap-8 py-6 border-y border-white/5">
                <div>
                  <div className="text-2xl font-bold outfit mb-1">£50,000+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Raised</div>
                </div>
                <div>
                  <div className="text-2xl font-bold outfit mb-1">12,400</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Kids Impacted</div>
                </div>
              </div>
              <CustomButton variant="outline">Learn More about Foundation</CustomButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
