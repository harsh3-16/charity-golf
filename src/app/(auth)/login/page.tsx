'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ArrowLeft, Target, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { CustomButton } from '@/components/shared/CustomButton';
import { toast } from '@/components/shared/Toast';
import { usePostQuery } from '@/hooks/useApi';
import { apiUrls } from '@/lib/apiUrls';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/authSlice';
import { useRouter } from 'next/navigation';

// W9 — Zod schema validates and trims inputs per B4
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { postQuery } = usePostQuery();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await postQuery({ 
        url: apiUrls.auth.login, 
        body: data 
      });

      if (response && response.user) {
        dispatch(setCredentials({ 
          user: response.user, 
          token: response.token 
        }));
        toast.success('Signed in successfully!');
        const targetPath = response.user.role === 'admin' ? '/admin' : '/dashboard';
        router.push(targetPath);
      }
    } catch {
      // toast is automatically fired by the usePostQuery hook on failure
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <Target className="text-black w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold outfit mb-2">Welcome Back</h1>
          <p className="text-gray-400 font-medium leading-relaxed">
            Sign in to track your scores and check your impact.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="login-email" className="text-sm font-semibold text-gray-400 ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="tiger@golf.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'login-email-error' : undefined}
                className={`w-full bg-white/[0.03] border rounded-2xl py-4 pl-12 pr-4 focus:outline-none transition-all font-medium text-white placeholder:text-gray-700 ${
                  errors.email
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-white/5 focus:border-emerald-500/50'
                }`}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p id="login-email-error" role="alert" className="flex items-center gap-1.5 text-red-400 text-xs font-medium ml-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label htmlFor="login-password" className="text-sm font-semibold text-gray-400">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-gray-500 hover:text-emerald-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'login-password-error' : undefined}
                className={`w-full bg-white/[0.03] border rounded-2xl py-4 pl-12 pr-4 focus:outline-none transition-all font-medium text-white placeholder:text-gray-700 ${
                  errors.password
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-white/5 focus:border-emerald-500/50'
                }`}
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p id="login-password-error" role="alert" className="flex items-center gap-1.5 text-red-400 text-xs font-medium ml-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.password.message}
              </p>
            )}
          </div>

          <CustomButton
            type="submit"
            id="login-submit"
            className="w-full mt-4"
            size="lg"
            loading={isSubmitting}
            rightIcon={!isSubmitting ? <ArrowRight className="w-5 h-5" /> : undefined}
          >
            Sign In
          </CustomButton>
        </form>

        <p className="text-center mt-8 text-gray-500 text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="text-emerald-400 hover:underline font-bold">
            Join the community
          </Link>
        </p>

        <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-6 grayscale opacity-50">
          <Target className="w-5 h-5" />
          <Target className="w-5 h-5" />
          <Target className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
