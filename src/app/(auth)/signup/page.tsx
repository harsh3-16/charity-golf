'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Heart, ArrowRight, ArrowLeft, AlertCircle, Percent } from 'lucide-react';
import Link from 'next/link';
import { CustomButton } from '@/components/shared/CustomButton';
import { CharityCard } from '@/components/shared/CharityCard';
import { usePostQuery, useGetQuery } from '@/hooks/useApi';
import { apiUrls } from '@/lib/apiUrls';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/shared/Toast';

// W9 — Zod schema validates and trims inputs per B4
const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .max(100, 'Name is too long'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  charity_id: z
    .string()
    .min(1, 'Please select a charity'),
  charity_contribution_percentage: z.number().min(10).max(50),
  plan: z.enum(['monthly', 'yearly']),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { postQuery, loading: submitting } = usePostQuery();
  const { data: charities, getQuery } = useGetQuery();

  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      charity_id: '',
      charity_contribution_percentage: 10,
      plan: 'monthly',
    },
  });

  const selectedCharity = watch('charity_id');
  const selectedPlan = watch('plan');
  const selectedPercentage = watch('charity_contribution_percentage');

  React.useEffect(() => {
    if (step === 2) {
      getQuery({ url: apiUrls.charities.list });
    }
  }, [step, getQuery]);

  const nextStep = async () => {
    let fieldsToValidate: (keyof SignupFormValues)[] = [];
    if (step === 1) {
      fieldsToValidate = ['name', 'email', 'password'];
    } else if (step === 2) {
      fieldsToValidate = ['charity_id'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => setStep(s => s - 1);

  const { postQuery: startCheckout, loading: checkoutLoading } = usePostQuery();

  const onSubmit = async (data: SignupFormValues) => {
    try {
      // 1. Register the user in Supabase
      const response = await postQuery({
        url: apiUrls.auth.register,
        body: data
      });

      if (response && response.user) {
        dispatch(setCredentials({ 
          user: response.user, 
          token: response.token 
        }));
        
        toast.success('Account created! Redirecting to secure payment...');

        // 2. Trigger Stripe Checkout
        const checkoutResponse = await startCheckout({
          url: apiUrls.subscriptions.checkout,
          body: {
            plan: data.plan,
            charityId: data.charity_id
          }
        });

        if (checkoutResponse && checkoutResponse.url) {
          window.location.href = checkoutResponse.url;
        } else {
          // If checkout fails, at least they have an account
          router.push('/dashboard');
        }
      }
    } catch {
      // Toast handled by hook
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/5 rounded-full mb-12 overflow-hidden">
          <motion.div 
            className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            initial={{ width: '33.33%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-md mx-auto"
              >
                <h1 className="text-4xl font-extrabold outfit mb-2">Create Your Account</h1>
                <p className="text-gray-400 mb-10">Join the movement and start making an impact through your game.</p>
                
                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input 
                        type="text" 
                        placeholder="Tiger Woods"
                        className={`w-full bg-white/[0.03] border rounded-2xl py-4 pl-12 pr-4 focus:outline-none transition-all font-medium text-white ${
                          errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-emerald-500/50'
                        }`}
                        {...register('name')}
                      />
                    </div>
                    {errors.name && (
                      <p className="flex items-center gap-1.5 text-red-400 text-xs font-medium ml-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input 
                        type="email" 
                        placeholder="tiger@golf.com"
                        className={`w-full bg-white/[0.03] border rounded-2xl py-4 pl-12 pr-4 focus:outline-none transition-all font-medium text-white ${
                          errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-emerald-500/50'
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

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400 ml-1">Password</label>
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
                </div>

                <CustomButton 
                  type="button"
                  className="w-full mt-8" 
                  onClick={nextStep}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Continue to Charities
                </CustomButton>

                <p className="text-center mt-6 text-gray-500 text-sm">
                  Already have an account? <Link href="/login" className="text-emerald-400 hover:underline">Sign in</Link>
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-extrabold outfit mb-2">Select Your Charity</h1>
                  <p className="text-gray-400">10% of your subscription goes directly to this cause.</p>
                  {errors.charity_id && (
                    <p className="text-red-400 text-sm mt-4 font-bold uppercase tracking-widest">{errors.charity_id.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {charities?.map((charity: any) => (
                    <CharityCard 
                      key={charity.id}
                      charity={charity}
                      selected={selectedCharity === charity.id}
                      onSelect={(id) => setValue('charity_id', id, { shouldValidate: true })}
                    />
                  ))}
                  {(!charities || charities.length === 0) && [...Array(3)].map((_, i) => (
                    <div key={i} className="h-[320px] rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />
                  ))}
                </div>

                {/* Contribution Slider */}
                <div className="max-w-2xl mx-auto mb-16 p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                   <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                      <Percent className="w-4 h-4 text-emerald-500" />
                      Optional: Increase Your Impact (Min 10%)
                   </h3>
                   <div className="flex items-center gap-8">
                      <div className="flex-1 space-y-4">
                         <input 
                           type="range" 
                           min="10" 
                           max="50" 
                           step="5"
                           value={selectedPercentage}
                           onChange={(e) => setValue('charity_contribution_percentage', parseInt(e.target.value))}
                           className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                         />
                         <div className="flex justify-between text-[10px] font-black text-gray-600 uppercase tracking-widest">
                            <span>10% (Standard)</span>
                            <span>25% Impact</span>
                            <span>50% Max Impact</span>
                         </div>
                      </div>
                      <div className="w-24 h-24 rounded-2xl bg-black border border-emerald-500/20 flex flex-col items-center justify-center">
                         <span className="text-3xl font-black text-emerald-500 outfit">{selectedPercentage}%</span>
                         <span className="text-[8px] font-bold text-gray-500 uppercase">Donation</span>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <CustomButton variant="outline" type="button" onClick={prevStep} className="w-full md:w-auto px-12">
                    Back
                  </CustomButton>
                  <CustomButton 
                    type="button"
                    onClick={nextStep} 
                    className="w-full md:w-auto px-12"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Confirm & Pay
                  </CustomButton>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-md mx-auto text-center"
              >
                <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                   <Heart className="w-10 h-10 text-emerald-500 fill-current" />
                </div>
                <h1 className="text-4xl font-extrabold outfit mb-2">Simple Pricing</h1>
                <p className="text-gray-400 mb-10">Choose the plan that fits your impact goals.</p>

                <div className="space-y-4 mb-10 text-left">
                  <div 
                    onClick={() => setValue('plan', 'monthly')}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                      selectedPlan === 'monthly' ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                     {selectedPlan === 'monthly' && <div className="absolute top-4 right-4 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Selected</div>}
                     <h3 className={`text-xl font-bold mb-1 ${selectedPlan === 'monthly' ? 'text-emerald-400' : 'text-white'}`}>Monthly Plan</h3>
                     <div className="text-3xl font-extrabold outfit">£10<span className="text-sm font-medium text-gray-500">/mo</span></div>
                     <p className="text-sm text-gray-500 mt-2 text-balance leading-relaxed">Cancel anytime. Access to all monthly draws and score tracking.</p>
                  </div>

                  <div 
                    onClick={() => setValue('plan', 'yearly')}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                      selectedPlan === 'yearly' ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                     {selectedPlan === 'yearly' && <div className="absolute top-4 right-4 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Selected</div>}
                     <h3 className={`text-xl font-bold mb-1 ${selectedPlan === 'yearly' ? 'text-emerald-400' : 'text-white'}`}>Yearly Plan</h3>
                     <div className="text-3xl font-extrabold outfit">£96<span className="text-sm font-medium text-gray-500">/yr</span></div>
                     <p className="text-sm text-gray-500 mt-2 text-balance leading-relaxed">Save 20%. Includes VIP access to exclusive events.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <CustomButton size="lg" className="w-full" loading={submitting || checkoutLoading} type="submit">
                    Sign Up & Complete
                  </CustomButton>
                  <button type="button" onClick={prevStep} className="text-gray-500 hover:text-white text-sm font-medium">
                    Go back to charities
                  </button>
                </div>
                
                <p className="mt-8 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                  Secure SSL Encryption • Powered by Supabase
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
