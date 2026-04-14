import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const isAuthPage =
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/register');

  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');

  // 🔒 If not logged in → block dashboard
  if (!token && isDashboard) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 🔁 If logged in → prevent going to login/register
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
