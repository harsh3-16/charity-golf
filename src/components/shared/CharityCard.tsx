'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Charity {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

interface CharityCardProps {
  charity: Charity;
  selected?: boolean;
  onSelect?: (id: string) => void;
  className?: string;
}

export function CharityCard({ charity, selected = false, onSelect, className }: CharityCardProps) {
  const isSelectable = !!onSelect;

  return (
    <div
      onClick={() => isSelectable && onSelect?.(charity.id)}
      className={cn(
        "relative p-4 rounded-2xl border transition-all group overflow-hidden",
        isSelectable && "cursor-pointer hover:scale-[1.02]",
        selected 
          ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
          : "border-white/5 bg-white/[0.02] hover:border-white/20",
        className
      )}
    >
      <div className="aspect-video rounded-xl overflow-hidden mb-4 relative">
        <img 
          src={charity.image_url} 
          alt={charity.name}
          className={cn(
            "w-full h-full object-cover transition-transform duration-500",
            selected ? "scale-110" : "grayscale group-hover:grayscale-0"
          )}
        />
        {selected && (
          <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <Check className="text-black w-6 h-6" />
            </div>
          </div>
        )}
      </div>
      <h3 className={cn(
        "font-bold outfit mb-1 transition-colors",
        selected ? "text-emerald-400" : "text-white"
      )}>
        {charity.name}
      </h3>
      <p className="text-xs text-gray-500 line-clamp-2">
        {charity.description}
      </p>
    </div>
  );
}
