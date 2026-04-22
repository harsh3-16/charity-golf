'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Calendar,
  Target,
  Trash2,
  Edit2,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { CustomButton } from '@/components/shared/CustomButton';
import { CustomAlertModal } from '@/components/shared/CustomAlertModal';
import { toast } from '@/components/shared/Toast';
import { useGetQuery, usePostQuery, usePatchQuery, useDeleteQuery } from '@/hooks/useApi';
import { apiUrls } from '@/lib/apiUrls';
import { Skeleton } from '@/components/shared/Skeleton';
import { ErrorState } from '@/components/shared/ErrorState';

// W9 — Zod schema for score entry
const scoreSchema = z.object({
  score: z
    .string()
    .min(1, 'Score is required')
    .refine(
      (v) => {
        const n = parseInt(v, 10);
        return !isNaN(n) && n >= 1 && n <= 45;
      },
      { message: 'Score must be between 1 and 45' }
    ),
  date: z.string().min(1, 'Please select a date'),
});

type ScoreFormValues = z.infer<typeof scoreSchema>;

export default function ScoresPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingScore, setEditingScore] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { 
    data: scores, 
    loading: listLoading, 
    error: listError, 
    getQuery: getScores 
  } = useGetQuery();

  const { 
    loading: createLoading, 
    postQuery: createScore 
  } = usePostQuery();

  const { 
    loading: updateLoading, 
    patchQuery: updateScore 
  } = usePatchQuery();

  const { 
    loading: deleteLoading, 
    deleteQuery: deleteScore 
  } = useDeleteQuery();

  useEffect(() => {
    const controller = new AbortController();
    getScores({ url: apiUrls.scores.list, signal: controller.signal });
    return () => controller.abort();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ScoreFormValues>({
    resolver: zodResolver(scoreSchema),
    defaultValues: { score: '', date: '' },
  });

  const onSubmit = async (data: ScoreFormValues) => {
    const scoreNum = parseInt(data.score, 10);
    
    if (editingScore) {
      await updateScore({
        url: apiUrls.scores.update(editingScore.id),
        body: { score: scoreNum, date: data.date },
        onSuccess: () => {
          reset();
          setEditingScore(null);
          setShowAddForm(false);
          toast.success('Score updated successfully!');
          getScores({ url: apiUrls.scores.list });
        }
      });
    } else {
      await createScore({
        url: apiUrls.scores.create,
        body: { score: scoreNum, date: data.date },
        onSuccess: () => {
          reset();
          setShowAddForm(false);
          toast.success('Score saved successfully!');
          getScores({ url: apiUrls.scores.list });
        }
      });
    }
  };

  const handleEdit = (score: any) => {
    setEditingScore(score);
    setValue('score', score.score.toString());
    setValue('date', score.date);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    reset();
    setEditingScore(null);
    setShowAddForm(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    
    await deleteScore({
      url: apiUrls.scores.delete(deleteTarget),
      onSuccess: () => {
        setDeleteTarget(null);
        toast.success('Score removed.');
        getScores({ url: apiUrls.scores.list }); // Refresh list
      }
    });
  };

  if (listError) {
    return <ErrorState onRetry={() => getScores({ url: apiUrls.scores.list })} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold outfit">My Scores</h1>
          <p className="text-gray-500 mt-1">
            Manage your rolling 5 Stableford scores for the monthly draw.
          </p>
        </div>
        {!showAddForm && (
          <CustomButton
            id="add-score-btn"
            onClick={() => setShowAddForm(true)}
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Entry New Score
          </CustomButton>
        )}
      </div>

      {/* Add Score Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-6"
            >
              <h2 className="text-xl font-bold outfit flex items-center gap-2 text-emerald-400">
                {editingScore ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingScore ? 'Edit Stableford Score' : 'Add Stableford Score'}
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Score */}
                <div className="space-y-2">
                  <label htmlFor="score-value" className="text-sm font-semibold text-gray-400 ml-1">
                    Stableford Score (1–45)
                  </label>
                  <div className="relative">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      id="score-value"
                      type="number"
                      min="1"
                      max="45"
                      placeholder="e.g. 36"
                      aria-invalid={!!errors.score}
                      aria-describedby={errors.score ? 'score-value-error' : undefined}
                      className={`w-full bg-black border rounded-2xl py-4 pl-12 pr-4 focus:outline-none transition-all text-white font-bold ${
                        errors.score
                          ? 'border-red-500/50 focus:border-red-500'
                          : 'border-white/5 focus:border-emerald-500/50'
                      }`}
                      {...register('score')}
                    />
                  </div>
                  {errors.score && (
                    <p id="score-value-error" role="alert" className="flex items-center gap-1.5 text-red-400 text-xs font-medium ml-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.score.message}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label htmlFor="score-date" className="text-sm font-semibold text-gray-400 ml-1">
                    Round Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      id="score-date"
                      type="date"
                      aria-invalid={!!errors.date}
                      aria-describedby={errors.date ? 'score-date-error' : undefined}
                      className={`w-full bg-black border rounded-2xl py-4 pl-12 pr-4 focus:outline-none transition-all text-white font-bold [color-scheme:dark] ${
                        errors.date
                          ? 'border-red-500/50 focus:border-red-500'
                          : 'border-white/5 focus:border-emerald-500/50'
                      }`}
                      {...register('date')}
                    />
                  </div>
                  {errors.date && (
                    <p id="score-date-error" role="alert" className="flex items-center gap-1.5 text-red-400 text-xs font-medium ml-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.date.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <CustomButton type="submit" id="save-score-btn" loading={createLoading || updateLoading} className="px-10">
                  {editingScore ? 'Update Score' : 'Save Score'}
                </CustomButton>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-white font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm font-bold uppercase tracking-widest px-4">
          <Info className="w-4 h-4" />
          Rolling 5 Scores (Latest First)
        </div>

        <div className="grid gap-4">
          {listLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Skeleton className="w-14 h-14 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <Skeleton className="w-10 h-10 rounded-xl" />
              </div>
            ))
          ) : (
            <AnimatePresence initial={false}>
              {scores && scores.length > 0 ? (
                scores.map((score: any, idx: number) => (
                  <motion.div
                    key={score.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:bg-white/[0.04] transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <span className="text-2xl font-black outfit text-emerald-500">{score.score}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-300 font-bold">
                            {new Date(score.date).toLocaleDateString('en-GB', {
                              day: 'numeric', month: 'long', year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                          Stableford Format • Verified Round
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="hidden group-hover:flex items-center gap-2 transition-all">
                        <button
                          id={`edit-score-${score.id}`}
                          onClick={() => handleEdit(score)}
                          className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all font-bold text-xs"
                          title="Edit Score"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          id={`delete-score-${score.id}`}
                          onClick={() => setDeleteTarget(score.id)}
                          className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all font-bold text-xs"
                          title="Delete Score"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 text-gray-400 group-hover:hidden">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500/50" />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-12 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
                  <Target className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-300">No scores yet</h3>
                  <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                    Upload at least one score to be eligible for this month's prize draw.
                  </p>
                  <CustomButton
                    variant="outline"
                    size="sm"
                    className="mt-6"
                    onClick={() => setShowAddForm(true)}
                  >
                    Add Your First Score
                  </CustomButton>
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-4">
        <Info className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-blue-400 mb-1">How it works:</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            We only use your <strong>latest 5 scores</strong> for the monthly draw. When you add a 6th
            score, the oldest one is automatically removed. This ensures we're calculating winning numbers
            based on your most recent performance.
          </p>
        </div>
      </div>

      <CustomAlertModal
        isOpen={!!deleteTarget}
        title="Delete Score?"
        message="This will permanently remove this score from your rolling history. If you have fewer than 5 scores, you may lose eligibility for the current draw."
        confirmLabel="Yes, Delete Score"
        variant="danger"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
