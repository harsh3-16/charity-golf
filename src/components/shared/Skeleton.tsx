'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
  lines?: number; // for multi-line text skeletons
}

/** S1 — Shimmer skeleton. Mirror the visual shape of the content it replaces. */
export function Skeleton({ className, variant = 'rect', lines = 1 }: SkeletonProps) {
  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'animate-pulse rounded-lg bg-white/[0.06]',
              i === lines - 1 ? 'w-3/4' : 'w-full',
              'h-4',
              className
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-white/[0.06]',
        variant === 'circle' ? 'rounded-full' : 'rounded-2xl',
        variant === 'text' ? 'h-4 w-full rounded-lg' : '',
        className
      )}
    />
  );
}

/** Pre-built skeleton for a stat card (mirrors the dashboard stat card shape). */
export function StatCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="circle" className="w-10 h-10" />
        <Skeleton className="w-4 h-4" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="w-1/2" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton variant="text" className="w-1/3 h-3" />
      </div>
    </div>
  );
}

/** Pre-built skeleton for a score row. */
export function ScoreRowSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Skeleton variant="circle" className="w-14 h-14" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-10 w-10 rounded-xl" />
    </div>
  );
}

/** Pre-built skeleton for a table row. */
export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4" />
        </td>
      ))}
    </tr>
  );
}
