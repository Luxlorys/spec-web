import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PATHS = [
  '/dashboard',
  '/features',
  '/settings',
  '/team',
  '/notifications',
];

const PUBLIC_PATHS = ['/login', '/signup', '/'];

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth-token')?.value;

  const isProtectedPath = PROTECTED_PATHS.some(path =>
    pathname.startsWith(path),
  );
  const isPublicPath = PUBLIC_PATHS.some(
    path => pathname === path || (path !== '/' && pathname.startsWith(path)),
  );

  // Redirect to login if accessing protected route without auth
  if (isProtectedPath && !authToken) {
    const loginUrl = new URL('/login', request.url);

    loginUrl.searchParams.set('redirect', pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing login/signup while authenticated
  if (
    isPublicPath &&
    authToken &&
    (pathname === '/login' || pathname === '/signup')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
