"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Mail, Clock, CreditCard, Gift, UtensilsCrossed } from "lucide-react";

const MENU_DATA = [
    {
        id: "semaine-1",
        week: "SEMAINE 1",
        soups: ["Crème de brocolis", "Velouté champignon"],
        days: [
            { day: "Lundi", meal: "Oiseau sans tête sauce poivre, petit pois et carotte, rösti", price: "11,50 €" },
            { day: "Mardi", meal: "Pâtes aux quatre fromages", price: "10,00 €" },
            { day: "Mercredi", meal: "Cuisse de poulet sauce champignon, compote de pomme et pomme de terre rissolée", price: "11,50 €" },
            { day: "Jeudi", meal: "Cordon bleu, haricot à la crème et purée cerfeuil", price: "11,50 €" },
            { day: "Vendredi", meal: "Waterzooi de poisson, purée brocolis", price: "16,00 €" },
            { day: "Samedi", meal: "Parmentier aux épinards", price: "11,50 €" },
        ]
    },
    {
        id: "semaine-2",
        week: "SEMAINE 2",
        soups: ["Potage tomate", "Velouté de chou-fleur"],
        days: [
            { day: "Lundi", meal: "Cuisse de lapin à la bière, compote et pomme rissolée", price: "11,50 €" },
            { day: "Mardi", meal: "Escalope de veau et tagliatelle sauce tomate crème et parmesan", price: "16,00 €" },
            { day: "Mercredi", meal: "Potée aux carottes et saucisse de campagne", price: "11,50 €" },
            { day: "Jeudi", meal: "Roulade ardennaise, sauce crème champignon, haricot et gratin", price: "11,50 €" },
            { day: "Vendredi", meal: "Filet de colin aux petits légumes, purée de cerfeuil", price: "16,00 €" },
            { day: "Samedi", meal: "Chicon farci et lard fumé, purée de pomme de terre", price: "11,50 €" },
        ]
    },
    {
        id: "semaine-3",
        week: "SEMAINE 3",
        soups: ["Potage champignons des bois", "Velouté d'asperge"],
        days: [
            { day: "Lundi", meal: "Blanquette de veau, purée de céleri et légumes vapeurs", price: "16,00 €" },
            { day: "Mardi", meal: "Lasagne bolognaise", price: "10,00 €" },
            { day: "Mercredi", meal: "Boulet liégeois et purée brocolis", price: "11,50 €" },
            { day: "Jeudi", meal: "Filet de poulet sauce estragon, pomme duchesse, compote de rhubarbe", price: "11,50 €" },
            { day: "Vendredi", meal: "Filet de saumon sauce crème, pomme vapeur, gratiné de brocolis", price: "16,00 €" },
            { day: "Samedi", meal: "Roulade ardennaise et purée", price: "11,50 €" },
        ]
    },
    {
        id: "semaine-4",
        week: "SEMAINE 4",
        soups: ["Soupe à l'oignon", "Velouté butternut"],
        days: [
            { day: "Lundi", meal: "Carbonnade à la flamande, compote et croquette", price: "11,50 €" },
            { day: "Mardi", meal: "Lasagne au saumon al verde", price: "10,00 €" },
            { day: "Mercredi", meal: "Crépinette de veau, pois et carotte, pommes de terre rissolées", price: "16,00 €" },
            { day: "Jeudi", meal: "Pavé de dindonneau sauce liégeoise, endive et gratin", price: "11,50 €" },
            { day: "Vendredi", meal: "Poisson gratiné, écrasé de pomme de terre et poireau à la crème", price: "16,00 €" },
            { day: "Samedi", meal: "Linguine à la bolognaise", price: "10,00 €" },
        ]
    }
];

export default function PlatsPrepares() {
    const [activeTab, setActiveTab] = useState(MENU_DATA[0].id);

    return (
        <main className="min-h-screen bg-gray-50 pb-24">
            {/* HERO SECTION */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2070&auto=format&fit=crop"
                        alt="Plats préparés maison"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
                            Plats préparés maison : <br className="hidden md:block" />
                            <span className="text-[#D4AF37]">Commande & menu du mois</span>
                        </h1>
                        <p className="text-xl text-neutral-200 font-light tracking-wide">
                            Des saveurs maison, à votre table, chaque jour.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
                {/* INTRO TEXT BOX */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-neutral-100 mb-20"
                >
                    <p className="text-neutral-600 text-lg leading-relaxed text-justify md:text-center max-w-5xl mx-auto">
                        "Chez Traiteur Compère, l'amour du bon produit ne s'arrête pas aux grandes occasions. C'est pourquoi nous avons développé une nouvelle offre pensée pour votre quotidien : des plats préparés maison, cuisinés chaque jour avec les mêmes exigences qui font notre réputation depuis 1821. Chaque semaine, notre cuisine élabore un menu varié qui change chaque mois : plats du terroir belge, recettes traditionnelles revisitées, spécialités maison... Des préparations généreuses, équilibrées et pleines de saveurs, comme si vous les aviez cuisinées vous-même en beaucoup moins de temps. Parce que bien manger ne devrait pas être un luxe réservé aux fêtes, nous mettons notre savoir-faire artisanal au service de votre table de tous les jours. Qu'il s'agisse d'un dîner en famille, d'un repas entre collègues ou simplement d'une envie de vous faire plaisir sans passer des heures en cuisine, nos plats préparés sont faits pour vous. La cuisine de chez nous mérite une place dans votre cuisine à vous."
                    </p>
                </motion.div>

                {/* HOW IT WORKS & LOYALTY */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
                    {/* Comment Commander */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-200"
                    >
                        <h2 className="text-2xl font-serif text-black mb-8 flex items-center gap-3">
                            <span className="w-8 h-1 bg-[#D4AF37]"></span>
                            Comment Commander
                        </h2>
                        
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="bg-neutral-100 p-3 rounded-full text-[#D4AF37]">
                                    <UtensilsCrossed size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-neutral-900 mb-1">1. Consultez le menu</h3>
                                    <p className="text-neutral-600 text-sm leading-relaxed">Retrouvez le menu du mois sur notre site : <a href="/" className="text-[#D4AF37] hover:underline font-semibold">traiteur-compere.be</a></p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-neutral-100 p-3 rounded-full text-[#D4AF37]">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-neutral-900 mb-1">2. Passez commande</h3>
                                    <p className="text-neutral-600 text-sm leading-relaxed">Commandez en ligne via notre formulaire ou par e-mail : <a href="mailto:traiteurcompere@gmail.com" className="text-[#D4AF37] hover:underline font-semibold">traiteurcompere@gmail.com</a></p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-neutral-100 p-3 rounded-full text-[#D4AF37]">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-neutral-900 mb-1">3. Délai de réservation</h3>
                                    <p className="text-neutral-600 text-sm leading-relaxed">Toute commande doit être passée minimum 4 jours à l'avance.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-neutral-100 p-3 rounded-full text-[#D4AF37]">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-neutral-900 mb-1">4. Paiement</h3>
                                    <p className="text-neutral-600 text-sm leading-relaxed">Paiement par virement bancaire uniquement. <br/>Communication : Nom Prénom + N° de commande.</p>
                                </div>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Offre Fidélité */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-black text-white p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-center border border-[#D4AF37]/30"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        
                        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                            <div className="bg-[#D4AF37]/20 p-4 rounded-full text-[#D4AF37]">
                                <Gift size={40} />
                            </div>
                            <h2 className="text-3xl font-serif text-[#D4AF37]">Offre Fidélité</h2>
                            <p className="text-2xl font-light leading-relaxed">
                                Pour chaque tranche de <strong className="font-bold">10 plats commandés</strong> dans le mois,<br/>
                                <span className="text-[#D4AF37] font-bold text-3xl block mt-2">le 11ème plat vous est offert.</span>
                            </p>
                            <div className="mt-4 pt-6 border-t border-white/20 w-full">
                                <p className="text-neutral-400 text-xs uppercase tracking-widest">
                                    Offre non cumulable. Valable par mois calendaire.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* MENU DU MOIS */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-serif text-neutral-900 mb-4">Le Menu du Mois</h2>
                        <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full mb-8"></div>
                        
                        {/* Notice Potage */}
                        <div className="inline-block bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-6 py-3 rounded-full">
                            <p className="text-[#8c7322] font-semibold text-sm md:text-base">
                                🥣 <span className="uppercase tracking-wider">Potage maison : 4,00 € HTVA</span> <span className="font-normal">(disponible tout au long de la semaine en accompagnement de votre plat).</span>
                            </p>
                        </div>
                    </div>

                    {/* Menu Tabs */}
                    <div className="bg-white rounded-3xl shadow-lg border border-neutral-100 overflow-hidden">
                        {/* Tab Headers */}
                        <div className="flex flex-wrap border-b border-neutral-100">
                            {MENU_DATA.map((menu) => (
                                <button
                                    key={menu.id}
                                    onClick={() => setActiveTab(menu.id)}
                                    className={`flex-1 py-5 px-4 text-sm md:text-base font-bold uppercase tracking-widest transition-all duration-300 relative ${
                                        activeTab === menu.id 
                                        ? "text-[#D4AF37] bg-neutral-50" 
                                        : "text-neutral-500 hover:bg-neutral-50 hover:text-black"
                                    }`}
                                >
                                    {menu.week}
                                    {activeTab === menu.id && (
                                        <motion.div 
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 w-full h-1 bg-[#D4AF37]"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 md:p-10">
                            <AnimatePresence mode="wait">
                                {MENU_DATA.map((menu) => (
                                    activeTab === menu.id && (
                                        <motion.div
                                            key={menu.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-8"
                                        >
                                            {/* Soups of the week */}
                                            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
                                                <h4 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <CalendarDays size={16} /> Potages de la semaine
                                                </h4>
                                                <div className="flex flex-wrap gap-4">
                                                    {menu.soups.map((soup, idx) => (
                                                        <span key={idx} className="bg-white px-4 py-2 rounded-full text-black font-medium text-sm shadow-sm border border-neutral-100">
                                                            {soup}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Daily Meals Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                {menu.days.map((dayItem, idx) => (
                                                    <div key={idx} className="flex flex-col justify-between p-6 rounded-2xl border border-neutral-100 hover:border-[#D4AF37]/50 hover:shadow-md transition-all duration-300 bg-white">
                                                        <div>
                                                            <h5 className="font-serif text-xl text-[#D4AF37] mb-2">{dayItem.day}</h5>
                                                            <p className="text-neutral-700 leading-relaxed font-medium">
                                                                {dayItem.meal}
                                                            </p>
                                                        </div>
                                                        <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-between items-center">
                                                            <span className="text-xs text-neutral-400 uppercase tracking-widest">Prix unitaire</span>
                                                            <span className="font-bold text-lg text-black">{dayItem.price} <span className="text-xs font-normal text-neutral-400">HTVA</span></span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* FOOTER CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center bg-white p-12 rounded-3xl shadow-sm border border-neutral-100"
                >
                    <p className="text-neutral-500 italic mb-8 max-w-2xl mx-auto">
                        *Menu susceptible d'évoluer en fonction des arrivages et de la saisonnalité.<br/>
                        Pour toute question, n'hésitez pas à nous contacter au <strong className="text-black font-semibold">0476 86 54 07</strong>.
                    </p>
                    <Link
                        href="/contact?sujet=plats-prepares"
                        className="inline-flex items-center justify-center bg-black text-[#D4AF37] px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#D4AF37] hover:text-black transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                    >
                        Passer ma commande
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
