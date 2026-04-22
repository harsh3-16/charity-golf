import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function generateDrawNumbers(mode: 'hot' | 'cold' | 'random') {
  if (mode === 'random') {
    return Array.from({ length: 5 }, () => Math.floor(Math.random() * 45) + 1);
  }

  // Fetch all user scores for the calculation
  const { data: scores, error } = await supabaseAdmin
    .from('scores')
    .select('score');

  if (error || !scores || scores.length === 0) {
    // Fallback to random if no scores exist
    return Array.from({ length: 5 }, () => Math.floor(Math.random() * 45) + 1);
  }

  // Count frequencies
  const frequencyMap: Record<number, number> = {};
  for (let i = 1; i <= 45; i++) frequencyMap[i] = 0;
  
  scores.forEach((s) => {
    frequencyMap[s.score] = (frequencyMap[s.score] || 0) + 1;
  });

  const sortedScores = Object.entries(frequencyMap)
    .map(([score, count]) => ({ score: parseInt(score), count }))
    .sort((a, b) => mode === 'hot' ? b.count - a.count : a.count - b.count);

  // Take top 5 and handle ties randomly if needed
  return sortedScores.slice(0, 5).map(s => s.score);
}

export async function calculatePoolDistribution(activeSubscribers: number, rolledOverAmount: number = 0) {
  // PRD: 20% to prize pool
  // Subscription fee is assumed £10 average for this logic
  const subscriptionFee = 10; 
  const totalMonthlyPool = activeSubscribers * subscriptionFee * 0.20;
  const totalPool = totalMonthlyPool + rolledOverAmount;

  return {
    totalPool,
    jackpot: totalPool * 0.40,
    pool4match: totalPool * 0.35,
    pool3match: totalPool * 0.25,
  };
}
