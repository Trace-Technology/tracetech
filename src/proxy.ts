import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const slug = process.env.ADMIN_SLUG;
  const pathname = request.nextUrl.pathname;

  // Block all direct access to /admin routes
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If no slug configured, skip
  if (!slug) return NextResponse.next();

  // Exact slug match → rewrite to /admin
  if (pathname === `/${slug}`) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.rewrite(url);
  }

  // Slug with subpath → rewrite to /admin/subpath
  if (pathname.startsWith(`/${slug}/`)) {
    const subPath = pathname.slice(`/${slug}`.length);
    const url = request.nextUrl.clone();
    url.pathname = `/admin${subPath}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/((?!api|_next|favicon.ico).*)"],
};
