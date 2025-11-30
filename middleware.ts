import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = [
  '/',
  '/signin',
  '/signup',
  '/forgot-password',
  '/terms',
  '/privacy',
  '/contact',
  '/about',
];

const adminRoutes = ['/admin', '/dashboard'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  // Note: Firebase tokens are stored in client-side, so we can't check them in middleware
  // Instead, we'll let the client-side protection handle it
  // This middleware is mainly for any API route protection

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
