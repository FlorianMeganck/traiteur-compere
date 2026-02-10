"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";

// --- MAIN COMPONENT ---
export default function Services() {
    return (
        <main className="bg-white text-gray-900 font-sans selection:bg-[#D4AF37] selection:text-white pt-32 pb-20 overflow-hidden">

            {/* 1. INTRO & CHIFFRES */}
            {/* 1. INTRO & CHIFFRES */}
            <section className="px-6 mb-32 max-w-7xl mx-auto text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-serif text-black uppercase tracking-widest mb-8"
                >
                    CUISINER POUR VOUS
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-gray-600 font-sans font-light text-lg max-w-2xl mx-auto mb-16 italic"
                >
                    &ldquo;Parce que chaque événement est unique, nous mettons notre savoir-faire au service de vos envies. Une cuisine généreuse, locale et faite maison.&rdquo;
                </motion.p>

                {/* Key Figures - Reused logic from Homepage but cleaner for this context */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center justify-center max-w-5xl mx-auto">
                    <Counter end={60} label="Événements réussis" />
                    <Counter end={430} suffix="+" label="Invités régalés" />
                    <Counter end={6} label="Années de passion" />
                </div>
            </section>

            {/* 2. PARTICULIERS (Texte Gauche / Mosaïque Droite) */}
            {/* 2. PARTICULIERS (Texte Gauche / Mosaïque Droite) */}
            <SectionService
                title="VOS FÊTES DE FAMILLE"
                quote="On a enfin pu profiter de notre fête sans passer la soirée en cuisine. Tout le monde s'est régalé !"
                quoteAuthor="— Sophie & Marc"
                desc="Un anniversaire, un baptême ou simplement un repas entre amis ? Nous nous occupons de tout pour que vous puissiez profiter de vos invités. Buffet froid, échoppes chaudes ou service à table : on s'adapte à l'ambiance que vous voulez donner."
                ctaLabel="Voir les formules"
                images={[
                    "https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=800&auto=format&fit=crop", // Friendly dinner
                    "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop", // Buffet
                    "https://images.unsplash.com/photo-1570560258879-af7f8e1447ac?q=80&w=800&auto=format&fit=crop", // Cheers
                    "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=800&auto=format&fit=crop"  // Food detail
                ]}
                decorType="herb"
                reverse={false}
            />

            {/* 3. ENTREPRISES (Mosaïque Gauche / Texte Droite) */}
            {/* 3. ENTREPRISES (Mosaïque Gauche / Texte Droite) */}
            <SectionService
                title="VOS ÉVÉNEMENTS PRO"
                quote="Ponctuel, discret et surtout très bon. Nos collaborateurs nous en parlent encore."
                quoteAuthor="— Société Technifutur"
                desc="Du sandwich garnis pour une réunion rapide au cocktail dînatoire pour vos vœux d'entreprise. Nous savons que votre image est en jeu, c'est pourquoi nous garantissons un service fluide et une qualité constante."
                ctaLabel="Demander un devis"
                images={[
                    "https://images.unsplash.com/photo-1519671482538-518b78af94ea?q=80&w=800&auto=format&fit=crop", // Corporate vibe
                    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop", // Serving
                    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop", // Fine food
                    "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop"  // Event hall
                ]}
                decorType="geometric"
                reverse={true}
            />

            {/* 4. MARIAGES (Texte Gauche / Mosaïque Droite) */}
            {/* 4. MARIAGES (Texte Gauche / Mosaïque Droite) */}
            <SectionService
                title="VOTRE MARIAGE"
                quote="Jean-Paul a été à l'écoute de nos demandes du début à la fin. Le jour J, tout était parfait et délicieux."
                quoteAuthor="— Julie & Thomas"
                desc="Le repas est au cœur de cette journée spéciale. Nous prenons le temps de vous rencontrer pour construire un menu qui vous ressemble, en respectant votre budget et vos goûts. Pas de stress, on gère."
                ctaLabel="En discuter ensemble"
                images={[
                    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop", // Wedding table
                    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop", // Wedding detail
                    "https://images.unsplash.com/photo-1520854221256-17451cc330e7?q=80&w=800&auto=format&fit=crop", // Cake/Dessert
                    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop"  // Bride/Couple
                ]}
                decorType="flower"
                reverse={false}
            />

            {/* Call to Action Footer */}
            <section className="bg-neutral-50 py-32 text-center px-6 mt-32">
                <div className="max-w-2xl mx-auto space-y-8">
                    <h2 className="text-3xl font-serif text-black">Un projet particulier ?</h2>
                    <p className="text-gray-500 font-light">
                        Discutons de vos envies et créons ensemble un menu sur mesure.
                    </p>
                    <Link href="/contact" className="inline-block border border-black px-12 py-4 uppercase tracking-widest text-sm font-bold hover:bg-black hover:text-white transition-all duration-300">
                        Demander un devis
                    </Link>
                </div>
            </section>

        </main>
    );
}

// --- REUSABLE COMPONENTS ---

function SectionService({ title, quote, quoteAuthor, desc, ctaLabel = "En savoir plus", images, decorType, reverse }: {
    title: string, quote: string, quoteAuthor?: string, desc: string, ctaLabel?: string, images: string[], decorType: 'flower' | 'herb' | 'geometric', reverse: boolean
}) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]); // Floating parallax for decor

    // Decor Image Selection (Using Unsplash placeholders that look like decor or abstract shapes)
    // In a real project, these would be local transparent PNGs.
    const decorSrc =
        decorType === 'flower' ? "https://images.unsplash.com/photo-1490750967868-58cb9bdda31c?q=80&w=400&auto=format&fit=crop" : // Flower
            decorType === 'herb' ? "https://images.unsplash.com/photo-1515276427842-f85802d514a2?q=80&w=400&auto=format&fit=crop" : // Rosemary/Greenery
                "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop"; // Abstract lines

    return (
        <section ref={ref} className="relative py-32 w-full overflow-hidden">

            {/* A. TEXTURE LAYER (Background Beige Block) */}
            <div
                className={`absolute top-0 bottom-0 bg-[#F9F7F1] w-[80%] md:w-[65%] -z-10 
                ${reverse ? 'left-0 rounded-r-3xl' : 'right-0 rounded-l-3xl'}
                transition-all duration-700 ease-out`}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className={`flex flex-col md:flex-row items-center gap-16 md:gap-24 ${reverse ? 'md:flex-row-reverse' : ''}`}>

                    {/* B. CONTENT EDITORIAL */}
                    <motion.div
                        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full md:w-5/12 space-y-8"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif uppercase tracking-widest text-black">
                            {title}
                        </h2>

                        <div className="border-l border-gray-300 pl-6 py-2">
                            <p className="font-serif italic text-gray-400 text-lg">
                                &ldquo;{quote}&rdquo;
                            </p>
                            {quoteAuthor && (
                                <p className="font-sans text-xs uppercase tracking-widest text-gray-500 mt-2">
                                    {quoteAuthor}
                                </p>
                            )}
                        </div>

                        <p className="text-gray-600 font-sans font-light leading-relaxed text-lg">
                            {desc}
                        </p>

                        <div className="pt-4">
                            <Link href="/contact" className="group inline-flex items-center text-sm font-bold uppercase tracking-widest text-black">
                                {ctaLabel}
                                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#D4AF37] w-full absolute bottom-0"></span>
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </Link>
                        </div>
                    </motion.div>

                    {/* C. MOSAIC GRID (2x2) */}
                    <div className="w-full md:w-7/12 relative">
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            {images.map((img, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 + (idx * 0.1) }}
                                    className={`relative aspect-[3/4] overflow-hidden shadow-2xl shadow-neutral-200
                                        ${idx === 1 ? 'mt-8 md:mt-12' : ''} 
                                        ${idx === 2 ? '-mt-8 md:-mt-12' : ''}
                                    `}
                                >
                                    <Image
                                        src={img}
                                        alt={`${title} ${idx + 1}`}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {/* D. FLOATING DECOR */}
                        <motion.div
                            style={{ y }}
                            className={`absolute -z-10 w-48 md:w-64 opacity-20 pointer-events-none grayscale mix-blend-multiply
                                ${reverse ? '-right-12 -bottom-12' : '-left-12 -top-12'}
                            `}
                        >
                            <Image
                                src={decorSrc}
                                alt="Decor"
                                width={300}
                                height={300}
                                className="mask-image-gradient" // Concept class, would need CSS or rounded-full
                                style={{ borderRadius: '50%' }}
                            />
                        </motion.div>
                    </div>

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
            <p className="text-gray-400 uppercase tracking-widest text-xs md:text-sm">
                {label}
            </p>
        </div>
    );
}
