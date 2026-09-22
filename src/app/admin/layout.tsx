"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FileText, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/cn";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [basePath, setBasePath] = useState("/admin");

  useEffect(() => {
    // Sync with the browser URL (external system) to resolve the slug-based path.
    const slug = window.location.pathname.split("/")[1];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBasePath(`/${slug}`);
  }, []);

  // Login page doesn't need the layout
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  const navItems = [
    { href: `${basePath}/quotations`, label: "Quotations", icon: FileText },
    { href: `${basePath}/admins`, label: "Admins", icon: Users },
  ];

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push(basePath);
  };

  return (
    <div className="bg-white min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-zinc-50 p-4 hidden md:flex md:flex-col">
        <div className="mb-8 px-3">
          <h2 className="text-lg font-bold text-zinc-900">Admin Panel</h2>
          <p className="text-xs text-zinc-500">TraceTech quotations</p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname.endsWith(item.href.split("/").pop() || "")
                  ? "bg-red-50 text-red-700"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-zinc-200 pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white px-4 py-2 flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
              pathname.endsWith(item.href.split("/").pop() || "")
                ? "text-red-700"
                : "text-zinc-500"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-zinc-500"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 pb-24 md:pb-6 overflow-auto">{children}</main>
    </div>
  );
}
