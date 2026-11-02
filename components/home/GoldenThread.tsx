"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function GoldenThread() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0.1, 1]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 z-0 pointer-events-none hidden md:block opacity-20"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 500"
      >
        {/* Trace de fond champagne douce */}
        <path
          d="M 50 0
             C 50 35, 32 55, 32 95
             C 32 135, 68 155, 68 195
             C 68 235, 34 255, 34 295
             C 34 335, 66 355, 66 395
             C 66 435, 50 465, 50 500"
          fill="none"
          stroke="#E8E2D5"
          strokeWidth="0.4"
        />
        {/* Fil conducteur doré animé au scroll */}
        <motion.path
          d="M 50 0
             C 50 35, 32 55, 32 95
             C 32 135, 68 155, 68 195
             C 68 235, 34 255, 34 295
             C 34 335, 66 355, 66 395
             C 66 435, 50 465, 50 500"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="0.45"
          style={{ pathLength }}
        />
      </svg>
    </div>
  );
}
