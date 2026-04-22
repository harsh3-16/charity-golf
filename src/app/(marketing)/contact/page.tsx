'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin } from 'lucide-react';
import { CustomButton } from '@/components/shared/CustomButton';

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-black pt-40 pb-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold outfit mb-6"
          >
            Get in <span className="text-emerald-500">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Have questions about your impact, subscription, or draws? Our team is here to help.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-start max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Email Us</h3>
                <p className="text-gray-400 mb-2">For general inquiries and support:</p>
                <a href="mailto:support@charitygolf.com" className="text-emerald-400 font-bold hover:underline">support@charitygolf.com</a>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Live Chat</h3>
                <p className="text-gray-400 mb-4">Available Mon-Fri, 9am - 5pm GMT.</p>
                <CustomButton variant="outline" size="sm">Open Chat</CustomButton>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-gray-400 flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Our Office</h3>
                <p className="text-gray-400">123 Green Lane, Golf City, UK</p>
              </div>
            </div>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest px-2">Your Name</label>
              <input type="text" placeholder="John Doe" className="w-full bg-black border border-white/10 rounded-2xl p-4 focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest px-2">Email Address</label>
              <input type="email" placeholder="john@example.com" className="w-full bg-black border border-white/10 rounded-2xl p-4 focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest px-2">Message</label>
              <textarea placeholder="How can we help?" rows={4} className="w-full bg-black border border-white/10 rounded-2xl p-4 focus:border-emerald-500 outline-none transition-all" />
            </div>
            <CustomButton className="w-full h-16 text-lg">Send Message</CustomButton>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
