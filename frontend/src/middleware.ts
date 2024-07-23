import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXT_PUBLIC_JWT_SECRET });

    const isAuthPath = request.nextUrl.pathname.startsWith('/auth');
    const isRootPath = request.nextUrl.pathname === '/';
    const isRegisterProPath = request.nextUrl.pathname === '/auth/register-pro';
    const tosPath = request.nextUrl.pathname === '/terms-of-service';
    const privacyPath = request.nextUrl.pathname === '/privacy-policy';
    const isRegisterPath = request.nextUrl.pathname === '/auth/register';
    const isSigninPath = request.nextUrl.pathname === '/auth/signin';
    const isDashboardPath = request.nextUrl.pathname === '/dashboard';

    if (token) {
      if ((isSigninPath || isRegisterPath || isRegisterProPath) && !isDashboardPath) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
    } else {
      if (!isAuthPath && !isRootPath && !isRegisterPath && !isSigninPath && !isRegisterProPath && !tosPath && !privacyPath) {
        if (!isSigninPath) {
          const url = request.nextUrl.clone();
          url.pathname = '/auth/signin';
          return NextResponse.redirect(url);
        }
      }
    }

    // Continue with the request
    return NextResponse.next();
  } catch (error) {
    console.error('Error refreshing access token:', error);

    if (error.name === 'RefreshAccessTokenError') {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/signin';
      return NextResponse.redirect(url);
    }

    // Continue with the request if it's not a token error
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icons|fonts).*)',
  ],
};
