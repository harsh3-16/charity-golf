'use client';

/**
 * S2 — Centralised toast wrapper built on `sonner`.
 *
 * Usage:
 *   import { toast } from '@/components/shared/Toast';
 *   toast.success('Score saved!');
 *   toast.error('Something went wrong');
 *
 * Mount <ToastProvider /> once at the root layout (already done in layout.tsx).
 */
export { Toaster as ToastProvider } from 'sonner';
export { toast } from 'sonner';
