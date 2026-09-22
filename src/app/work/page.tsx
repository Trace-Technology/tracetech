import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/lib/projects";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import ImageCarousel from "@/components/ui/ImageCarousel";
import FadeIn from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Our Work — TraceTech",
  description:
    "12+ hardware projects — architecture to production. PCB design, power electronics, aerospace and IoT.",
};

export default function WorkPage() {
  return (
    <div className="bg-white py-24 px-6 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <span className="mb-4 inline-block rounded-full border border-red-200 bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-red-700">
            Portfolio
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
            Our Work
          </h1>
          <p className="mt-4 text-lg text-zinc-500">
            {projects.length} hardware projects — architecture to production.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <FadeIn key={project.id} delay={i * 0.05}>
              <Link href={`/work/${project.slug}`} className="block h-full">
                <Card hover className="group h-full">
                  <ImageCarousel
                    images={project.images}
                    alt={project.title}
                    className="mb-4"
                  />
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="red">{project.category}</Badge>
                    <Badge>{project.year}</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 group-hover:text-red-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500 line-clamp-2">
                    {project.description}
                  </p>
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
