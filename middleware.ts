import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "hs_session";

const ADMIN_PREFIXES = [
  "/students",
  "/buildings",
  "/rooms",
  "/contracts",
  "/payments",
  "/maintenance",
  "/assignments",
  "/staff",
  "/admin",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  const isAdmin = ADMIN_PREFIXES.some((p) => pathname.startsWith(p));
  const isPortal = pathname.startsWith("/portal");

  if ((isAdmin || isPortal) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/students/:path*",
    "/buildings/:path*",
    "/rooms/:path*",
    "/contracts/:path*",
    "/payments/:path*",
    "/maintenance/:path*",
    "/assignments/:path*",
    "/staff/:path*",
    "/admin/:path*",
    "/portal/:path*",
  ],
};
