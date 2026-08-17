"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, animate } from "framer-motion";

export default function Home() {
  return (
    <main className="bg-white text-gray-800 font-sans selection:bg-[#D4AF37] selection:text-white overflow-hidden">

      <section className="relative w-full min-h-[660px] md:min-h-[740px] h-auto md:h-screen flex items-center justify-center overflow-hidden pb-16 md:pb-24">
        {/* Image d'arrière-plan */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-traiteur.png"
            alt="Traiteur Compère - Buffet de réception"
            fill
            className="object-cover"
            priority
          />
          {/* Voile sombre pour faire ressortir le texte */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Contenu centré */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto pt-32 md:pt-40 pb-8">

          {/* Titre principal (Police Serif élégante) */}
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-4 drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
            Traiteur Compère
          </h1>

          {/* Sous-titre / Date de fondation (Doré) */}
          <h2 className="text-xl md:text-2xl font-medium text-[#D4AF37] mb-6 tracking-wide drop-shadow-md">
            Maison fondée en 1821
          </h2>

          {/* Paragraphe court */}
          <p className="text-lg md:text-xl text-neutral-100 mb-8 max-w-2xl font-light drop-shadow">
            Savoir-faire bicentenaire d&apos;exception au service de vos événements les plus précieux.
          </p>

          {/* Container des boutons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">

            {/* Bouton 1 : Qui sommes-nous ? (Ghost Doré) */}
            <Link
              href="/a-propos"
              className="inline-flex items-center justify-center px-10 py-4 rounded-full border-2 border-[#D4AF37] text-[#D4AF37] font-bold uppercase tracking-widest text-sm hover:bg-[#D4AF37] hover:text-black transition-all duration-300 w-full sm:w-auto shadow-sm"
            >
              Qui sommes-nous ?
            </Link>

            {/* Bouton 2 : Découvrez nos formules (Plein Noir) */}
            <Link
              href="/formules"
              className="inline-flex items-center justify-center px-10 py-4 rounded-full border-2 border-black bg-black text-white font-bold uppercase tracking-widest text-sm hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 w-full sm:w-auto shadow-md"
            >
              Découvrez nos formules
            </Link>
          </div>
        </div>
      </section>

      {/* --- 2. SERVICES SECTION (Moved Up & Overlap) --- */}
      <ServicesSection />

      {/* --- 3. REVIEWS SECTION (New) --- */}
      <ReviewsSection />

      {/* --- 4. KEY FIGURES (Stats) --- */}
      <KeyFiguresSection />

      {/* --- 5. CONTACT CTA (New/Extracted) --- */}
      <ContactCTA />

    </main>
  );
}

// --- SUB-SECTIONS ---

function ReviewsSection() {
  const reviews = [
    {
      text: "Organisation parfaite pour notre séminaire d'entreprise. Le buffet était délicieux et le service impeccable. Merci !",
      author: "Michel B."
    },
    {
      text: "Le barbecue de notre mariage a fait l'unanimité ! Viande incroyable, crudités fraîches et équipe super sympa. Je recommande à 100%.",
      author: "Sophie L."
    },
    {
      text: "Un anniversaire inoubliable grâce au Traiteur Compère. Plats copieux, savoureux et livraison à l'heure. Top !",
      author: "Jean-Pierre D."
    },
    {
      text: "Produits de grande qualité, présentation soignée et professionnalisme au rendez-vous. La notoriété de la maison est bien méritée.",
      author: "Nadine C."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000); // 6 seconds interval
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <section className="py-24 bg-[#FAF9F6] text-center px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Decorative Separator */}
        <div className="w-[1px] h-12 bg-[#D4AF37] mb-8"></div>

        <h2 className="text-3xl md:text-4xl font-serif text-black mb-16">
          Vos Avis
        </h2>

        <div className="relative w-full min-h-[160px] md:min-h-[120px] flex items-center justify-center mb-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: index === currentIndex ? 1 : 0,
                x: index === currentIndex ? 0 : index < currentIndex ? -20 : 20,
                zIndex: index === currentIndex ? 10 : 0
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className={`absolute w-full px-4 ${index === currentIndex ? 'pointer-events-auto' : 'pointer-events-none'}`}
            >
              <p className="text-xl md:text-2xl text-gray-800 italic font-serif leading-relaxed mb-8 max-w-3xl mx-auto">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="text-sm md:text-base uppercase tracking-widest text-[#D4AF37] font-semibold">
                — {review.author}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex gap-4 mt-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-[#D4AF37] scale-125" : "bg-gray-300 hover:bg-gray-400"}`}
              aria-label={`Aller à l'avis ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      title: "Événements d'Entreprise",
      image: "/images/entreprise.jpeg",
      desc: "Séminaires, cocktails dînatoires ou repas d'équipe : marquez les esprits de vos collaborateurs et clients avec un service traiteur irréprochable et savoureux.",
      link: "/services#entreprises"
    },
    {
      title: "Votre Mariage",
      image: "/images/wedding_table.png",
      desc: "Du vin d'honneur au dessert, nous sublimons le plus beau jour de votre vie. Une prestation sur mesure, raffinée et inoubliable pour régaler vos convives.",
      link: "/services#mariages"
    },
    {
      title: "Événements Privés",
      image: "/images/banquet.png",
      desc: "Baptêmes, anniversaires ou fêtes de famille : profitez pleinement de vos proches, nous nous occupons de tout pour créer des moments gourmands et conviviaux à domicile.",
      link: "/services#particuliers"
    }
  ];

  return (
    <section className="relative z-30 -mt-6 md:-mt-12 pt-16 pb-24 bg-white rounded-t-[2rem] md:rounded-t-[3rem] shadow-2xl mx-4 md:mx-12 lg:mx-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-black">Pour tous vos événements</h2>
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
        {/* Image Container - Added rounded-2xl and overflow-hidden */}
        <div className="w-full aspect-[3/4] overflow-hidden relative mb-8 shadow-md rounded-2xl">
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

          <Counter end={200} label="Réalisations Culinaires" />
          <Counter end={10000} suffix="+" label="Convives Régalés" />
          <Counter end={47} label="Événements Publics d'Exception" />
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
