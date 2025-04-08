import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === '/auth/login' ||
    path === '/auth/register' ||
    path === '/' ||
    path.startsWith('/api/auth/login') ||
    path.startsWith('/api/auth/register');

  // Get the token from cookies
  const token = request.cookies.get('token')?.value;

  // If the path is public and the user is logged in, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the path is protected and the user is not logged in, redirect to login page
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

// Configure the paths that middleware will run on
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/marketplace/:path*',
    '/auth/:path*',
    '/api/auth/me',
  ],
};
