import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "authjs.session-token";
const SESSION_COOKIE_SECURE = "__Secure-authjs.session-token";

const PROTECTED_PREFIXES = ["/dashboard", "/admin", "/teacher", "/parent", "/student", "/super-admin"];

function isLoggedIn(req: NextRequest) {
  return !!(req.cookies.get(SESSION_COOKIE)?.value || req.cookies.get(SESSION_COOKIE_SECURE)?.value);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const logged_in = isLoggedIn(req);

  if (pathname === "/login") {
    if (logged_in) return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.next();
  }

  if (PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (!logged_in) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware only on dotless app routes. Skipped: sitemap.xml, robots.txt,
  // manifest.webmanifest, sw.js and all static assets (_next/static, images, etc.)
  // so crawlers always hit the plain CDN-served files.
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
