import { cn } from "@/lib/cn";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "red" | "green" | "purple" | "amber";
  className?: string;
};

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-zinc-100 text-zinc-600 border-zinc-200",
    red: "bg-red-50 text-red-700 border-red-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    purple: "bg-violet-50 text-violet-700 border-violet-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
