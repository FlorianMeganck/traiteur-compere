"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Phone, Sparkles, FileText } from "lucide-react";

export default function StickyMobileBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById("hero-section");
      const threshold = heroEl ? Math.max(320, heroEl.offsetHeight - 120) : 520;
      setIsVisible(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      role="region"
      aria-label="Actions rapides"
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-[#E8E2D5] p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-md mx-auto flex items-center gap-2">
        {/* Bouton 1 (Doré) : Menus Fêtes 2026 */}
        <Link
          href="/menus-fetes"
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#D4AF37] hover:bg-[#c29d2f] text-[#111111] font-bold text-xs uppercase tracking-wider py-3 px-3.5 rounded-xl shadow-2xs transition-colors whitespace-nowrap"
        >
          <Sparkles size={14} className="shrink-0" />
          <span>Menus Fêtes 2026</span>
        </Link>

        {/* Bouton 2 (Ghost/Icon) : Téléphone cliquable direct */}
        <a
          href="tel:+32468385082"
          aria-label="Appeler Traiteur Compère au +32 468 38 50 82"
          className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-[#D4AF37]/50 bg-[#FAF8F5] text-[#1A1A1A] hover:bg-[#D4AF37]/15 transition-colors shrink-0"
        >
          <Phone size={18} className="text-[#996515]" />
        </a>

        {/* Bouton 3 (Neutre) : Devis */}
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-1.5 bg-[#1A1A1A] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-colors shrink-0"
        >
          <FileText size={14} className="text-[#D4AF37] shrink-0" />
          <span>Devis</span>
        </Link>
      </div>
    </div>
  );
}
