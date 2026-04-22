'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Globe, Calendar, ArrowLeft, Target, Award, Users } from 'lucide-react';
import Link from 'next/link';
import { useGetQuery } from '@/hooks/useApi';
import { apiUrls } from '@/lib/apiUrls';
import { CustomButton } from '@/components/shared/CustomButton';
import { Skeleton } from '@/components/shared/Skeleton';
import { ErrorState } from '@/components/shared/ErrorState';

export default function CharityProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const { data: charity, loading, error, getQuery } = useGetQuery();

  useEffect(() => {
    getQuery({ url: apiUrls.charities.get(id) });
  }, [id, getQuery]);

  if (error) {
    return <ErrorState onRetry={() => getQuery({ url: apiUrls.charities.get(id) })} />;
  }

  if (loading || !charity) {
    return (
      <div className="min-h-screen bg-black pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <Skeleton className="h-8 w-32" />
          <div className="grid lg:grid-cols-2 gap-16">
            <Skeleton className="aspect-video rounded-3xl" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="pt-40 pb-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Link href="/charities" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-widest text-[10px] mb-12 transition-all group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Directory
          </Link>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Image Section */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[4/3] lg:aspect-square rounded-[3rem] overflow-hidden border border-white/10 group"
            >
              <img 
                src={charity.image_url || 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=2076&auto=format&fit=crop'} 
                alt={charity.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {charity.is_featured && (
                <div className="absolute top-8 left-8 px-4 py-1.5 bg-emerald-500 text-black text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-xl">
                  Featured Partner
                </div>
              )}

              <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                <div className="flex gap-4">
                  <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-center">
                    <div className="text-xl font-black text-white outfit">10%</div>
                    <div className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Base Share</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-center">
                    <div className="text-xl font-black text-white outfit">50k+</div>
                    <div className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">Lives Impacted</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content Section */}
            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg">
                    <Target className="text-black w-6 h-6" />
                  </div>
                  <h1 className="text-4xl md:text-6xl font-extrabold outfit tracking-tight">{charity.name}</h1>
                </div>
                
                <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                  {charity.description || 'Dedicated to creating sustainable impact and fostering growth in communities through focused initiatives and global partnerships.'}
                </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <Link href={charity.website || '#'} target="_blank" className="flex items-center gap-3 p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group">
                  <Globe className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-white">Official Website</span>
                </Link>
                <div className="flex items-center gap-3 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                  <Award className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-bold text-white">Verified Partner</span>
                </div>
              </div>

              <div className="pt-10 border-t border-white/5">
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-8">Upcoming Events & Golf Days</h3>
                <div className="space-y-4">
                  {charity.upcoming_events && charity.upcoming_events.length > 0 ? (
                    charity.upcoming_events.map((event: any, idx: number) => (
                      <div key={idx} className="p-6 rounded-3xl bg-emerald-500/[0.02] border border-emerald-500/10 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex flex-col items-center justify-center">
                            <span className="text-xs font-black text-emerald-500 leading-none">MAY</span>
                            <span className="text-xl font-black text-emerald-500">22</span>
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">{event.name || 'Charity Invitational'}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              {event.location || 'Wentworth Club, Surrey'}
                            </div>
                          </div>
                        </div>
                        <CustomButton variant="outline" size="sm">Register</CustomButton>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 rounded-[2rem] border border-dashed border-white/10 text-center">
                       <Calendar className="w-8 h-8 text-gray-700 mx-auto mb-4" />
                       <p className="text-gray-500 text-sm font-medium">No upcoming events scheduled.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link href="/signup" className="flex-1">
                  <CustomButton className="w-full h-16 text-lg font-black" rightIcon={<ArrowLeft className="rotate-180 w-5 h-5" />}>
                    Select this Charity
                  </CustomButton>
                </Link>
                <CustomButton variant="outline" className="flex-1 h-16 text-lg font-bold border-white/10 hover:bg-white/5">
                   Make One-time Donation
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <section className="py-24 bg-white/[0.01] border-y border-white/5 px-6">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Users className="w-6 h-6" />, label: "Active Donors", value: "1,240" },
              { icon: <Heart className="w-6 h-6" />, label: "Total Raised", value: "£124,500" },
              { icon: <Award className="w-6 h-6" />, label: "Global Reach", value: "12 Countries" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                    {stat.icon}
                 </div>
                 <div className="text-4xl font-black outfit text-white mb-1">{stat.value}</div>
                 <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
}
