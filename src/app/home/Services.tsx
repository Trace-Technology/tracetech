"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";

const services = [
  {
    eyebrow: "E2E Solar",
    title: "End-to-End Solar",
    description:
      "Complete solar electronics — from system design and component selection to layout, prototyping, and production-ready assembly.",
    image: "/solar.jpg",
    alt: "Solar panel field",
    details: [
      "System Design",
      "MPPT Controllers",
      "Inverters",
      "Production Assembly",
    ],
    serviceType: "solar",
    slug: "cubesat-solar-array-222w",
  },
  {
    eyebrow: "Battery Solutions",
    title: "Complete Battery Solutions",
    description:
      "Cell selection, BMS design, thermal management, and safe packaging — complete battery systems built for reliability.",
    image: "/battery.jpg",
    alt: "Battery system",
    details: [
      "Cell Selection",
      "BMS Design",
      "Thermal Management",
      "Safety & Compliance",
    ],
    serviceType: "battery",
    slug: "mppt-solar-charge-controller-300w",
  },
  {
    eyebrow: "PCB Design",
    title: "PCB Design",
    description:
      "Custom PCBs of any kind — multi-layer, high-speed, and power electronics, laid out for signal integrity and manufacturability.",
    image: "/pcb.jpg",
    alt: "PCB on the assembly line",
    details: [
      "Multi-layer PCB",
      "High-speed Layout",
      "Power Electronics",
      "DFM Optimization",
    ],
    serviceType: "pcb",
    slug: "indigenous-1u-cubesat",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <div className="mb-20 text-center">
            <span className="mb-4 inline-block rounded-full border border-red-200 bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-red-700">
              Our Services
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
              What we do, end to end
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-500">
              Three integrated services covering complete hardware development —
              from first schematic to finished product.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-20">
          {services.map((service, i) => {
            const flip = i % 2 === 1;
            return (
              <FadeIn key={service.number} delay={i * 0.1}>
                <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
                  {/* Image side — alternates left / right per row */}
                  <div className={flip ? "md:order-2" : ""}>
                    <div className="group relative h-72 overflow-hidden rounded-3xl border border-red-100 shadow-xl shadow-red-600/10 md:h-80">
                      <Image
                        src={service.image}
                        alt={service.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                    </div>
                  </div>

                        {/* Text side */}
                        <div className={flip ? "md:order-1" : ""}>
                          <h3 className="mb-3 text-2xl font-bold text-zinc-900 md:text-3xl">
                            {service.title}
                          </h3>
                          <p className="mb-6 leading-relaxed text-zinc-600">
                            {service.description}
                          </p>

                          <div className="mb-8 flex flex-wrap gap-2">
                            {service.details.map((detail) => (
                              <span
                                key={detail}
                                className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700"
                              >
                                {detail}
                              </span>
                            ))}
                          </div>

                          <Link href={`/quote-request?service=${service.serviceType}`}>
                            <div className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3 font-semibold text-white shadow-lg shadow-red-600/25 transition-colors hover:bg-red-700">
                              Get a Free Quote <ArrowRight className="h-4 w-4" />
                            </div>
                          </Link>
                        </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
