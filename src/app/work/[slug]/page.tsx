import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/lib/projects";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ImageCarousel from "@/components/ui/ImageCarousel";
import FadeIn from "@/components/ui/FadeIn";
import { ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return notFound();

  return (
    <div className="bg-white py-24 px-6 min-h-screen">
      <div className="mx-auto max-w-4xl">
        <Button href="/work" variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>

        <div className="mt-8 flex flex-wrap gap-2">
          <Badge variant="red">{project.category}</Badge>
          <Badge>{project.year}</Badge>
          {project.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          {project.title}
        </h1>

        <div className="mt-4 flex flex-wrap gap-6 text-sm text-zinc-500">
          <span>
            <strong className="text-zinc-700">Client:</strong> {project.client}
          </span>
          <span>
            <strong className="text-zinc-700">Role:</strong> {project.role}
          </span>
        </div>

        <ImageCarousel
          images={project.images}
          alt={project.title}
          className="mt-8"
        />

        <div className="mt-12 space-y-12">
          <FadeIn>
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Overview</h2>
              <p className="mt-3 text-zinc-600 leading-relaxed">
                {project.description}
              </p>
            </div>
          </FadeIn>

          <FadeIn>
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Challenge</h2>
              <p className="mt-3 text-zinc-600 leading-relaxed">
                {project.challenge}
              </p>
            </div>
          </FadeIn>

          <FadeIn>
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Our Approach</h2>
              <ul className="mt-3 space-y-2">
                {project.approach.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn>
            <div>
              <h2 className="text-xl font-bold text-zinc-900">
                Technical Highlights
              </h2>
              <ul className="mt-3 space-y-2">
                {project.technicalHighlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn>
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Deliverables</h2>
              <ul className="mt-3 space-y-2">
                {project.deliverables.map((d, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-600">
                    <span className="text-emerald-600">✓</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>

        <div className="mt-16 rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center">
          <h3 className="text-xl font-bold text-zinc-900">
            Have a similar project?
          </h3>
          <p className="mt-2 text-sm text-zinc-500">
            Let us help you engineer your next hardware product.
          </p>
          <Button 
            href={`/quote-request?service=${project.serviceType || "pcb"}`}
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
