"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

/** Global site header — hidden on the admin panel routes. */
export default function SiteHeader() {
  const pathname = usePathname();
  // The proxy rewrites /<slug> → /admin internally, but usePathname()
  // still reports the browser URL, so match both the internal path
  // and the public slug.
  const slug = process.env.NEXT_PUBLIC_ADMIN_SLUG || "admin";

  if (
    pathname.startsWith("/admin") ||
    pathname === `/${slug}` ||
    pathname.startsWith(`/${slug}/`)
  ) {
    return null;
  }

  return <Navbar />;
}
