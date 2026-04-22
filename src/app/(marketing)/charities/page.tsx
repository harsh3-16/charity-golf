'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CustomButton } from '@/components/shared/CustomButton';
import { CharityCard } from '@/components/shared/CharityCard';
import { useGetQuery } from '@/hooks/useApi';
import { apiUrls } from '@/lib/apiUrls';

export default function CharitiesPage() {
  const { loading, data: charities, getQuery } = useGetQuery();

  useEffect(() => {
    getQuery({ url: apiUrls.charities.list });
  }, [getQuery]);

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="pt-40 pb-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Partnered with over 50+ Global Charities</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-extrabold outfit tracking-tight leading-tight mb-8"
            >
              Our Partner{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                Charities
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-lg md:text-xl leading-relaxed"
            >
              Every time you play, you contribute. Choose a cause that resonates with you 
              and watch your performance turn into real-world impact.
            </motion.p>
          </div>

          {/* Charity Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-[320px] rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {charities?.map((charity: any) => (
                <motion.div
                  key={charity.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <CharityCard charity={charity} />
                </motion.div>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-32 p-12 rounded-[2.5rem] bg-gradient-to-tr from-emerald-500/10 via-black to-blue-500/10 border border-white/5 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Heart className="w-64 h-64 text-emerald-500" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black outfit mb-6 relative z-10">Ready to Make an Impact?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 relative z-10">
              Join thousands of golfers who are already changing lives through their game. 
              One subscription, infinite impact.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link href="/signup">
                <CustomButton size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Join the Community
                </CustomButton>
              </Link>
              <Link href="/how-it-works">
                <CustomButton variant="outline" size="lg">
                  See How it Works
                </CustomButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
