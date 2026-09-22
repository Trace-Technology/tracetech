import type { Metadata, Viewport } from "next";
import SiteHeader from "@/components/layout/SiteHeader";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "TraceTech | Custom PCB Design & Prototyping",
  description: "Custom PCB design, prototyping, and manufacturing for any application — from simple boards to complex systems.",
  keywords: "PCB design, custom PCB, PCB prototyping, PCB layout, PCB assembly, PCB manufacturing",
  authors: [{ name: "TraceTech" }],
  openGraph: {
    title: "TraceTech | Custom PCB Design & Prototyping",
    description: "Custom PCB design, prototyping, and manufacturing for any application — from simple boards to complex systems.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#dc2626",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-full">
        <SiteHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
