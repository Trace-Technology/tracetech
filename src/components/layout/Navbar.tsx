"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/work", label: "Our Work" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-red-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-red-700">
          TRACE<span className="text-black">TECH</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-red-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link href="/quote-request" className="bg-red-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-colors">
          Get Started
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="text-zinc-600 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-red-100 bg-white/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-700"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
