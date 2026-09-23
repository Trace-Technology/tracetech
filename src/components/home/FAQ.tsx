"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";

const faqs = [
  {
    question: "Do you work with international clients?",
    answer:
      "Yes. We work remotely with companies worldwide. Our clients span Asia, Europe, the Americas and beyond.",
  },
  {
    question: "Can you work with an existing schematic?",
    answer:
      "Absolutely. We can take your existing schematic through PCB layout, DFM review, prototyping and manufacturing support.",
  },
  {
    question: "Can you design the schematic as well?",
    answer:
      "Yes. Where included in the project scope, we handle everything from circuit architecture and schematic design through to PCB layout and validation.",
  },
  {
    question: "Do you manufacture PCBs?",
    answer:
      "We coordinate PCB fabrication, assembly and manufacturing through selected manufacturing partners. Full manufacturing support is scaling in 2026.",
  },
  {
    question: "Can you sign an NDA?",
    answer:
      "Yes. We work under NDA for confidential projects. IP protection and controlled file access are standard practice.",
  },
  {
    question: "Who owns the PCB design?",
    answer:
      "Ownership is defined in the applicable project agreement or statement of work. Full IP transfer is standard upon project completion.",
  },
  {
    question: "Can you source components?",
    answer:
      "Yes. Component sourcing is part of our service offering. We optimize BOMs for cost, availability and lead time.",
  },
  {
    question: "What PCB software do you use?",
    answer:
      "EasyEDA Pro, KiCad and Altium Designer. We also use LTspice for circuit simulation and MATLAB/Simulink for system-level modelling.",
  },
  {
    question: "Can you handle prototypes?",
    answer:
      "Yes. We coordinate PCB fabrication, component sourcing, assembly and bring-up testing for prototype builds.",
  },
  {
    question: "Can you support mass production?",
    answer:
      "Yes, through our manufacturing coordination workflow. Production support includes DFM optimization, vendor coordination and quality control.",
  },
  {
    question: "What industries do you serve?",
    answer:
      "Robotics, aerospace & UAV, IoT & smart devices, energy & power, industrial electronics, and automotive & EV.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-zinc-50 py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <FadeIn>
          <span className="mb-4 inline-block rounded-full border border-red-200 bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-red-700">
            FAQ
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-zinc-600">
            Quick answers to common questions about our services and process.
          </p>
        </FadeIn>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 0.03}>
              <div className="rounded-xl border border-red-600 bg-white/50 shadow-lg shadow-red-600/20 transition-all hover:shadow-red-600/40 hover:border-red-500">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-zinc-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-red-600 transition-transform duration-200 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-6 pb-4 text-sm text-zinc-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
