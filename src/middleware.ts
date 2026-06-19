import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const path = req.nextUrl.pathname;
  const isAdminRoute   = path.startsWith('/admin');
  const isLoginPage    = path === '/admin/login';
  const isRegisterPage = path === '/admin/register';

  // Public admin pages — redirect to dashboard if already logged in
  if ((isLoginPage || isRegisterPage) && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl));
  }

  // Protected admin pages — redirect to login if not logged in
  if (isAdminRoute && !isLoginPage && !isRegisterPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};
