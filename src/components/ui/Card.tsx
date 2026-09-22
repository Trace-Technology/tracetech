"use client";

import { cn } from "@/lib/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export default function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white p-6",
        hover &&
          "transition-all duration-300 hover:border-red-200 hover:shadow-xl hover:shadow-red-600/10",
        className
      )}
    >
      {children}
    </div>
  );
}
