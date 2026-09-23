import Link from "next/link";
import Section from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/Section";
import FadeIn from "@/components/ui/FadeIn";

const steps = [
  {
    num: "01",
    title: "Tell Us About Your Project",
    description:
      "Submit your requirements, schematic, PCB files, BOM, mechanical constraints, or even just your product idea.",
  },
  {
    num: "02",
    title: "Engineering Review",
    description:
      "Our technical team reviews your requirements and identifies the scope, complexity, risks and deliverables.",
  },
  {
    num: "03",
    title: "Receive Your Proposal",
    description:
      "You receive scope, timeline, deliverables, pricing, and engineering assumptions — all transparent.",
  },
  {
    num: "04",
    title: "Engineering Begins",
    description:
      "Your project is assigned to the appropriate engineer and tracked through defined milestones.",
  },
  {
    num: "05",
    title: "Review & Validation",
    description:
      "We perform design reviews, DFM checks and required verification before final release.",
  },
  {
    num: "06",
    title: "Production Support",
    description:
      "When required, we coordinate prototyping, component sourcing, manufacturing and delivery.",
  },
];

export default function HowItWorks() {
  return (
    <Section>
      <FadeIn>
        <SectionHeader
          label="How It Works"
          title="Simple Process, Exceptional Results"
          description="A straightforward path from your idea to production-ready hardware."
        />
      </FadeIn>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, i) => (
          <FadeIn key={step.num} delay={i * 0.08}>
            <div
              className="rounded-2xl bg-zinc-900/50 border border-white/30 backdrop-blur-md px-4 py-6"
              style={{ height: "200px" }}
            >
              <div className="mb-3 text-4xl font-black text-red-500">{step.num}</div>
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-red-200">{step.description}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="mt-16 text-center">
        <FadeIn delay={0.3}>
          <div className="rounded-2xl bg-zinc-900/50 border border-white/30 backdrop-blur-md px-8 py-6">
            <h3 className="text-lg font-bold text-white">Ready to start?</h3>
            <p className="mt-2 text-sm text-red-200">Submit your project details and we&apos;ll get back to you within 1 business day.</p>
            <Link href="/quote-request" className="mt-4 inline-block rounded-lg bg-red-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700">
              Get Started
            </Link>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}
