"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

export default function Services() {
    return (
        <main className="bg-white text-gray-900 font-sans selection:bg-[#D4AF37] selection:text-white">

            {/* Header: Serif, Very Large, Centered, Pt-40 */}
            <header className="pt-40 pb-20 text-center px-6">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-serif text-black tracking-wide"
                >
                    NOS SERVICES
                </motion.h1>
            </header>

            {/* Main Service Grid: Gallery Style */}
            <section className="px-6 pb-40 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                    <GalleryCard
                        title="Mariage"
                        image="/images/wedding.png"
                        subtitle="L'émotion du grand jour"
                        anchor="mariage"
                        delay={0.1}
                    />
                    <GalleryCard
                        title="Entreprise"
                        image="/images/corporate.png"
                        subtitle="L'excellence professionnelle"
                        anchor="entreprise"
                        delay={0.2}
                    />
                    <GalleryCard
                        title="Particulier"
                        image="/images/banquet.png" // using banquet for particulier
                        subtitle="L'art de recevoir"
                        anchor="particulier"
                        delay={0.3}
                    />
                </div>
            </section>

            {/* Detailed Sections (Retained from previous version) */}
            <div className="flex flex-col gap-0 pb-32">
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
            <section className="bg-neutral-50 py-32 text-center px-6">
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

function GalleryCard({ title, image, subtitle, anchor, delay }: { title: string, image: string, subtitle: string, anchor: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
            viewport={{ once: true }}
            className="group cursor-pointer flex flex-col items-center"
        >
            <Link href={`#${anchor}`} className="w-full flex flex-col items-center">
                {/* Image: Aspect 4/5, Shadow, Hover Translate Y -5px */}
                <motion.div
                    className="w-full aspect-[4/5] relative mb-[20px] shadow-sm"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                </motion.div>

                {/* Title: Sans-serif, small, wide tracking */}
                <h2 className="font-sans text-sm uppercase tracking-[0.3em] text-black mb-[20px]">
                    {title}
                </h2>

                {/* Vertical Line: 1px wide, h-10 -> h-20, Grey -> Gold */}
                <div className="w-[1px] h-10 bg-gray-200 group-hover:h-20 group-hover:bg-[#D4AF37] transition-all duration-500 ease-in-out"></div>

                {/* Subtitle / Description: Fade In */}
                <div className="h-6 mt-4 overflow-hidden flex items-center justify-center">
                    <p className="text-gray-500 text-xs font-light italic opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                        {subtitle}
                    </p>
                </div>
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
                            className="object-cover shadow-md"
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
