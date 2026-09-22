"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";

const expertise = [
  {
    title: "PCB Engineering",
    items: ["Multi-layer", "RF", "High-speed", "DFM"],
  },
  {
    title: "Power Electronics",
    items: ["Buck / Boost", "MPPT", "Battery Systems", "Thermal Design"],
  },
  {
    title: "Embedded Hardware",
    items: ["STM32", "ESP32", "ATmega", "CAN / SPI / I²C"],
  },
  {
    title: "Energy Systems",
    items: ["BMS", "Solar", "Li-ion", "LiFePO4"],
  },
  {
    title: "Aerospace & UAV",
    items: ["CubeSat", "Flight Electronics", "Drone Power", "Telemetry"],
  },
  {
    title: "Validation",
    items: ["Bench Bring-up", "Testing", "Debugging", "Failure Analysis"],
  },
];

const cardColors = [
  "bg-zinc-900/50 border-red-500",
  "bg-zinc-900/50 border-red-500",
  "bg-zinc-900/50 border-red-500",
  "bg-zinc-900/50 border-red-500",
  "bg-zinc-900/50 border-red-500",
  "bg-zinc-900/50 border-red-500",
];

const cardDots = [
  "bg-red-500",
  "bg-red-500",
  "bg-red-500",
  "bg-red-500",
  "bg-red-500",
  "bg-red-500",
];

export default function TechnicalDepth() {
  return (
    <section className="bg-zinc-950 py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-16 text-center text-white">
            <span className="mb-4 inline-block rounded-full border border-red-200 bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-red-700">
              Technical Depth
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Engineering Expertise
            </h2>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
              Deep capability across the full hardware development stack.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl bg-zinc-900/50 border border-red-500/30 backdrop-blur-md px-4 py-6"
                  style={{ height: "180px" }}
                >
                  <div className="mb-3 text-xl font-bold text-white">{item.title}</div>
                  <div className="flex flex-wrap gap-2">
                    {item.items.map((sub) => (
                      <span
                        key={sub}
                        className="flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-1 text-xs text-red-400"
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${cardDots[i % cardDots.length]}`} />
                        {sub}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
