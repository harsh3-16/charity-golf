'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { CustomButton } from '@/components/shared/CustomButton';
import { usePostQuery } from '@/hooks/useApi';
import { apiUrls } from '@/lib/apiUrls';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { postQuery, loading } = usePostQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await postQuery({
        url: apiUrls.auth.forgotPassword || '/api/auth/forgot-password',
        body: data,
        onSuccess: () => {
          setIsSubmitted(true);
        },
      });
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white font-medium mb-12 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h1 className="text-3xl font-extrabold outfit">Check Your Email</h1>
              <p className="text-gray-400 leading-relaxed">
                We've sent a password reset link to your inbox. Please follow the instructions to reset your password.
              </p>
              <Link href="/login" className="block pt-4">
                <CustomButton variant="outline" className="w-full">
                  Return to Sign In
                </CustomButton>
              </Link>
            </motion.div>
          ) : (
            <>
              <h1 className="text-4xl font-extrabold outfit mb-2">Forgot Password?</h1>
              <p className="text-gray-400 mb-10">Enter your email and we'll send you a link to reset your password.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="email" 
                      placeholder="tiger@golf.com"
                      className={`w-full bg-white/[0.03] border rounded-2xl py-4 pl-12 pr-4 focus:outline-none transition-all font-medium text-white ${
                        errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-blue-500/50'
                      }`}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="flex items-center gap-1.5 text-red-400 text-xs font-medium ml-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <CustomButton 
                  type="submit" 
                  className="w-full" 
                  loading={loading}
                >
                  Send Reset Link
                </CustomButton>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
