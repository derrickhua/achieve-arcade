import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.JWT_SECRET });

  const isAuthPath = request.nextUrl.pathname.startsWith('/auth');
  const isRootPath = request.nextUrl.pathname === '/';
  const isRegisterProPath = request.nextUrl.pathname === '/auth/register-pro';
  const tosPath = request.nextUrl.pathname === '/auth/terms-of-service';
  const privacyPath = request.nextUrl.pathname === '/auth/privacy-policy';
  const isRegisterPath = request.nextUrl.pathname === '/auth/register';
  const isSigninPath = request.nextUrl.pathname === '/auth/signin';
  const isDashboardPath = request.nextUrl.pathname === '/dashboard';

  if (token) {
    if (isSigninPath || isRegisterPath || isRegisterProPath) {
      // If authenticated and trying to access sign-in, register or root, redirect to dashboard
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  } else {
    if (!isAuthPath && !isRootPath && !isRegisterPath && !isSigninPath && !isRegisterProPath && !tosPath && !privacyPath) {
      // If not authenticated and trying to access protected routes, redirect to sign-in
      const url = request.nextUrl.clone();
      url.pathname = '/auth/signin';
      return NextResponse.redirect(url);
    }
  }

  // Continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icons|fonts).*)',
  ],
};