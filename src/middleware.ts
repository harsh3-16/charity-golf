import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    let response = NextResponse.next({
      request,
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Middleware: Supabase environment variables are missing');
      return response;
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error('Middleware Auth Error:', authError.message);
    }

    const url = request.nextUrl.clone();

    // Protect dashboard and admin routes
    if (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/admin')) {
      if (!user) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }

      // Fetch user profile from public.users to check role and subscription
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role, subscription_status')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Middleware Profile Error:', profileError.message);
      }

      // Admin check
      if (url.pathname.startsWith('/admin') && profile?.role !== 'admin') {
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }

      // Subscription check for dashboard
      if (
        url.pathname.startsWith('/dashboard') &&
        profile?.subscription_status !== 'active' &&
        !url.pathname.includes('/pricing')
      ) {
        url.pathname = '/pricing';
        return NextResponse.redirect(url);
      }
    }

    return response;
  } catch (error) {
    console.error('Middleware Exception:', error);
    // On unexpected error, return standard next response to avoid bringing down the whole app
    return NextResponse.next({
      request,
    });
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
