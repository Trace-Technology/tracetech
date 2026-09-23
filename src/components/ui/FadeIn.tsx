"use client";

import { motion, Variants, useInView } from "framer-motion";
import { useRef } from "react";

interface FadeInProps {
  delay?: number;
  duration?: number;
  children: React.ReactNode;
  className?: string;
}

const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function FadeIn({
  delay = 0,
  duration = 0.6,
  children,
  className = "",
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      variants={fadeInVariants}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      transition={{ delay: delay * 0.1, duration }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
