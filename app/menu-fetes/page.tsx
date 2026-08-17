"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, Calendar, Gift, ChevronRight } from "lucide-react";

export default function MenuFetesPage() {
  const festiveCategories = [
    {
      title: "Menu Réveillon de Noël",
      subtitle: "Surprenez vos invités avec une sélection festive et raffinée",
      image: "/images/hero-traiteur.png",
      badge: "24 & 25 Décembre",
      menuItems: [
        "Foie gras de canard artisanal & chutney de figues au porto",
        "Noix de Saint-Jacques poêlées, émulsion au champagne",
        "Filet de biche aux airelles & purée de potimarron à la truffe",
        "Bûche signature aux trois chocolats & éclats de noisettes"
      ]
    },
    {
      title: "Menu Saint-Sylvestre",
      subtitle: "Célébrez le passage à la nouvelle année dans l'élégance",
      image: "/images/banquet.png",
      badge: "31 Décembre & 1er Janvier",
      menuItems: [
        "Cocktail apéritif prestige & amuses-bouches festifs",
        "Carpaccio de langoustines à la meule d'agrumes",
        "Supreme de poularde farcie aux morilles & mousseline de céleri",
        "Créations sucrées & mignardises de la Saint-Sylvestre"
      ]
    }
  ];

  return (
    <main className="bg-white text-gray-800 font-sans min-h-screen pt-36 md:pt-40 pb-20 selection:bg-[#D4AF37] selection:text-white">

      {/* Hero Section */}
      <section className="relative bg-[#0F0F0F] text-white py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-[#D4AF37]_1px,transparent_1px] [background-size:24px_24px]"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] text-xs uppercase tracking-widest font-semibold">
            <Gift size={14} /> Saison des Fêtes 2026
          </div>

          <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight">
            Menus d'Exception pour vos Fêtes
          </h1>

          <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            Découvrez nos compositions gastronomiques exclusives conçues pour illuminer vos réveillons et célébrations de fin d'année.
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <a
              href="#menus"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-sm hover:bg-[#c29f2e] transition-all shadow-lg"
            >
              Découvrir la carte
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Menus List Section */}
      <section id="menus" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-5xl font-serif text-black">Nos Suggestions de Fêtes</h2>
          <p className="text-neutral-500 max-w-lg mx-auto font-light">
            Préparés avec passion à partir de produits frais et nobles du terroir.
          </p>
          <div className="w-[1px] h-10 bg-[#D4AF37] mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {festiveCategories.map((festive, index) => (
            <div key={index} className="bg-[#FAF9F6] border border-neutral-200 rounded-3xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="relative h-64 w-full">
                <Image
                  src={festive.image}
                  alt={festive.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider mb-2">
                      <Calendar size={12} /> {festive.badge}
                    </span>
                    <h3 className="text-2xl font-serif text-white">{festive.title}</h3>
                  </div>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <p className="text-neutral-600 italic text-sm mb-6">{festive.subtitle}</p>
                  <ul className="space-y-4">
                    {festive.menuItems.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-3 text-neutral-800 text-sm">
                        <span className="text-[#D4AF37] font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-neutral-200 flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-neutral-400">Réservation à l'avance</span>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-[#D4AF37] font-bold text-sm uppercase tracking-wider hover:text-black transition-colors"
                  >
                    Pré-réserver <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Callout */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="bg-[#111] text-white rounded-3xl p-8 md:p-12 text-center space-y-4 border border-[#D4AF37]/30 shadow-xl">
          <Sparkles className="mx-auto text-[#D4AF37]" size={32} />
          <h3 className="text-2xl md:text-3xl font-serif text-white">Besoin d'un menu sur-mesure pour vos fêtes ?</h3>
          <p className="text-neutral-300 max-w-xl mx-auto font-light text-sm md:text-base">
            Notre chef s'adapte à vos envies et vos contraintes alimentaires pour composer votre repas idéal.
          </p>
          <div className="pt-4">
            <Link
              href="/contact"
              className="inline-block px-8 py-3.5 rounded-full border-2 border-[#D4AF37] text-[#D4AF37] font-bold uppercase tracking-wider text-xs md:text-sm hover:bg-[#D4AF37] hover:text-black transition-all"
            >
              Demander un devis festif
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
