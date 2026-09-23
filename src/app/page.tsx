"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import Services from "./home/Services";
import TechnicalDepth from "./home/TechnicalDepth";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const metrics = [
  { value: "12+", label: "Hardware Projects" },
  { value: "6+", label: "International Clients" },
  { value: "100%", label: "Engineering-Led" },
];

export default function Home() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const glowY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const orbX = useTransform(glowX, [-0.5, 0.5], [-30, 30]);
  const orbY = useTransform(glowY, [-0.5, 0.5], [-30, 30]);
  return (
    <div className="min-h-screen font-sans">
      {/* Hero Section — animated with pre-existing libs only: framer-motion + lucide-react */}
      <main
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950 text-white"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mouseX.set((e.clientX - r.left) / r.width - 0.5);
          mouseY.set((e.clientY - r.top) / r.height - 0.5);
        }}
      >
        {/* Ambient background — motion orbs (framer-motion, no custom lib) */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            style={{ x: orbX, y: orbY }}
            className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-red-600/25 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-orange-500/15 rounded-full blur-3xl"
            animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-[46rem] h-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <span className="absolute -top-2 left-1/2 w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
            <span className="absolute top-1/2 -right-2 w-2 h-2 rounded-full bg-orange-400" />
            <span className="absolute bottom-8 left-8 w-2 h-2 rounded-full bg-red-400/70" />
            <span className="absolute top-10 right-10 w-2 h-2 rounded-full bg-red-400/70" />
          </motion.div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32 text-left overflow-hidden"
          style={{ maxWidth: '100%', width: '100%' }}
        >
          <motion.h1
            variants={item}
            className="font-bold tracking-tight leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 6.5rem)' }}
          >
            DESIGN.
            <br />
            ENGINEER.
            <br />
            <motion.span
              className="bg-gradient-to-r from-red-400 via-orange-300 to-red-500 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% auto" }}
            >
              BUILD.
            </motion.span>{" "}
            SCALE.
          </motion.h1>

          <motion.p
            variants={item}
            className="text-base md:text-xl text-zinc-400 mb-10 leading-relaxed"
            style={{ maxWidth: '85vw' }}
          >
            End-to-end solar, battery systems, and custom PCB design of any
            kind — from simple boards to complex systems, from concept to
            production.
          </motion.p>

          <motion.div variants={item} className="flex flex-col gap-4 mb-14">
            <Link href="/quote-request?service=pcb">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-3 md:px-6 md:py-4 bg-red-600 text-white rounded-full font-semibold text-base md:text-lg shadow-lg shadow-red-600/30">
                Start a Project <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </div>
            </Link>
            <Link href="/work">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-3 md:px-6 md:py-4 bg-white/10 border border-white/15 text-white rounded-full font-semibold text-base md:text-lg backdrop-blur-md">
                View Projects
              </div>
            </Link>
          </motion.div>

          {/* Tech marquee — framer-motion only, no custom CSS */}
          <motion.div variants={item} className="overflow-hidden mb-12 opacity-70">
            <div className="flex gap-8 flex-wrap text-sm uppercase tracking-widest text-zinc-500" style={{ maxWidth: '100%' }}>
              {["PCB Design", "Prototyping", "PCB Layout", "Assembly", "Manufacturing", "Any Application"].map((t, i) => (
                <span key={`${t}-${i}`} className="flex items-center gap-4">
                  {t} <span className="text-red-500">•</span>
                </span>
              ))}
            </div>
          </motion.div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md px-4 py-5"
              >
                <div className="text-2xl md:text-3xl font-bold text-white">{m.value}</div>
                <div className="text-xs text-zinc-400 mt-1">{m.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-14 flex justify-start"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-zinc-500 text-xs uppercase tracking-widest"
            >
              Scroll <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      <Services />
      <TechnicalDepth />
    </div>
  );
}
