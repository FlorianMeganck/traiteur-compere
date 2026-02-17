"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";

export default function Home() {
  // Parallax Setup for Hero
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "50%"]);
  const textY = useTransform(heroScroll, [0, 1], ["0%", "100%"]);

  return (
    <main className="bg-white text-gray-800 font-sans selection:bg-[#D4AF37] selection:text-white overflow-hidden">

      {/* --- 1. HERO SECTION (Modified) --- */}
      <section ref={heroRef} className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/images/hero_v3.png"
            alt="Traiteur Compère Hero"
            fill
            className="object-cover" // Removed brightness-75 to let overlay handle darkening
            priority
          />
          {/* Overlay - Darker as requested */}
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ y: textY }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-wide drop-shadow-lg font-bold mb-6"
          >
            Votre Traiteur d&apos;Excellence à Saint-Georges
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-lg md:text-2xl text-white/90 font-light mb-10 max-w-3xl mx-auto"
          >
            Mariages, Entreprises & Événements privés : Une cuisine authentique et généreuse.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link
              href="/formules"
              className="inline-block bg-[#D4AF37] text-white text-lg md:text-xl font-semibold py-4 px-10 rounded-full hover:bg-white hover:text-[#D4AF37] transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Découvrez nos Formules
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* --- 2. SPECIALTIES SECTION (New) --- */}
      <SpecialtiesSection />

      {/* --- 3. SERVICES SECTION (Was "Nos Univers") --- */}
      <ServicesSection />

      {/* --- 4. KEY FIGURES (Stats) --- */}
      <KeyFiguresSection />

      {/* --- 5. CONTACT CTA (New/Extracted) --- */}
      <ContactCTA />

    </main>
  );
}

// --- SUB-SECTIONS ---

function SpecialtiesSection() {
  const specialties = [
    {
      title: "Buffets Froids",
      image: "/images/banquet.png", // Using banquet for cold buffet
      link: "/formules"
    },
    {
      title: "Barbecue & Grillades",
      image: "/images/chef.png", // Placeholder for Grill - maybe chef working on something?
      link: "/formules"
    },
    {
      title: "Buffets Chauds & Gala",
      image: "/images/wedding.png", // Using wedding for hot/gala
      link: "/formules"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-black">Nos Spécialités</h2>
          <div className="w-[1px] h-12 bg-[#D4AF37] mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specialties.map((item, index) => (
            <Link href={item.link} key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden aspect-[4/5] mb-6 rounded-sm">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <h3 className="text-2xl font-serif text-center text-black group-hover:text-[#D4AF37] transition-colors">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      title: "Mariages",
      image: "/images/wedding.png",
      desc: "Pour le plus beau jour de votre vie.",
      link: "/services#mariage"
    },
    {
      title: "Entreprises",
      image: "/images/corporate.png",
      desc: "Impressionnez vos collaborateurs.",
      link: "/services#entreprise"
    },
    {
      title: "Particuliers",
      image: "/images/banquet.png",
      desc: "Fêtez vos moments précieux.",
      link: "/services#particulier"
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-black">Pour tous vos événements</h2>
          <div className="w-[1px] h-12 bg-gray-300 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ title, image, desc, link }: { title: string, image: string, desc: string, link: string }) {
  return (
    <Link href={link} className="group block cursor-pointer">
      <div className="flex flex-col items-center">
        {/* Image Container */}
        <div className="w-full aspect-[3/4] overflow-hidden relative mb-8 shadow-md">
          <motion.div
            className="w-full h-full relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-serif text-black tracking-wide group-hover:text-[#D4AF37] transition-colors duration-300 mb-2">
          {title}
        </h3>

        <p className="text-gray-500 font-light text-center">
          {desc}
        </p>
      </div>
    </Link>
  );
}

function ContactCTA() {
  return (
    <section className="py-24 bg-white text-center px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-serif text-black mb-6">Prêt à réserver ?</h2>
        <p className="text-lg text-gray-500 mb-10 font-light">
          Discutons de votre projet et créons ensemble un événement inoubliable.
        </p>
        <Link
          href="/contact"
          className="inline-block border-b-2 border-[#D4AF37] text-[#D4AF37] text-xl font-bold tracking-widest uppercase pb-2 hover:text-black hover:border-black transition-all"
        >
          Contactez-nous
        </Link>
      </div>
    </section>
  );
}

function KeyFiguresSection() {
  return (
    <section className="py-24 bg-[#F9F7F1]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Intro */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-4">
            NOTRE PARCOURS EN CHIFFRES
          </h2>
          <p className="font-serif text-xl md:text-2xl text-gray-800 italic leading-relaxed">
            &ldquo;Derrière chaque chiffre se cache une histoire, une rencontre et une passion intacte pour la gastronomie. Voici un aperçu de notre aventure à vos côtés.&rdquo;
          </p>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center relative">
          <div className="hidden md:block absolute left-1/3 top-0 bottom-0 w-[1px] bg-gray-200"></div>
          <div className="hidden md:block absolute right-1/3 top-0 bottom-0 w-[1px] bg-gray-200"></div>

          <Counter end={60} label="Réalisations Culinaires" />
          <Counter end={430} suffix="+" label="Convives Régalés" />
          <Counter end={6} label="Événements Publics d'Exception" />
        </div>
      </div>
    </section>
  );
}

function Counter({ end, suffix = "", label }: { end: number, suffix?: string, label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, end, {
        duration: 2.5,
        ease: "circOut",
        onUpdate: (latest) => setCount(Math.floor(latest))
      });
      return controls.stop;
    }
  }, [isInView, end]);

  return (
    <div ref={ref} className="text-center p-4">
      <p className="text-6xl md:text-7xl font-serif text-black mb-2">
        {count}{suffix}
      </p>
      <p className="text-gray-500 uppercase tracking-widest text-xs md:text-sm">
        {label}
      </p>
    </div>
  );
}


