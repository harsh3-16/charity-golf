'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { CustomButton } from '@/components/shared/CustomButton';
import { usePostQuery } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/shared/Toast';

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const { postQuery, loading } = usePostQuery();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await postQuery({
        url: '/api/auth/reset-password',
        body: { password: data.password },
        onSuccess: () => {
          setIsSuccess(true);
          toast.success('Password reset successfully!');
        },
      });
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h1 className="text-3xl font-extrabold outfit">Password Reset</h1>
              <p className="text-gray-400 leading-relaxed">
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
              <Link href="/login" className="block pt-4">
                <CustomButton className="w-full">
                  Sign In
                </CustomButton>
              </Link>
            </motion.div>
          ) : (
            <>
              <h1 className="text-4xl font-extrabold outfit mb-2">Reset Password</h1>
              <p className="text-gray-400 mb-10">Please enter your new password below.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className={`w-full bg-white/[0.03] border rounded-2xl py-4 pl-12 pr-4 focus:outline-none transition-all font-medium text-white ${
                        errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-emerald-500/50'
                      }`}
                      {...register('password')}
                    />
                  </div>
                  {errors.password && (
                    <p className="flex items-center gap-1.5 text-red-400 text-xs font-medium ml-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 ml-1">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className={`w-full bg-white/[0.03] border rounded-2xl py-4 pl-12 pr-4 focus:outline-none transition-all font-medium text-white ${
                        errors.confirmPassword ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-emerald-500/50'
                      }`}
                      {...register('confirmPassword')}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="flex items-center gap-1.5 text-red-400 text-xs font-medium ml-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <CustomButton 
                  type="submit" 
                  className="w-full" 
                  loading={loading}
                >
                  Update Password
                </CustomButton>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
