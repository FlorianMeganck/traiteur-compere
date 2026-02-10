"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

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

      {/* --- 1. HERO SECTION (Parallax) --- */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/images/hero_v3.png" // Using v3 purely based on likelihood of being newest
            alt="Traiteur Compère Hero"
            fill
            className="object-cover brightness-75" // Darkened for text legibility despite white navbar request - user said "Garde l'image sombre ou mets un overlay"
            priority
          />
          {/* Overlay to ensure Navbar visibility if needed, but brightness-75 might be enough. Adding subtle gradient. */}
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ y: textY }}
          className="relative z-10 text-center px-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-wide drop-shadow-lg"
          >
            L&apos;Excellence du Goût
          </motion.h1>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 100 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="w-[1px] bg-white/50 mx-auto mt-12"
          />
        </motion.div>
      </section>

      {/* --- 2. STORY SECTION (Storytelling) --- */}
      <HistorySection />

      {/* --- 3. SERVICES SECTION (Interactive Grid) --- */}
      <ServicesSection />

      {/* --- 4. AMBIENCE & PROOFS (Mosaic) --- */}
      <AmbienceSection />

    </main>
  );
}

// --- SUB-SECTIONS ---

function HistorySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const floatY = useTransform(scrollYProgress, [0, 1], [50, -50]); // Floating effect

  return (
    <section ref={ref} className="relative py-32 px-6 bg-white overflow-hidden">
      {/* Guidelines */}
      <div className="absolute left-12 top-0 bottom-0 w-[1px] bg-gray-100 hidden md:block" />
      <div className="absolute right-12 top-0 bottom-0 w-[1px] bg-gray-100 hidden md:block" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="text-[#D4AF37] text-sm uppercase tracking-[0.3em] mb-6 block"
        >
          Notre Histoire
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl font-serif text-black mb-12 leading-tight"
        >
          Une cuisine de passion, <br />
          un héritage de saveurs.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg text-gray-500 font-light leading-relaxed max-w-2xl mx-auto"
        >
          Depuis nos débuts à Saint-Georges-sur-Meuse, nous cultivons l&apos;art de recevoir.
          Chaque plat est une invitation au voyage, composé avec des produits locaux
          et sublimé par une touche de modernité.
        </motion.p>
      </div>

      {/* Floating Decorative Element (Parallax) */}
      <motion.div
        style={{ y: floatY }}
        className="absolute top-1/2 right-[5%] md:right-[15%] w-32 md:w-48 opacity-20 pointer-events-none z-0 grayscale"
      >
        {/* Placeholder for "Branch/Plate" - reusing chef image cropped circle or similar? 
                    Actually user suggested standard image. Let's use a subtle chef detail if possible,
                    or just the logo mark. Let's use the 'leaf' from the logo conceptually or just a div
                */}
        <Image
          src="/images/chef.png"
          alt="Decorative"
          width={200}
          height={200}
          className="rounded-full blur-[2px]"
        />
      </motion.div>
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
      image: "/images/banquet.png", // Using banquet for particulary
      desc: "Fêtez vos moments précieux.",
      link: "/services#particulier"
    }
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-24">
          <h2 className="text-4xl font-serif text-black">Nos Univers</h2>
          <div className="w-[1px] h-16 bg-gray-200 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-24">
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
        <div className="w-full aspect-[3/4] overflow-hidden relative mb-8">
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
            {/* Overlay on hover for better text contrast if we had text over image, but here we don't. 
                            Maybe subtle gold washer? 
                        */}
          </motion.div>
        </div>

        {/* Vertical Line Interaction */}
        <div className="h-12 w-[1px] bg-gray-200 group-hover:bg-[#D4AF37] group-hover:h-20 transition-all duration-500 ease-in-out mb-6"></div>

        {/* Title */}
        <h3 className="text-2xl font-serif text-black tracking-wide group-hover:text-[#D4AF37] transition-colors duration-300">
          {title}
        </h3>

        {/* Description Fade In */}
        <div className="h-8 mt-2 overflow-hidden">
          <p className="text-sm text-gray-500 font-light translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out opacity-0 group-hover:opacity-100">
            {desc}
          </p>
        </div>
      </div>
    </Link>
  );
}

function AmbienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const photos = [
    { src: "/images/wedding.png", aspect: "aspect-square" },
    { src: "/images/chef.png", aspect: "aspect-[3/4]" },
    { src: "/images/banquet.png", aspect: "aspect-video md:col-span-2" },
  ];

  return (
    <section ref={ref} className="py-32 bg-neutral-50 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 max-w-2xl mx-auto"
        >
          <span className="text-6xl text-[#D4AF37] font-serif leading-none block mb-6">&ldquo;</span>
          <p className="text-2xl md:text-3xl font-serif text-gray-800 italic leading-relaxed">
            La cuisine est un langage universel qui parle de générosité et de partage. Mon but est de créer l&apos;émotion à chaque bouchée.
          </p>
          <p className="mt-8 text-sm uppercase tracking-widest text-[#D4AF37] font-bold">
            — Jean-Paul Compère
          </p>
        </motion.div>

        {/* Mosaic */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 auto-rows-[200px] md:auto-rows-[300px]">
          {/* Photo 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden md:col-span-2 md:row-span-2 group"
          >
            <Image src="/images/banquet.png" alt="Ambiance Banquet" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </motion.div>

          {/* Photo 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative overflow-hidden md:col-span-1 md:row-span-1 group"
          >
            <Image src="/images/chef.png" alt="Notre Chef" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </motion.div>

          {/* Photo 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative overflow-hidden md:col-span-1 md:row-span-1 group"
          >
            <Image src="/images/wedding.png" alt="Ambiance Mariage" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </motion.div>

          {/* Photo 4 - Placeholder or re-use corporate */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative overflow-hidden md:col-span-2 md:row-span-1 bg-white flex items-center justify-center p-8 text-center group"
          >
            <div>
              <p className="font-serif text-xl italic text-gray-400 mb-2">Prêt à sublimer votre événement ?</p>
              <Link href="/contact" className="text-[#D4AF37] uppercase tracking-widest text-sm font-bold border-b border-[#D4AF37] pb-1 hover:text-black hover:border-black transition-all">
                Contactez-nous
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


