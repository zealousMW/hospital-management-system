import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Define protected routes
const protectedPaths = [
  '/patients',
  '/op_registration',
  '/protected',
  '/dashboard',
  '/appointments',
  '/profile',
  '/medical-records'
];

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.delete({
              name,
              ...options,
            });
          },
        },
      }
    );

    const { data: { session }, error } = await supabase.auth.getSession();

    // Check if the current path is protected
    const isProtectedPath = protectedPaths.some(path => 
      request.nextUrl.pathname.startsWith(path)
    );

    // Handle protected routes
    if (isProtectedPath) {
      if (!session) {
        const redirectUrl = new URL('/', request.url);
        redirectUrl.searchParams.set('returnUrl', request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Handle auth routes when already logged in
    if (['/', '/'].includes(request.nextUrl.pathname) && session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;

  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
