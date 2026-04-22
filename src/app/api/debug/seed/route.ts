import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabaseAdmin = createAdminClient();
    // 1. Seed Charities
    const charities = [
      {
        id: 'e8bd21c2-c6e3-474a-856b-d4a3714bba48',
        name: 'Cancer Research UK',
        description: 'The world’s leading cancer charity dedicated to saving lives through research, influence and information.',
        image_url: 'https://images.unsplash.com/photo-1579152276511-73678224c581?q=80&w=2070&auto=format&fit=crop',
        website: 'https://www.cancerresearchuk.org/',
        is_featured: true,
      },
      {
        id: '4f531e66-e4d5-4c5b-aa24-d3be7384177e',
        name: 'The Golf Foundation',
        description: 'Helping young people from all backgrounds enjoy the personal and social benefits of golf.',
        image_url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2070&auto=format&fit=crop',
        website: 'https://www.golf-foundation.org/',
        is_featured: true,
      },
      {
        id: '9d2c1a55-5cc6-4691-8bd2-8fde5b9bca5b',
        name: 'Sport Relief',
        description: 'Using the power of sport to change lives in the UK and around the world.',
        image_url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop',
        website: 'https://www.comicrelief.com/sportrelief',
        is_featured: true,
      },
      {
        id: '8e2c1a55-5cc6-4691-8bd2-8fde5b9bca5a',
        name: 'British Heart Foundation',
        description: 'Funding research to keep hearts beating and blood flowing.',
        image_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop',
        website: 'https://www.bhf.org.uk/',
        is_featured: false,
      },
      {
        id: 'f7478d96-5201-4e53-853d-f73d650f0606',
        name: 'Macmillan Cancer Support',
        description: 'Providing physical, financial and emotional support to help people live life as fully as they can.',
        image_url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop',
        website: 'https://www.macmillan.org.uk/',
        is_featured: false,
      }
    ];

    const { error: charityError } = await supabaseAdmin
      .from('charities')
      .upsert(charities, { onConflict: 'id' });

    if (charityError) throw charityError;

    // 2. Seed Draws
    const now = new Date();
    const draws = [
      {
        month: 2,
        year: 2026,
        status: 'published',
        drawn_numbers: [12, 24, 31, 38, 42],
        total_prize_pool: 12500.00,
        jackpot_amount: 5000.00,
        jackpot_rolled_over: false,
      },
      {
        month: 3,
        year: 2026,
        status: 'published',
        drawn_numbers: [5, 18, 22, 29, 35],
        total_prize_pool: 11000.00,
        jackpot_amount: 4500.00,
        jackpot_rolled_over: false,
      },
      {
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        status: 'published',
        total_prize_pool: 15240.00,
        jackpot_amount: 10240.00,
      }
    ];

    const { error: drawError } = await supabaseAdmin
      .from('draws')
      .upsert(draws, { onConflict: 'month,year' });

    if (drawError) throw drawError;

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully',
      seeded: {
        charities: charities.length,
        draws: draws.length
      }
    });
  } catch (err: any) {
    console.error('[seed_api] Error seeding database:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
