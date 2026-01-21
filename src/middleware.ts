import { NextResponse, type NextRequest } from 'next/server';

// Cookie name must match the one in shared/store/auth.ts
const ACCESS_TOKEN_COOKIE = 'access-token';

const PROTECTED_PATHS = [
  '/dashboard',
  '/features',
  '/settings',
  '/team',
  '/documentation',
  '/onboarding',
];

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  const isProtectedPath = PROTECTED_PATHS.some(path =>
    pathname.startsWith(path),
  );

  // Redirect to login if accessing protected route without auth
  if (isProtectedPath && !accessToken) {
    const loginUrl = new URL('/login', request.url);

    loginUrl.searchParams.set('redirect', pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Redirect to features/new if accessing login/signup while authenticated
  // Don't redirect for verify-email, forgot-password, reset-password
  if (accessToken && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/features/new', request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
