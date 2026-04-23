import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { 
      email: rawEmail, 
      password, 
      name: rawName, 
      charity_id, 
      plan, 
      charity_contribution_percentage 
    } = await request.json();
    
    const email = rawEmail?.trim();
    const name = rawName?.trim();
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // 1. Sign up the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          charity_id: charity_id || null, // Ensure null if empty
          plan: plan || 'monthly',         // Default to monthly if missing
          charity_contribution_percentage: charity_contribution_percentage || 10,
        },
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'User creation failed' }, { status: 400 });
    }

    // Since we have a DB trigger 'on_auth_user_created', the profile in 'public.users' 
    // will be created automatically. We'll wait a brief moment for the trigger.
    
    // Fetch the newly created profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      // Even if profile fetch fails, user is created in Auth
    }

    // W13/Email — Trigger welcome email in background
    if (authData.user.email) {
      sendWelcomeEmail(authData.user.email, name || 'Member').catch(err => {
        console.error('[signup_email] Failed to send welcome email:', err);
      });
    }

    return NextResponse.json({ 
      user: { 
        ...profile, 
        email: authData.user.email,
        full_name: name 
      }, 
      token: authData.session?.access_token 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
