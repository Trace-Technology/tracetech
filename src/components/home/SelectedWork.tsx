"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import Badge from "@/components/ui/Badge";
import { getFeaturedProjects } from "@/lib/projects";

export default function SelectedWork() {
  const featured = getFeaturedProjects();

  return (
    <section className="bg-zinc-50 py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-col items-center gap-2">
              <div className="mb-4 inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-red-700">
                <span className="uppercase tracking-widest">Our Work</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Built. Tested. Delivered.
              </h2>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((project, i) => (
              <Link key={project.id} href={`/work/${project.slug}`}>
                <div className="group relative flex flex-col h-full rounded-2xl border border-red-100 bg-white shadow-lg shadow-red-600/5 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-red-300">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-zinc-100">
                    <img
                      src={project.image || "/pcb.jpg"}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-col flex-1 p-6">
                    <div className="mb-4 flex flex-wrap gap-2">
                      <Badge variant="red">{project.category}</Badge>
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-zinc-900 group-hover:text-red-600 transition-colors">
                      {project.title}
                    </h3>

                    <p className="mb-4 line-clamp-3 text-sm text-zinc-600">
                      {project.description}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {featured.length > 1 && (
              <div className="flex items-center justify-self-center min-h-[80px] w-full text-center">
                <Link href="/work" className="flex items-center justify-self-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700">
                  <span className="text-center whitespace-nowrap">See All Projects</span> <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
