"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

export default function Services() {
    return (
        <main className="bg-white text-gray-800 font-sans pt-32 selection:bg-[#D4AF37] selection:text-white">
            {/* Header */}
            <header className="text-center mb-24 px-6">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-5xl font-serif text-black tracking-wide"
                >
                    Nos Prestations
                </motion.h1>
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 60 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-[1px] bg-gray-300 mx-auto my-8"
                />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-gray-500 font-light text-lg md:text-xl max-w-2xl mx-auto italic"
                >
                    &ldquo;De l&apos;intimité d&apos;un dîner à la grandeur d&apos;une réception, nous créons l&apos;événement qui vous ressemble.&rdquo;
                </motion.p>
            </header>

            {/* Main Service Grid */}
            <section className="px-6 mb-32 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 min-h-[60vh]">
                    <ServiceColumn
                        title="Mariage"
                        image="/images/wedding.png"
                        desc="L'art de célébrer l'amour avec élégance."
                        delay={0}
                        anchor="mariage"
                    />
                    <ServiceColumn
                        title="Entreprise"
                        image="/images/corporate.png"
                        desc="Des événements professionnels qui marquent les esprits."
                        delay={0.2}
                        anchor="entreprise"
                    />
                    <ServiceColumn
                        title="Particulier"
                        image="/images/banquet.png"
                        desc="Sublimez vos fêtes de famille et anniversaires."
                        delay={0.4}
                        anchor="particulier"
                    />
                </div>
            </section>

            {/* Detailed Sections */}
            <div className="flex flex-col gap-0">
                <DetailSection
                    id="mariage"
                    title="Mariages d'Exception"
                    image="/images/wedding.png"
                    desc="Parce que ce jour est unique, nous mettons tout en œuvre pour qu'il soit inoubliable. Du vin d'honneur au gâteau, chaque détail est pensé pour ravir vos convives et vous laisser profiter pleinement de l'instant."
                    list={[
                        "Vin d'honneur personnalisé",
                        "Menus gastronomiques sur mesure",
                        "Service en salle impeccable",
                        "Ateliers culinaires live"
                    ]}
                    reverse={false}
                />
                <DetailSection
                    id="entreprise"
                    title="Événements Corporate"
                    image="/images/corporate.png"
                    desc="Impressionnez vos collaborateurs et clients avec une cuisine raffinée. Séminaires, lancements de produits ou fêtes de fin d'année, nous apportons une touche d'excellence à votre image de marque."
                    list={[
                        "Petits-déjeuners d'affaires",
                        "Plateaux repas haut de gamme",
                        "Cocktails dînatoires",
                        "Gala de charité"
                    ]}
                    reverse={true}
                />
                <DetailSection
                    id="particulier"
                    title="Réceptions Privées"
                    image="/images/banquet.png"
                    desc="Anniversaires, communions, repas de famille... Nous transformons vos réunions en moments de partage gourmand et convivial, sans que vous ayez à vous soucier de l'organisation."
                    list={[
                        "Buffets froids et chauds",
                        "Service à l'assiette",
                        "Décoration de table soignée",
                        "Adaptation aux régimes alimentaires"
                    ]}
                    reverse={false}
                />
            </div>

            {/* Call to Action */}
            <section className="bg-neutral-50 py-32 text-center px-6 mt-12">
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

function ServiceColumn({ title, image, desc, delay, anchor }: { title: string, image: string, desc: string, delay: number, anchor: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay }}
            viewport={{ once: true }}
            className="group cursor-pointer flex flex-col items-center h-full"
        >
            <Link href={`#${anchor}`} className="flex flex-col items-center w-full h-full">
                {/* Image Container */}
                <div className="w-full aspect-[2/3] relative overflow-hidden mb-8">
                    <motion.div
                        className="w-full h-full relative"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
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
                <h2 className="text-xl md:text-2xl font-serif tracking-widest uppercase mb-4 group-hover:text-[#D4AF37] transition-colors">{title}</h2>

                {/* Vertical Line Interaction */}
                <div className="w-[1px] h-12 bg-gray-200 group-hover:h-24 group-hover:bg-[#D4AF37] transition-all duration-500 ease-in-out mb-6"></div>

                {/* Description */}
                <p className="text-center text-gray-500 font-light text-sm max-w-xs">{desc}</p>
            </Link>
        </motion.div>
    );
}

function DetailSection({ id, title, image, desc, list, reverse }: { id: string, title: string, image: string, desc: string, list: string[], reverse: boolean }) {
    return (
        <section id={id} className={`py-24 md:py-32 scroll-mt-24 ${reverse ? 'bg-neutral-50' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 md:gap-24 items-center`}>

                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2 aspect-[4/5] relative"
                    >
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover"
                        />
                    </motion.div>

                    {/* Text Side */}
                    <motion.div
                        initial={{ opacity: 0, x: reverse ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2 space-y-8"
                    >
                        <h3 className="text-3xl md:text-4xl font-serif text-black">{title}</h3>
                        <div className="w-16 h-[1px] bg-[#D4AF37]"></div>
                        <p className="text-gray-600 leading-relaxed font-light text-lg">
                            {desc}
                        </p>
                        <ul className="space-y-4 pt-4">
                            {list.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-4 text-gray-700 font-light">
                                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
