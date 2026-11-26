"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function About() {
    return (
        <main className="min-h-screen bg-[#FCFCFC] pt-40 md:pt-48 pb-24 font-sans text-neutral-800">
            {/* HERO / HEADER */}
            <section className="max-w-7xl mx-auto px-6 mb-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-serif text-black tracking-tight mb-6">
                        Maison Compère, traiteur en Hesbaye
                    </h1>
                    <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full" />
                </motion.div>
            </section>

            {/* SECTION 1: HISTOIRE */}
            <section className="max-w-7xl mx-auto px-6 mb-32">
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    {/* Colonne Texte */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2"
                    >
                        <h2 className="text-3xl md:text-4xl font-serif text-black mb-8 border-l-4 border-[#D4AF37] pl-4">
                            Notre Histoire <span className="block text-xl text-neutral-400 font-light mt-2 font-sans tracking-widest">(1821 - Aujourd&apos;hui)</span>
                        </h2>
                        <div className="space-y-6 text-lg font-light leading-relaxed text-neutral-600 text-justify">
                            <p>
                                L&apos;histoire de la Maison Compère débute en 1821 à Oreye, le long de la grand-route, en Hesbaye. Fondée par notre arrière-arrière-grand-père, l&apos;adresse était alors une boucherie de village traditionnelle, sans comptoir de charcuterie, où la découpe artisanale se faisait à la main dans le respect des morceaux.
                            </p>
                            <p>
                                Peu après l&apos;ouverture, le fondateur décède brutalement, renversé par sa propre charrette. Son épouse reprend alors seule la boucherie, assure les découpes et maintient la clientèle locale pour faire vivre l&apos;atelier familial.
                            </p>
                            <p>
                                La génération suivante, le père de notre grand-père, reprend ensuite le commerce. Durant la Première Guerre mondiale, la boucherie est déplacée à Odeur pour poursuivre l&apos;activité malgré les réquisitions, avant de s&apos;installer durablement à Momalle : d&apos;abord rue Fond du Ruisseau, puis rue Michel Heyne 21 dans des locaux mieux adaptés au travail en atelier.
                            </p>
                            <p>
                                En 1996, l&apos;entreprise prend un nouveau virage en développant son activité de traiteur événementiel, tout en conservant les recettes familiales et la maîtrise bouchère transmises depuis 1821. Aujourd&apos;hui établie à Fexhe-le-Haut-Clocher, en province de Liège, notre maison prépare en atelier des buffets froids et chauds, des plats préparés et des menus de fêtes avec des portions généreuses.
                            </p>
                        </div>
                    </motion.div>

                    {/* Mosaïque d'images d'archives */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full lg:w-1/2 grid grid-cols-2 gap-4 auto-rows-[200px]"
                    >
                        <div className="relative col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-xl group">
                            <Image
                                src="/images/histoire/Histoire1.jpeg"
                                alt="Archives des fondateurs - Maison Compère en Hesbaye"
                                fill
                                priority
                                className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0 sepia-[.3]"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                            <Image
                                src="/images/histoire/Histoire2.jpeg"
                                alt="Ancienne devanture historique - Maison Compère"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0 sepia-[.3]"
                                sizes="(max-width: 1024px) 50vw, 25vw"
                            />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                            <Image
                                src="/images/histoire/Histoire3.jpeg"
                                alt="L'équipe artisanale d'antan"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0 sepia-[.3]"
                                sizes="(max-width: 1024px) 50vw, 25vw"
                            />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-lg group hidden md:block">
                            <Image
                                src="/images/histoire/Histoire4.jpeg"
                                alt="Outils traditionnels de découpe et préparation"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0 sepia-[.3]"
                                sizes="(max-width: 1024px) 50vw, 25vw"
                            />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-lg group hidden md:block">
                            <Image
                                src="/images/histoire/Histoire5.jpeg"
                                alt="Atelier de boucherie et préparations maison depuis 1821"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0 sepia-[.3]"
                                sizes="(max-width: 1024px) 50vw, 25vw"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 2: ENGAGEMENTS & ÉVÉNEMENTS */}
            <section className="bg-neutral-100 py-24 mb-32 border-y border-neutral-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-serif text-black mb-6"
                        >
                            De l&apos;atelier à vos réceptions en province de Liège
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full"
                        />
                    </div>

                    <div className="space-y-24">
                        {/* Sous-section A : L'artisanat local */}
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="w-full lg:w-1/2"
                            >
                                <h3 className="text-2xl font-serif text-black mb-6 flex items-center gap-3">
                                    <span className="w-8 h-px bg-[#D4AF37] inline-block" />
                                    Viandes en circuit court &amp; Boucherie Otte
                                </h3>
                                <div className="space-y-4 text-lg font-light leading-relaxed text-neutral-600 text-justify">
                                    <p>
                                        Pour nos buffets froids et chauds comme pour nos grillades, nous travaillons avec des produits frais sélectionnés en circuit court. Nous collaborons au quotidien avec la Boucherie Otte, installée à Saint-Georges-sur-Meuse et reconnue pour la fraîcheur et la tenue de ses viandes. Aux côtés de Steve, son patron, nous suivons chaque lot de la découpe artisanale jusqu&apos;à nos préparations maison afin d&apos;assurer une traçabilité claire sur l&apos;origine de nos bêtes.
                                    </p>
                                    <Link 
                                        href="/formules#bbq"
                                        className="inline-block mt-8 px-6 py-3 bg-black text-white rounded-full hover:bg-zinc-800 transition-colors duration-300 shadow-lg"
                                    >
                                        Découvrir notre sélection de viandes →
                                    </Link>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="w-full lg:w-1/2 flex flex-col gap-6 relative h-auto md:block md:h-[500px] lg:h-[600px] my-8 lg:my-0"
                            >
                                {/* Image 1 : Haut Gauche (Le Logo) */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="relative md:absolute md:top-0 md:left-0 w-full md:w-[50%] aspect-square shadow-lg rounded-3xl overflow-hidden"
                                >
                                    <Image
                                        src="/images/Maison_otte1.jpeg"
                                        alt="Logo de la Boucherie Otte à Saint-Georges-sur-Meuse"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                    />
                                </motion.div>

                                {/* Image 2 : Bas Droite (La Photo) */}
                                <motion.div 
                                    initial={{ opacity: 0, y: -20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="relative md:absolute md:bottom-0 md:right-0 w-full md:w-[70%] aspect-[4/3] shadow-lg rounded-3xl overflow-hidden"
                                >
                                    <Image
                                        src="/images/Maison_otte2.jpeg"
                                        alt="Comptoir et ateliers de la Boucherie Otte"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 35vw"
                                    />
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Sous-section B : Événements & Corporate */}
                        <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="w-full lg:w-1/2 grid grid-cols-2 gap-4"
                            >
                                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md">
                                    <Image src="/images/Event2.jpeg" alt="Chalet de Noël de Saint-Georges-sur-Meuse" fill className="object-cover transition-transform duration-700 hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
                                </div>
                                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md mt-8">
                                    <Image src="/images/Event1.jpeg" alt="Carte hivernale au chalet de Noël" fill className="object-cover transition-transform duration-700 hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
                                </div>
                                <div className="relative aspect-[2/1] col-span-2 rounded-2xl overflow-hidden shadow-md">
                                    <Image src="/images/bouffe/Bouffe8.jpeg" alt="Pains saucisses préparés sur place" fill className="object-cover transition-transform duration-700 hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="w-full lg:w-1/2"
                            >
                                <h3 className="text-2xl font-serif text-black mb-6 flex items-center gap-3">
                                    <span className="w-8 h-px bg-[#D4AF37] inline-block" />
                                    Réceptions publiques &amp; d&apos;entreprise en Hesbaye
                                </h3>
                                <div className="text-lg font-light leading-relaxed text-neutral-600 text-justify">
                                    <p>
                                        Notre travail en atelier s&apos;étend aussi sur le terrain, lors de fêtes locales comme le Chalet de Noël de Saint-Georges-sur-Meuse où nous servons nos spécialités de saison et nos pains saucisses grillés. Au fil des années, des entreprises, administrations et associations de Waremme, Liège, Ans, Awans, Crisnée, Bierset et Hannut nous confient leurs banquets, séminaires et réceptions privées, avec un service ponctuel et des portions généreuses adaptées au nombre de convives.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: LA RELÈVE */}
            <section className="max-w-7xl mx-auto px-6 mb-24">
                <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-5/12 relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
                    >
                        <Image
                            src="/images/Releve1.jpeg"
                            alt="Christophe Compère, traiteur à Fexhe-le-Haut-Clocher"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 42vw"
                        />
                    </motion.div>

                    {/* Texte */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full lg:w-7/12"
                    >
                        <h2 className="text-3xl md:text-5xl font-serif text-black mb-8">La Relève avec Christophe Compère</h2>
                        <div className="space-y-6 text-lg font-light leading-relaxed text-neutral-600">
                            <p>
                                Aujourd&apos;hui, Christophe Compère reprend le flambeau et poursuit le développement de l&apos;entreprise familiale depuis l&apos;atelier de Fexhe-le-Haut-Clocher, en Hesbaye.
                            </p>
                            <p>
                                Formé au métier de bouche, il pilote au quotidien les préparations maison : buffets froids et chauds, plats préparés de la semaine et menus de fêtes. Son objectif reste simple et concret : cuisiner des produits frais au rythme des saisons, préserver nos recettes familiales et assurer les livraisons et réceptions dans toute la province de Liège.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
