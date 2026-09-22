import { cn } from "@/lib/cn";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export default function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-24 px-6", className)}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

type SectionHeaderProps = {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  label,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-16",
        align === "center" && "text-center",
        className
      )}
    >
      {label && (
        <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-red-600">
          {label}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-red-200 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
