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

                {/* Values Section - Replacing Key Figures */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-center max-w-6xl mx-auto mt-24">
                    <ValueItem
                        title="Fait Maison & Local"
                        path="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        desc="Pas de secret : pour que ce soit bon, il faut de bons produits. Nous privilégions les producteurs de la région et la cuisine faite minute."
                        delay={0.1}
                    />
                    <ValueItem
                        title="Sur Mesure & Écoute"
                        path="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21 1.01.33 2.05.33 3.1 0 5.5-4.5 10-10 10z"
                        desc="Un régime spécial ? Une envie particulière ? Nous ne vous imposons rien. Nous construisons le menu avec vous pour qu'il vous ressemble."
                        delay={0.2}
                    />
                    <ValueItem
                        title="Transparence Totale"
                        path="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
                        desc="Pas de mauvaise surprise sur la facture. Nos devis sont clairs, détaillés et respectés. La confiance, c'est la base de notre métier."
                        delay={0.3}
                    />
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

function ValueItem({ title, desc, path, delay }: { title: string, desc: string, path: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className="flex flex-col items-center px-4"
        >
            <div className="w-12 h-12 mb-6 text-[#D4AF37]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d={path} />
                </svg>
            </div>
            <h3 className="font-serif text-xl text-black mb-4 uppercase tracking-widest">{title}</h3>
            <p className="text-gray-500 font-light text-sm leading-relaxed">
                {desc}
            </p>
        </motion.div>
    );
}
