import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const path = req.nextUrl.pathname;

  // Skip middleware for API routes and signin page
  if (path.startsWith('/api') || path === '/admin/signin') {
    return NextResponse.next();
  }

  const token = await getToken({ req });

  if (path.startsWith("/admin")) {
    if (!token) {
      const url = new URL('/admin/signin', req.url);
      url.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    if (!token.isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
