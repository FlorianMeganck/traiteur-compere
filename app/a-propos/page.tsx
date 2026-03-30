"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function About() {
    return (
        <main className="min-h-screen bg-[#FCFCFC] pt-32 pb-24 font-sans text-neutral-800">
            {/* HERO / HEADER */}
            <section className="max-w-7xl mx-auto px-6 mb-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-serif text-black tracking-tight mb-6">Notre Maison</h1>
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
                            Notre Histoire <span className="block text-xl text-neutral-400 font-light mt-2 font-sans tracking-widest">(1821 - Aujourd'hui)</span>
                        </h2>
                        <div className="space-y-6 text-lg font-light leading-relaxed text-neutral-600 text-justify">
                            <p>
                                L'histoire de notre boucherie commence en 1821, à Oreye, près de la grand-route. Fondée par notre arrière-arrière-grand-père, l'établissement était à l'origine une boucherie traditionnelle, sans activité de charcuterie. À cette époque, le métier s'exerçait avec rigueur, passion et un profond respect du produit.
                            </p>
                            <p>
                                Un drame a marqué les débuts de notre histoire: notre fondateur est tragiquement décédé, renversé par sa propre charrette. Malgré cette épreuve, son épouse a courageusement repris l'activité, perpétuant ainsi le savoir-faire familial et assurant la continuité de la boucherie.
                            </p>
                            <p>
                                La génération suivante, le père de notre grand-père, a repris le flambeau. Durant la première guerre mondiale, la boucherie a été déplacée à Odeur, preuve de la résilience et de la détermination de la famille face aux circonstances difficiles de l'époque. Plus tard, l'activité s'est installée à Momalle. Le magasin a d'abord été situé rue Fond du Ruisseau, avant de déménager rue Michel Heyne 21, afin d'offrir un cadre plus adapté à l'évolution de l'entreprise et aux besoins de la clientèle.
                            </p>
                            <p>
                                Un tournant important a lieu en 1996: la boucherie se transforme et développe son activité de traiteur. Cette évolution marque une nouvelle étape dans l'histoire familiale, élargissant les services proposés tout en conservant l'exigence de qualité et le savoir-faire artisanal transmis depuis 1821. Depuis plus de deux siècles, notre maison est avant tout une histoire de famille, de travail et de passion. Chaque génération a su préserver les valeurs fondatrices tout en adaptant l'entreprise aux attentes de son époque.
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
                                src="/images/Histoire1.jpg" 
                                alt="Archives fondateurs" 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0 sepia-[.3]" 
                            />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                            <Image 
                                src="/images/Histoire2.jpg" 
                                alt="Ancienne devanture" 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0 sepia-[.3]" 
                            />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                            <Image 
                                src="/images/Histoire3.jpg" 
                                alt="L'équipe d'antan" 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0 sepia-[.3]" 
                            />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-lg group hidden md:block">
                            <Image 
                                src="/images/Histoire4.jpg" 
                                alt="Outils traditionnels" 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0 sepia-[.3]" 
                            />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-lg group hidden md:block">
                            <Image 
                                src="/images/Histoire5.jpg" 
                                alt="Savoir-faire artisanal" 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0 sepia-[.3]" 
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 2: LA RELÈVE */}
            <section className="bg-neutral-100 py-24 mb-32 border-y border-neutral-200">
                <div className="max-w-7xl mx-auto px-6">
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
                                alt="Christophe, la nouvelle génération" 
                                fill 
                                className="object-cover" 
                            />
                            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur px-6 py-3 rounded-xl shadow-lg border-l-4 border-[#D4AF37]">
                                <span className="block text-sm font-bold uppercase tracking-widest text-[#D4AF37]">Christophe</span>
                                <span className="block text-xs uppercase tracking-wider text-neutral-500 mt-1">La relève assumée</span>
                            </div>
                        </motion.div>

                        {/* Texte */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="w-full lg:w-7/12"
                        >
                            <h2 className="text-3xl md:text-5xl font-serif text-black mb-8">La Relève</h2>
                            <div className="space-y-6 text-lg font-light leading-relaxed text-neutral-600">
                                <p>
                                    Aujourd'hui, une nouvelle génération se prépare à prendre le relais. Christophe s'inscrit pleinement dans cette continuité et se forme activement afin de reprendre l'entreprise familiale.
                                </p>
                                <p>
                                    Animé par la passion du métier et le respect des valeurs qui ont toujours guidé la maison, il développe ses compétences avec un objectif clair: assurer la pérennité de la société tout en l'accompagnant vers l'avenir. Entre tradition et modernité, il incarne la volonté de faire perdurer un savoir-faire tout en répondant aux attentes d'aujourd'hui et de demain.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: QUALITÉ, OTTE & CHALET */}
            <section className="max-w-7xl mx-auto px-6 mb-24">
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-serif text-black mb-6"
                    >
                        Notre Engagement Qualité & Collaborations
                    </motion.h2>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full mb-8" 
                    />
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="max-w-3xl mx-auto space-y-6 text-lg font-light leading-relaxed text-neutral-600 text-justify md:text-center"
                    >
                        <p>
                            Dans une volonté constante de qualité et de respect envers nos clients, nous avons mis en place une sélection rigoureuse de nos viandes afin de vous offrir une expérience irréprochable.
                        </p>
                        <p>
                            C'est tout naturellement que nous avons choisi de collaborer avec la boucherie Otte, récemment installée à Saint-Georges-sur-Meuse. Bien que nouvelle dans le paysage local, elle bénéficie déjà d'une solide réputation fondée sur le sérieux et la qualité de ses produits. En travaillant en étroite collaboration avec Steve, le patron de la boucherie, nous vous garantissons une parfaite maîtrise de la qualité ainsi qu'une traçabilité claire de l'origine de nos viandes.
                        </p>
                    </motion.div>
                </div>

                {/* Bloc Mixte : Chalet & Illustrations */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-neutral-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-serif text-black flex items-center gap-3">
                                <span className="w-8 h-px bg-[#D4AF37] inline-block" />
                                Sur le terrain / Nos événements
                            </h3>
                            <p className="text-lg font-light leading-relaxed text-neutral-600 text-justify">
                                Cet engagement se vit aussi sur le terrain ! Lors de l'hiver 2025, nous avons eu le plaisir de vous retrouver au Chalet de Noël de Saint-Georges pour partager un moment de convivialité autour de nos spécialités hivernales et de nos pains saucisses gourmands.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md group">
                                <Image src="/images/Travail1.jpeg" alt="Travail et préparation" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md group mt-8">
                                <Image src="/images/Event2.jpeg" alt="Ambiance événement" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md group -mt-8">
                                <Image src="/images/Bouffe8.jpg" alt="Nos pains saucisses gourmands" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md group">
                                <Image src="/images/Event1.jpeg" alt="L'Affiche au chalet" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                        </motion.div>
                    </div>
                </div>

            </section>
        </main>
    );
}
