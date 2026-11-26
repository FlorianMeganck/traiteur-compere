"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const ENGAGEMENTS_ATELIER = [
    {
        num: "01",
        title: "Provenance & sélection des pièces",
        text: "Nous travaillons en circuit court avec des éleveurs et artisans de Hesbaye et de la province de Liège, dont la Boucherie Otte à Saint-Georges-sur-Meuse, afin de garantir la tenue, l'origine et la fraîcheur de chaque coupe.",
    },
    {
        num: "02",
        title: "Fait-maison & cuissons lentes",
        text: "Dans notre atelier de Fexhe-le-Haut-Clocher, chaque préparation repose sur la transmission du geste : fonds réduits, cuissons lentes, haute charcuterie et plats cuisinés au rythme des saisons, sans conservateurs industriels.",
    },
    {
        num: "03",
        title: "Arts de la table & service sur-mesure",
        text: "Du repas familial aux réceptions d'entreprise à Waremme, Liège, Ans, Awans, Crisnée, Bierset ou Hannut, nous veillons au dressage soigné, à la générosité des portions et à une organisation ponctuelle.",
    },
];

export default function About() {
    return (
        <main className="min-h-screen bg-[#FAF8F5] pt-40 md:pt-48 pb-24 font-sans text-neutral-800">
            {/* ================================================================= */}
            {/* HERO ÉDITORIAL                                                    */}
            {/* ================================================================= */}
            <section className="max-w-4xl mx-auto px-6 mb-24 md:mb-32 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.28em] text-[#996515] mb-5">
                        MAISON COMPÈRE • DEPUIS 1821
                    </p>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#111111] tracking-tight leading-[1.1] mb-8">
                        L&apos;Art de Recevoir en Hesbaye
                    </h1>
                    <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto mb-8" />
                    <blockquote className="text-lg sm:text-xl md:text-2xl font-serif italic text-neutral-700 leading-relaxed max-w-3xl mx-auto">
                        « Depuis deux siècles, notre Maison unit la rigueur bouchère aux arts de la table : sélection des pièces, cuissons lentes et dressage soigné pour vos réceptions en province de Liège. »
                    </blockquote>
                </motion.div>
            </section>

            {/* ================================================================= */}
            {/* CHRONOLOGIE DE LA MAISON EN 3 TEMPS                               */}
            {/* ================================================================= */}
            <section className="max-w-7xl mx-auto px-6 mb-28 md:mb-36">
                <div className="relative md:pl-12 md:border-l md:border-[#D4AF37]/30 space-y-24 md:space-y-32">

                    {/* TEMPS 1 : 1821 — Les origines en Hesbaye */}
                    <div className="relative">
                        <span
                            className="hidden md:block absolute -left-[53px] top-3 w-2.5 h-2.5 rounded-full bg-[#D4AF37] ring-4 ring-[#FAF8F5]"
                            aria-hidden="true"
                        />
                        <div className="flex flex-col lg:flex-row gap-14 lg:gap-16 items-start">
                            <motion.div
                                initial={{ opacity: 0, x: -24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="w-full lg:w-1/2"
                            >
                                <p className="text-5xl md:text-6xl font-serif text-[#D4AF37] leading-none mb-3">
                                    1821
                                </p>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#111111] mb-6 pb-4 border-b border-[#D4AF37]/30">
                                    Les origines en Hesbaye
                                </h2>
                                <div className="space-y-5 text-base sm:text-lg font-light leading-relaxed text-neutral-600 text-justify">
                                    <p>
                                        La Maison Compère voit le jour en 1821 à Oreye, le long de la grand-route. Fondée par notre arrière-arrière-grand-père, l&apos;adresse est alors une boucherie de village traditionnelle, consacrée à la découpe artisanale et au respect des morceaux.
                                    </p>
                                    <p>
                                        Lorsque le fondateur décède brutalement, renversé par sa propre charrette, son épouse reprend seule l&apos;étal. Par sa ténacité, elle maintient la clientèle locale et assure la transmission du geste au sein de l&apos;atelier familial.
                                    </p>
                                    <p>
                                        La génération suivante traverse la Première Guerre mondiale à Odeur, avant d&apos;établir la maison à Momalle, rue Fond du Ruisseau puis rue Michel Heyne 21. En 1996, la boucherie s&apos;ouvre au métier de traiteur événementiel, prolongeant ses recettes familiales depuis Fexhe-le-Haut-Clocher vers toute la province de Liège.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Mosaïque d'images d'archives */}
                            <motion.div
                                initial={{ opacity: 0, x: 24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.15 }}
                                className="w-full lg:w-1/2 grid grid-cols-2 gap-4 auto-rows-[190px]"
                            >
                                <div className="relative col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-lg border border-[#D4AF37]/20 group">
                                    <Image
                                        src="/images/histoire/Histoire1.jpeg"
                                        alt="Archives des fondateurs — Maison Compère depuis 1821 en Hesbaye"
                                        fill
                                        priority
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0 sepia-[.25]"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                </div>
                                <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#D4AF37]/20 group">
                                    <Image
                                        src="/images/histoire/Histoire2.jpeg"
                                        alt="Ancienne devanture historique de la Maison Compère"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0 sepia-[.25]"
                                        sizes="(max-width: 1024px) 50vw, 25vw"
                                    />
                                </div>
                                <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#D4AF37]/20 group">
                                    <Image
                                        src="/images/histoire/Histoire3.jpeg"
                                        alt="L'équipe artisanale d'antan"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0 sepia-[.25]"
                                        sizes="(max-width: 1024px) 50vw, 25vw"
                                    />
                                </div>
                                <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#D4AF37]/20 group hidden md:block">
                                    <Image
                                        src="/images/histoire/Histoire4.jpeg"
                                        alt="Outils traditionnels de découpe et haute charcuterie"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0 sepia-[.25]"
                                        sizes="(max-width: 1024px) 50vw, 25vw"
                                    />
                                </div>
                                <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#D4AF37]/20 group hidden md:block">
                                    <Image
                                        src="/images/histoire/Histoire5.jpeg"
                                        alt="Atelier de boucherie et préparations maison"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0 sepia-[.25]"
                                        sizes="(max-width: 1024px) 50vw, 25vw"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* TEMPS 2 : L'alliance avec la Boucherie Otte — La maîtrise de la viande */}
                    <div className="relative">
                        <span
                            className="hidden md:block absolute -left-[53px] top-3 w-2.5 h-2.5 rounded-full bg-[#D4AF37] ring-4 ring-[#FAF8F5]"
                            aria-hidden="true"
                        />
                        <div className="flex flex-col-reverse lg:flex-row gap-14 lg:gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="w-full lg:w-1/2 flex flex-col gap-6 relative h-auto md:block md:h-[480px] lg:h-[540px]"
                            >
                                <div className="relative md:absolute md:top-0 md:left-0 w-full md:w-[50%] aspect-square shadow-lg rounded-3xl overflow-hidden border border-[#D4AF37]/20">
                                    <Image
                                        src="/images/Maison_otte1.jpeg"
                                        alt="Emblème de la Boucherie Otte à Saint-Georges-sur-Meuse"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                    />
                                </div>
                                <div className="relative md:absolute md:bottom-0 md:right-0 w-full md:w-[70%] aspect-[4/3] shadow-lg rounded-3xl overflow-hidden border border-[#D4AF37]/20">
                                    <Image
                                        src="/images/Maison_otte2.jpeg"
                                        alt="Comptoir et ateliers de la Boucherie Otte"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 35vw"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="w-full lg:w-1/2"
                            >
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#996515] mb-2">
                                    Maîtrise de la viande
                                </p>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#111111] mb-6 pb-4 border-b border-[#D4AF37]/30">
                                    L&apos;alliance avec la Boucherie Otte
                                </h2>
                                <div className="space-y-5 text-base sm:text-lg font-light leading-relaxed text-neutral-600 text-justify">
                                    <p>
                                        Une maison de bouche se juge d&apos;abord sur la sélection des pièces. Pour nos buffets froids, nos rôtis et nos barbecues, nous avons noué un partenariat étroit avec la Boucherie Otte, établie à Saint-Georges-sur-Meuse.
                                    </p>
                                    <p>
                                        Aux côtés de Steve, son patron, nous choisissons nos bêtes en circuit court, suivons la maturation et veillons à la découpe artisanale. Cette entente garantit une traçabilité claire et une haute charcuterie préparée dans les règles du métier.
                                    </p>
                                    <div className="pt-2">
                                        <Link
                                            href="/formules#bbq"
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D4AF37] bg-white text-sm font-semibold text-[#111111] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all duration-300 shadow-xs"
                                        >
                                            <span>Découvrir notre sélection de viandes →</span>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* TEMPS 3 : Aujourd'hui avec Christophe Compère — L'atelier de réception moderne */}
                    <div className="relative">
                        <span
                            className="hidden md:block absolute -left-[53px] top-3 w-2.5 h-2.5 rounded-full bg-[#D4AF37] ring-4 ring-[#FAF8F5]"
                            aria-hidden="true"
                        />
                        <div className="flex flex-col lg:flex-row gap-14 lg:gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="w-full lg:w-6/12"
                            >
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#996515] mb-2">
                                    Aujourd&apos;hui • Fexhe-le-Haut-Clocher
                                </p>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#111111] mb-6 pb-4 border-b border-[#D4AF37]/30">
                                    Christophe Compère &amp; l&apos;atelier de réception
                                </h2>
                                <div className="space-y-5 text-base sm:text-lg font-light leading-relaxed text-neutral-600 text-justify">
                                    <p>
                                        Aujourd&apos;hui, Christophe Compère dirige l&apos;atelier de Fexhe-le-Haut-Clocher et perpétue l&apos;activité familiale autour des arts de la table : buffets froids et chauds, plats préparés de la semaine et menus de fêtes.
                                    </p>
                                    <p>
                                        De la présence hivernale au Chalet de Noël de Saint-Georges-sur-Meuse aux banquets d&apos;entreprises et d&apos;institutions à Waremme, Liège, Ans, Awans, Crisnée, Bierset et Hannut, l&apos;équipe assure des cuissons lentes, un dressage soigné et une logistique complète sur place.
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mt-8">
                                    <div className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-[#D4AF37]/20">
                                        <Image src="/images/Event2.jpeg" alt="Chalet de Noël de Saint-Georges-sur-Meuse" fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 33vw, 15vw" />
                                    </div>
                                    <div className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-[#D4AF37]/20">
                                        <Image src="/images/Event1.jpeg" alt="Carte hivernale au chalet de Noël" fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 33vw, 15vw" />
                                    </div>
                                    <div className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-[#D4AF37]/20">
                                        <Image src="/images/bouffe/Bouffe8.jpeg" alt="Pains saucisses artisanaux préparés sur place" fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 33vw, 15vw" />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.97 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="w-full lg:w-6/12 relative aspect-[3/4] max-w-md mx-auto rounded-2xl overflow-hidden shadow-xl border border-[#D4AF37]/25"
                            >
                                <Image
                                    src="/images/Releve1.jpeg"
                                    alt="Christophe Compère, traiteur à Fexhe-le-Haut-Clocher"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 42vw"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================================= */}
            {/* SECTION : NOS ENGAGEMENTS EN ATELIER (3 COLONNES ÉPURÉES)         */}
            {/* ================================================================= */}
            <section className="bg-white py-20 md:py-28 border-y border-[#D4AF37]/30 mb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#996515] mb-3">
                            Savoir-faire quotidien
                        </p>
                        <h2 className="text-3xl md:text-5xl font-serif text-[#111111]">
                            Nos engagements en atelier
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D4AF37]/30">
                        {ENGAGEMENTS_ATELIER.map((item) => (
                            <article
                                key={item.num}
                                className="py-8 first:pt-0 last:pb-0 md:py-2 md:px-10 md:first:pl-2 md:last:pr-2"
                            >
                                <p className="text-3xl sm:text-4xl font-serif text-[#D4AF37] mb-4">
                                    {item.num}
                                </p>
                                <h3 className="text-xl sm:text-2xl font-serif text-[#111111] mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-base font-light leading-relaxed text-neutral-600">
                                    {item.text}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================================================================= */}
            {/* BLOC SIGNATURE & CTA DISCRET                                      */}
            {/* ================================================================= */}
            <section className="max-w-4xl mx-auto px-6">
                <div className="bg-white border border-[#D4AF37]/30 rounded-3xl p-8 sm:p-12 md:p-14 text-center shadow-xs">
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#996515] mb-3">
                        Maison Compère • Fexhe-le-Haut-Clocher
                    </p>
                    <h2 className="text-2xl sm:text-4xl font-serif text-[#111111] mb-4">
                        À table avec notre Maison
                    </h2>
                    <p className="text-base sm:text-lg font-light text-neutral-600 leading-relaxed max-w-2xl mx-auto mb-8">
                        Que vous prépariez un repas de famille, un banquet associatif ou une réception d&apos;entreprise en Hesbaye et dans la province de Liège, nous composons votre carte avec le même soin depuis 1821.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/formules"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#111111] hover:bg-[#D4AF37] text-white hover:text-[#111111] font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-sm"
                        >
                            <span>Découvrir nos formules →</span>
                        </Link>
                        <Link
                            href="/contact"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-[#D4AF37] text-[#111111] hover:bg-[#FAF8F5] font-semibold text-xs sm:text-sm uppercase tracking-wider transition-colors duration-300"
                        >
                            <span>Prendre contact</span>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
