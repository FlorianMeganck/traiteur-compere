"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Mail, Clock, CreditCard, Gift, UtensilsCrossed, ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";

import { MENU_DATA } from "../data/plats-prepares";
import { useCart, CartItem } from "../hooks/useCart";

export default function PlatsPrepares() {
    const { cartItems, addToCart, removeFromCart, cartTotal, totalItems } = useCart();
    
    const [toastMessage, setToastMessage] = useState("");
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const handleCartCleaned = () => {
            setToastMessage("Certains plats de votre panier ne sont plus disponibles dans les délais et ont été retirés.");
            setTimeout(() => setToastMessage(""), 5000);
        };
        window.addEventListener('cart-cleaned', handleCartCleaned);
        return () => window.removeEventListener('cart-cleaned', handleCartCleaned);
    }, []);

    // 1. Logique de visibilité
    const isVisible = (dayName: string, weekId: string) => {
        const today = new Date();
        const pickupDates: Record<string, Record<string, Date>> = {
            "semaine-1": { "mardi": new Date(2026, 4, 5), "jeudi": new Date(2026, 4, 7), "samedi": new Date(2026, 4, 9) },
            "semaine-2": { "mardi": new Date(2026, 4, 12), "jeudi": new Date(2026, 4, 14), "samedi": new Date(2026, 4, 16) },
            "semaine-3": { "mardi": new Date(2026, 4, 19), "jeudi": new Date(2026, 4, 21), "samedi": new Date(2026, 4, 23) },
            "semaine-4": { "mardi": new Date(2026, 4, 26), "jeudi": new Date(2026, 4, 28), "samedi": new Date(2026, 4, 30) },
        };

        let targetDay = "";
        const d = dayName.toLowerCase();
        if (d === 'lundi' || d === 'mardi') targetDay = 'mardi';
        else if (d === 'mercredi' || d === 'jeudi') targetDay = 'jeudi';
        else targetDay = 'samedi';

        const pickupDate = pickupDates[weekId]?.[targetDay];
        if (!pickupDate) return false;

        const diffTime = pickupDate.getTime() - today.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays >= 2;
    };

    const firstAvailableWeek = MENU_DATA.find(menu =>
        menu.days.some(dayItem => isVisible(dayItem.day, menu.id))
    )?.id || MENU_DATA[0].id;

    const [activeTab, setActiveTab] = useState(firstAvailableWeek);

    // ETAT MODALE D'AJOUT
    const [selectedMeal, setSelectedMeal] = useState<{ weekId: string, day: string } | null>(null);
    const [quantitePlat, setQuantitePlat] = useState(1);
    const [soupes, setSoupes] = useState<Record<string, number>>({});

    const handleOpenModal = (weekId: string, day: string, menuSoups: string[]) => {
        setSelectedMeal({ weekId, day });
        setQuantitePlat(1);
        const initialSoupes: Record<string, number> = {};
        menuSoups.forEach(s => initialSoupes[s] = 0);
        setSoupes(initialSoupes);
    };

    const totalSoupes = Object.values(soupes).reduce((a, b) => a + b, 0);

    const handleUpdatePlatQty = (delta: number) => {
        setQuantitePlat(prev => {
            const newVal = Math.max(1, prev + delta);
            if (newVal < totalSoupes) {
                let toRemove = totalSoupes - newVal;
                const newSoupes = { ...soupes };
                for (const s in newSoupes) {
                    if (newSoupes[s] > 0 && toRemove > 0) {
                        const reduction = Math.min(newSoupes[s], toRemove);
                        newSoupes[s] -= reduction;
                        toRemove -= reduction;
                    }
                }
                setSoupes(newSoupes);
            }
            return newVal;
        });
    };

    const handleUpdateSoupeQty = (soupe: string, delta: number) => {
        setSoupes(prev => {
            const current = prev[soupe] || 0;
            const newVal = Math.max(0, current + delta);
            const newTotal = totalSoupes - current + newVal;
            if (newTotal > quantitePlat) return prev;
            return { ...prev, [soupe]: newVal };
        });
    };

    const handleAddToCart = () => {
        if (!selectedMeal) return;
        const week = MENU_DATA.find(m => m.id === selectedMeal.weekId);
        const dayData = week?.days.find(d => d.day === selectedMeal.day);
        if (!week || !dayData) return;

        const pricePlat = parseFloat(dayData.price.replace(',', '.').replace(' €', ''));
        const priceSoupe = 4;
        const item: CartItem = {
            id: `${week.id}-${dayData.day.toLowerCase()}`,
            semaineId: week.id,
            jour: dayData.day.toLowerCase(),
            nomPlat: dayData.meal,
            prixUnitairePlat: pricePlat,
            quantitePlat: quantitePlat,
            soupes: soupes,
            prixUnitaireSoupe: priceSoupe,
            prixTotalLigne: (pricePlat * quantitePlat) + (totalSoupes * priceSoupe)
        };
        addToCart(item);
        setSelectedMeal(null);
        window.dispatchEvent(new Event('open-cart-drawer'));
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-24 relative">
            {/* Toast Notification */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium flex items-center gap-3"
                    >
                        <UtensilsCrossed size={18} />
                        {toastMessage}
                        <button onClick={() => setToastMessage("")} className="ml-2 hover:text-red-200">
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal / Overlay de sélection de plat */}
            <AnimatePresence>
                {selectedMeal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedMeal(null)}
                            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.95 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl z-50 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {(() => {
                                const week = MENU_DATA.find(m => m.id === selectedMeal.weekId);
                                const dayData = week?.days.find(d => d.day === selectedMeal.day);
                                if (!week || !dayData) return null;

                                return (
                                    <>
                                        <div className="p-6 md:p-8 border-b border-neutral-100 relative">
                                            <button onClick={() => setSelectedMeal(null)} className="absolute top-6 right-6 text-neutral-400 hover:text-black bg-neutral-100 rounded-full p-2 transition-colors">
                                                <X size={20} />
                                            </button>
                                            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full">
                                                {dayData.date.charAt(0).toUpperCase() + dayData.date.slice(1).replace(/ 2026$/, '')}
                                            </span>
                                            <h3 className="text-2xl font-serif text-black mt-4 pr-12 leading-tight">
                                                {dayData.meal}
                                            </h3>
                                            <p className="text-neutral-500 font-medium mt-2">{dayData.price}</p>
                                        </div>

                                        <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-8 bg-neutral-50">
                                            {/* Quantité Plat */}
                                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h4 className="font-bold text-neutral-900">Quantité</h4>
                                                        <p className="text-xs text-neutral-400 mt-1">Nombre de portions</p>
                                                    </div>
                                                    <div className="flex items-center gap-4 bg-neutral-50 rounded-xl p-1 border border-neutral-200">
                                                        <button 
                                                            onClick={() => handleUpdatePlatQty(-1)}
                                                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm text-neutral-600 hover:text-black disabled:opacity-50"
                                                            disabled={quantitePlat <= 1}
                                                        >
                                                            <Minus size={18} />
                                                        </button>
                                                        <span className="w-6 text-center font-bold text-lg">{quantitePlat}</span>
                                                        <button 
                                                            onClick={() => handleUpdatePlatQty(1)}
                                                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm text-neutral-600 hover:text-black"
                                                        >
                                                            <Plus size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Soupes */}
                                            {quantitePlat > 0 && week.soups.length > 0 && (
                                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100">
                                                    <div className="mb-4">
                                                        <h4 className="font-bold text-neutral-900 flex items-center gap-2">
                                                            <UtensilsCrossed size={16} className="text-[#D4AF37]" />
                                                            Accompagner d'un potage ?
                                                        </h4>
                                                        <p className="text-xs text-neutral-500 mt-1">4,00€/pc - Max {quantitePlat} potage(s) pour cette sélection.</p>
                                                    </div>
                                                    
                                                    <div className="space-y-3">
                                                        {week.soups.map(soupe => (
                                                            <div key={soupe} className="flex justify-between items-center p-3 rounded-xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-100">
                                                                <span className="text-sm font-medium text-neutral-700">{soupe}</span>
                                                                <div className="flex items-center gap-3">
                                                                    <button 
                                                                        onClick={() => handleUpdateSoupeQty(soupe, -1)}
                                                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:text-black hover:bg-neutral-200 disabled:opacity-50"
                                                                        disabled={(soupes[soupe] || 0) <= 0}
                                                                    >
                                                                        <Minus size={14} />
                                                                    </button>
                                                                    <span className="w-4 text-center font-bold text-sm">{soupes[soupe] || 0}</span>
                                                                    <button 
                                                                        onClick={() => handleUpdateSoupeQty(soupe, 1)}
                                                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:text-black hover:bg-neutral-200 disabled:opacity-50"
                                                                        disabled={totalSoupes >= quantitePlat}
                                                                    >
                                                                        <Plus size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 md:p-8 bg-white border-t border-neutral-100">
                                            <button 
                                                onClick={handleAddToCart}
                                                className="w-full bg-black text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-[#D4AF37] transition-colors"
                                            >
                                                <ShoppingCart size={20} />
                                                Ajouter au panier - {((parseFloat(dayData.price.replace(',', '.').replace(' €', '')) * quantitePlat) + (totalSoupes * 4)).toLocaleString('fr-BE')} €
                                            </button>
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

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
                        Parce que bien manger ne devrait pas être un luxe réservé aux fêtes, nous cuisinons pour vous.
                        Retrouvez chaque jour l'exigence qui fait notre réputation depuis plus de deux siècles dans nos plats du terroir préparés avec passion.En famille ou entre collègues, profitez de repas sains et savoureux sans passer des heures aux fourneaux.
                    </p>
                </motion.div>

                {/* HOW IT WORKS & LOYALTY */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
                    {/* Comment Commander */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-neutral-200"
                    >
                        <h2 className="text-2xl font-serif text-black mb-8 flex items-center gap-3">
                            <span className="w-8 h-1 bg-[#D4AF37]"></span>
                            Comment commander ?
                        </h2>

                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="bg-neutral-100 p-3 rounded-full text-[#D4AF37]">
                                    <UtensilsCrossed size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-neutral-900 mb-1">1. Consultez le menu</h3>
                                    <p className="text-neutral-600 text-sm leading-relaxed">Retrouvez notre menu du mois <a href="/menu/menu_mai_2026.pdf" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline font-semibold">ici</a></p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-neutral-100 p-3 rounded-full text-[#D4AF37]">
                                    <ShoppingCart size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-neutral-900 mb-1">2. Ajoutez au panier</h3>
                                    <p className="text-neutral-600 text-sm leading-relaxed">Sélectionnez vos plats et quantités directement sur cette page, puis validez votre panier pour accéder au formulaire de contact.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-neutral-100 p-3 rounded-full text-[#D4AF37]">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-neutral-900 mb-1">3. Délai de réservation</h3>
                                    <p className="text-neutral-600 text-sm leading-relaxed">Passez commande au plus tard 2 jours avant le jour de retrait (Mardi, Jeudi ou Samedi).</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-neutral-100 p-3 rounded-full text-[#D4AF37]">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-neutral-900 mb-1">4. Paiement</h3>
                                    <p className="text-neutral-600 text-sm leading-relaxed">Paiement par virement bancaire uniquement, confirmation de la commande à la réception du paiement. <br />Communication : Nom Prénom + N° de commande.</p>
                                </div>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Offre Fidélité */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-1 bg-black text-white p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-center border border-[#D4AF37]/30"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

                        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                            <div className="bg-[#D4AF37]/20 p-4 rounded-full text-[#D4AF37]">
                                <Gift size={40} />
                            </div>
                            <h2 className="text-3xl font-serif text-[#D4AF37]">Offre Fidélité</h2>
                            <p className="text-2xl font-light leading-relaxed">
                                Pour chaque tranche de <strong className="font-bold">10 plats commandés</strong> dans le mois,<br />
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
                                🥣 <span className="uppercase tracking-wider">Potage maison : 4,00 €</span> <span className="font-normal">(disponible tout au long de la semaine en accompagnement de votre plat).</span>
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
                                    className={`flex-1 py-5 px-4 text-sm md:text-base font-bold uppercase tracking-widest transition-all duration-300 relative ${activeTab === menu.id
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
                                                {/* On filtre les plats avant de les afficher */}
                                                {menu.days.filter(dayItem => isVisible(dayItem.day, menu.id)).length > 0 ? (
                                                    menu.days
                                                        .filter(dayItem => isVisible(dayItem.day, menu.id))
                                                        .map((dayItem, idx) => (
                                                            <div
                                                                onClick={() => handleOpenModal(menu.id, dayItem.day, menu.soups)}
                                                                key={idx}
                                                                className="flex flex-col justify-between p-6 rounded-2xl border border-neutral-100 hover:border-[#D4AF37] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white group cursor-pointer relative overflow-hidden"
                                                            >
                                                                <div className="absolute top-0 right-0 bg-[#D4AF37] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                    Ajouter au panier
                                                                </div>
                                                                <div>
                                                                    <h5 className="font-serif text-xl text-[#D4AF37] mb-2">
                                                                        {dayItem.date.charAt(0).toUpperCase() + dayItem.date.slice(1).replace(/ 2026$/, '')}
                                                                    </h5>
                                                                    <p className="text-neutral-700 leading-relaxed font-medium group-hover:text-black transition-colors">
                                                                        {dayItem.meal}
                                                                    </p>
                                                                </div>
                                                                <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-between items-center group-hover:border-[#D4AF37]/30 transition-colors">
                                                                    <span className="text-xs text-neutral-400 uppercase tracking-widest">Prix unitaire</span>
                                                                    <span className="font-bold text-lg text-black">{dayItem.price}</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                ) : (
                                                    /* Message affiché quand la semaine est passée ou complète */
                                                    <div className="col-span-full py-12 text-center bg-neutral-50 rounded-3xl border border-dashed border-neutral-200 animate-fade-in">
                                                        <UtensilsCrossed className="mx-auto text-neutral-300 mb-4" size={40} />
                                                        <p className="text-neutral-600 font-serif text-xl italic">
                                                            Les commandes pour cette semaine sont désormais clôturées.
                                                        </p>
                                                        <p className="text-sm text-neutral-400 mt-2">
                                                            Découvrez nos menus pour les semaines suivantes.
                                                        </p>
                                                    </div>
                                                )}
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
                        *Menu susceptible d'évoluer en fonction des arrivages et de la saisonnalité.<br />
                        Pour toute question, n'hésitez pas à nous contacter au <strong className="text-black font-semibold">+32 476 86 54 07</strong>.
                    </p>
                </motion.div>
            </div>
        </main>
    );
}