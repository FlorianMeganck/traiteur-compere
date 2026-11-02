"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function GoldenThread() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0.08, 1]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 z-0 pointer-events-none hidden md:block"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 600"
      >
        <defs>
          <linearGradient id="homeGoldThread" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.1" />
            <stop offset="12%" stopColor="#D4AF37" stopOpacity="0.32" />
            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.38" />
            <stop offset="88%" stopColor="#D4AF37" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Trace continue champagne très douce */}
        <path
          d="M 50 0
             C 50 35, 30 55, 30 105
             C 30 155, 70 175, 70 225
             C 70 275, 30 295, 30 345
             C 30 395, 70 415, 70 465
             C 70 515, 50 555, 50 600"
          fill="none"
          stroke="#E8E2D5"
          strokeWidth="0.35"
        />

        {/* Fil conducteur doré qui se dessine au fil du scroll */}
        <motion.path
          d="M 50 0
             C 50 35, 30 55, 30 105
             C 30 155, 70 175, 70 225
             C 70 275, 30 295, 30 345
             C 30 395, 70 415, 70 465
             C 70 515, 50 555, 50 600"
          fill="none"
          stroke="url(#homeGoldThread)"
          strokeWidth="0.45"
          style={{ pathLength }}
        />
      </svg>
    </div>
  );
}
