"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Logo from "./Logo";
import { useCart } from "../hooks/useCart";
import { MENU_DATA } from "../data/plats-prepares";

const NAV_LINKS = [
    { href: "/a-propos", label: "À Propos" },
    { href: "/services", label: "Services" },
    { href: "/plats-prepares", label: "Plats Préparés" },
    { href: "/formules", label: "Formules" },
    { href: "/menus-fetes", label: "Menus de Fêtes" },
    { href: "/contact", label: "Contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCartBouncing, setIsCartBouncing] = useState(false);
    const { cartItems, removeFromCart, updateQuantity, cartTotal, totalItems } = useCart();
    const prevTotalItems = useRef(totalItems);

    useEffect(() => {
        if (totalItems > prevTotalItems.current) {
            setIsCartBouncing(true);
            const timer = setTimeout(() => setIsCartBouncing(false), 800);
            return () => clearTimeout(timer);
        }
        prevTotalItems.current = totalItems;
    }, [totalItems]);

    // --- LOGIC ---
    // 1. Desktop / Base Logic
    const isHome = pathname === "/";
    const isTransparent = isHome && !scrolled;

    // 2. Element Colors
    // If Transparent => White
    // Else => Black
    const desktopTextColor = isTransparent ? "text-white" : "text-black";
    const desktopLogoColor = isTransparent ? "text-white" : "text-black";
    const hamburgerColor = isTransparent ? "bg-white" : "bg-black";

    // 3. Mobile Overlay Logic (Override)
    // When Menu is OPEN, everything visible on top of black overlay MUST be WHITE.
    // This includes Logo and Hamburger Button.
    const finalLogoColor = isMenuOpen ? "text-white" : desktopLogoColor;
    const finalHamburgerColor = isMenuOpen ? "bg-white" : hamburgerColor;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMenuOpen]);

    useEffect(() => {
        const handleOpenCart = () => setIsCartOpen(true);
        window.addEventListener('open-cart-drawer', handleOpenCart);
        return () => window.removeEventListener('open-cart-drawer', handleOpenCart);
    }, []);

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50">
                {/* Top-Bar Bandeau d'Annonce (Festive Preview) */}
                <div className="bg-[#111111] text-white py-3.5 md:py-4 px-4 text-center text-xs sm:text-sm md:text-base font-medium tracking-wide flex flex-wrap items-center justify-center gap-2 border-b border-[#D4AF37]/30 shadow-sm">
                    <span className="text-[#D4AF37] text-sm md:text-base animate-pulse"></span>
                    <span>Nouveau : Découvrez nos premiers essais pour les <strong>Menus de Fêtes 2026</strong> !</span>
                    <Link href="/menus-fetes" className="underline text-[#D4AF37] hover:text-white ml-1 font-bold transition-colors">
                        Voir la section Fêtes →
                    </Link>
                </div>

                <nav
                    className={`w-full transition-colors duration-500 ease-in-out h-24 flex items-center ${!isTransparent && !isMenuOpen ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
                        }`}
                >
                    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 relative">

                        {/* --- DESKTOP LAYOUT (Grid 3 Cols: Left links / Logo / Right links + Extremities) --- */}
                        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center w-full relative">

                            {/* SOCIALS (Pushed to the absolute far left) */}
                            <div className="hidden lg:flex absolute left-0 items-center gap-3.5">
                                <SocialLink
                                    href="https://www.facebook.com/profile.php?id=61582940090708"
                                    icon={<FacebookIcon />}
                                    className={desktopTextColor}
                                />
                                <SocialLink
                                    href="https://www.instagram.com/traiteurcompere8/"
                                    icon={<InstagramIcon />}
                                    className={desktopTextColor}
                                />
                            </div>

                            {/* LEFT ZONE: À Propos, Services & Plats Préparés (Spaced out to the left of the logo) */}
                            <div className="flex justify-end items-center gap-4 lg:gap-6 xl:gap-8 pr-6 lg:pr-10 xl:pr-14">
                                <NavLink href={NAV_LINKS[0].href} label={NAV_LINKS[0].label} textColor={desktopTextColor} isActive={pathname === NAV_LINKS[0].href} />
                                <NavLink href={NAV_LINKS[1].href} label={NAV_LINKS[1].label} textColor={desktopTextColor} isActive={pathname === NAV_LINKS[1].href} />
                                <NavLink href={NAV_LINKS[2].href} label={NAV_LINKS[2].label} textColor={desktopTextColor} isActive={pathname === NAV_LINKS[2].href} />
                            </div>

                            {/* CENTER ZONE: Logo avec respiration */}
                            <div className="flex justify-center items-center px-4 lg:px-8">
                                <Link href="/" className="relative block w-32 h-16 md:w-44 md:h-22 lg:w-48 lg:h-24 transition-transform hover:scale-105 z-50">
                                    <Image
                                        src="/images/Logo_traiteur.png"
                                        alt="Traiteur Compère"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </Link>
                            </div>

                            {/* RIGHT ZONE: Formules, Menus de Fêtes & Contact (Spaced out to the right of the logo) */}
                            <div className="flex justify-start items-center gap-4 lg:gap-6 xl:gap-8 pl-6 lg:pl-10 xl:pl-14">
                                <NavLink href={NAV_LINKS[3].href} label={NAV_LINKS[3].label} textColor={desktopTextColor} isActive={pathname === NAV_LINKS[3].href} />
                                <NavLink href={NAV_LINKS[4].href} label={NAV_LINKS[4].label} textColor={desktopTextColor} isActive={pathname === NAV_LINKS[4].href} isFestive={true} />
                                <NavLink href={NAV_LINKS[5].href} label={NAV_LINKS[5].label} textColor={desktopTextColor} isActive={pathname === NAV_LINKS[5].href} />
                            </div>

                            {/* DESKTOP CART (Pushed to the absolute far right with Bounce animation) */}
                            <div className="hidden md:flex absolute right-0 items-center">
                                <motion.button
                                    onClick={() => setIsCartOpen(true)}
                                    animate={isCartBouncing ? {
                                        scale: [1, 1.28, 0.92, 1.15, 1],
                                        rotate: [0, -8, 8, -4, 4, 0],
                                    } : { scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.55, ease: "easeInOut" }}
                                    className={`relative flex items-center justify-center p-2 rounded-full transition-colors ${desktopTextColor} hover:text-[#D4AF37] hover:bg-black/5`}
                                    aria-label="Panier de commande"
                                >
                                    <ShoppingCart size={23} className={isCartBouncing ? "text-[#D4AF37]" : ""} />
                                    {totalItems > 0 && (
                                        <motion.span
                                            key={totalItems}
                                            initial={{ scale: 0.3 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 bg-[#D4AF37] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md ring-2 ring-white"
                                        >
                                            {totalItems}
                                        </motion.span>
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        {/* --- MOBILE LAYOUT (Flex Between) --- */}
                        <div className="md:hidden flex justify-between items-center w-full">
                            {/* LOGO */}
                            <Link href="/" className="relative block w-32 h-16 md:w-48 md:h-24 transition-transform hover:scale-105 z-50">
                                <Image
                                    src="/images/Logo_traiteur.png"
                                    alt="Traiteur Compère"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </Link>

                            <div className="flex items-center gap-4">
                                {/* Mobile Cart Button with Bounce */}
                                <motion.button
                                    onClick={() => { setIsMenuOpen(false); setIsCartOpen(true); }}
                                    animate={isCartBouncing ? {
                                        scale: [1, 1.25, 0.95, 1.15, 1],
                                        rotate: [0, -8, 8, -4, 4, 0],
                                    } : { scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.55, ease: "easeInOut" }}
                                    className={`relative flex items-center justify-center p-2 rounded-full transition-colors ${finalLogoColor} hover:text-[#D4AF37] z-50`}
                                >
                                    <ShoppingCart size={24} className={isCartBouncing ? "text-[#D4AF37]" : ""} />
                                    {totalItems > 0 && (
                                        <motion.span
                                            key={totalItems}
                                            initial={{ scale: 0.3 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 bg-[#D4AF37] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-black"
                                        >
                                            {totalItems}
                                        </motion.span>
                                    )}
                                </motion.button>

                                {/* BURGER */}
                                <div className="relative z-50">
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="flex flex-col justify-center items-center w-10 h-10 gap-1.5 focus:outline-none"
                                    >
                                        {/* Top Line */}
                                        <motion.span
                                            animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                                            className={`block w-8 h-[2px] rounded-full transition-colors duration-300 ${finalHamburgerColor}`}
                                        />
                                        {/* Middle Line */}
                                        <motion.span
                                            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                            className={`block w-8 h-[2px] rounded-full transition-colors duration-300 ${finalHamburgerColor}`}
                                        />
                                        {/* Bottom Line */}
                                        <motion.span
                                            animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                                            className={`block w-8 h-[2px] rounded-full transition-colors duration-300 ${finalHamburgerColor}`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* MOBILE OVERLAY */}
                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="fixed inset-0 bg-black/95 backdrop-blur-md z-40 flex flex-col items-center justify-center text-center"
                                >
                                    <div className="flex flex-col gap-8 mb-12">
                                        {NAV_LINKS.map((link) => (
                                            <MobileLink
                                                key={link.href}
                                                href={link.href}
                                                label={link.label}
                                                isActive={pathname === link.href}
                                                onClick={() => setIsMenuOpen(false)}
                                            />
                                        ))}
                                    </div>

                                    <div className="w-16 h-[1px] bg-white/20 mb-8"></div>

                                    {/* Mobile Socials */}
                                    <div className="flex items-center gap-8">
                                        <SocialLink
                                            href="https://www.facebook.com/profile.php?id=61582940090708"
                                            icon={<FacebookIcon size={32} />}
                                            className="text-white"
                                        />
                                        <SocialLink
                                            href="https://www.instagram.com/traiteurcompere8/"
                                            icon={<InstagramIcon size={32} />}
                                            className="text-white"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </nav>
            </header>
            {/* Cart Side Drawer */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 bg-black/50 z-[60]"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-[100dvh] w-full sm:max-w-md lg:max-w-lg bg-white z-[70] shadow-2xl flex flex-col"
                        >
                            {/* 1. HEADER COMPACT */}
                            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-[#FAF9F6] shrink-0">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center">
                                        <ShoppingCart size={17} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-serif font-bold text-lg text-neutral-900">
                                            Panier
                                        </h2>
                                        <span className="text-xs bg-neutral-200/80 text-neutral-700 font-medium px-2 py-0.5 rounded-full">
                                            {totalItems} {totalItems > 1 ? 'articles' : 'article'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-black flex items-center justify-center transition-all duration-200"
                                    aria-label="Fermer le panier"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* 2. CORPS DÉFILABLE */}
                            <div className="flex-1 overflow-y-auto overscroll-y-contain p-6 space-y-4 bg-[#FBFBFA]">
                                {cartItems.length === 0 ? (
                                    <div className="text-center text-neutral-400 py-16 px-4 space-y-3">
                                        <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-300 flex items-center justify-center mx-auto mb-2">
                                            <ShoppingCart size={28} />
                                        </div>
                                        <h3 className="font-serif text-lg text-neutral-700">Votre panier est vide</h3>
                                        <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                                            Explorez nos menus de fêtes et nos plats préparés pour commencer votre commande.
                                        </p>
                                    </div>
                                ) : (
                                    cartItems.map((item) => {
                                        const isFestive = item.itemType === 'menu_fete' || item.semaineId.startsWith('menu') || item.semaineId.startsWith('fetes');
                                        const weekData = MENU_DATA.find(m => m.id === item.semaineId);

                                        return (
                                            <div
                                                key={item.id}
                                                className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5 shadow-xs relative transition-shadow hover:shadow-sm"
                                            >
                                                {/* Bouton supprimer discret */}
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Supprimer l'article"
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                                <div className="pr-7">
                                                    {/* En-tête de carte : Tag & Nom */}
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        {isFestive ? (
                                                            <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                                Fêtes
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] bg-neutral-100 text-neutral-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                                Semaine
                                                            </span>
                                                        )}
                                                        <h4 className="font-serif font-bold text-neutral-900 text-base leading-snug">
                                                            {item.nomPlat}
                                                        </h4>
                                                    </div>

                                                    <p className="text-xs text-[#D4AF37] font-semibold capitalize mb-3">
                                                        {item.badge || (weekData ? `${item.jour} (${weekData.week.split(' :')[0]})` : item.jour)}
                                                    </p>

                                                    {/* Zone de composition avec étiquettes claires */}
                                                    {isFestive && item.coursesSummary && item.coursesSummary.length > 0 && (
                                                        <div className="bg-[#FAF9F6] border border-neutral-200/80 rounded-xl p-3 mb-3.5 space-y-2 text-xs">
                                                            {item.coursesSummary.map((course, cIdx) => {
                                                                const [label, ...valParts] = course.split(':');
                                                                const value = valParts.join(':').trim();
                                                                return (
                                                                    <div key={cIdx} className="grid grid-cols-[68px_1fr] items-start gap-2 leading-snug">
                                                                        <span className="font-bold text-[9px] uppercase tracking-wider text-[#927116] bg-[#D4AF37]/15 px-1 py-0.5 rounded text-center shrink-0">
                                                                            {label.trim()}
                                                                        </span>
                                                                        <span className="text-neutral-850 font-medium">
                                                                            {value}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {/* Soupes associées (Plats préparés) */}
                                                    {item.soupes && Object.entries(item.soupes).map(([soupe, qty]) => qty > 0 && (
                                                        <div key={soupe} className="flex justify-between items-center text-xs text-neutral-600 mb-2 pl-2.5 border-l-2 border-[#D4AF37]/50 py-0.5">
                                                            <span>+ {qty}x {soupe}</span>
                                                            <span className="font-semibold text-neutral-900">{qty * (item.prixUnitaireSoupe || 0)} €</span>
                                                        </div>
                                                    ))}

                                                    {/* Ligne d'action inférieure : Sélecteur quantité compact & Prix total */}
                                                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-neutral-100">
                                                        {/* Sélecteur de quantité compact */}
                                                        <div className="inline-flex items-center gap-1.5 bg-neutral-50 border border-neutral-200/80 p-1 rounded-full shadow-2xs">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, -1)}
                                                                className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-neutral-700 hover:text-red-600 hover:bg-neutral-100 shadow-2xs transition-colors"
                                                                title={item.quantitePlat === 1 ? "Supprimer" : "Diminuer"}
                                                                aria-label="Diminuer"
                                                            >
                                                                <Minus size={11} />
                                                            </button>
                                                            <span className="w-6 text-center font-bold text-xs text-neutral-900">{item.quantitePlat}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, 1)}
                                                                className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-neutral-700 hover:text-black hover:bg-neutral-100 shadow-2xs transition-colors"
                                                                title="Augmenter"
                                                                aria-label="Augmenter"
                                                            >
                                                                <Plus size={11} />
                                                            </button>
                                                        </div>

                                                        {/* Prix total de la ligne */}
                                                        <div className="text-right">
                                                            <span className="text-base font-bold text-neutral-900 font-serif">
                                                                {item.prixTotalLigne.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* 3. FOOTER COLLÉ EN BAS */}
                            {cartItems.length > 0 && (
                                <div className="sticky bottom-0 bg-white border-t border-neutral-100 p-6 space-y-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] shrink-0">
                                    <div className="flex justify-between items-baseline">
                                        <div>
                                            <span className="text-sm font-bold text-neutral-900 block">Total TTC</span>
                                            <span className="text-[11px] text-neutral-400">TVA incluse</span>
                                        </div>
                                        <span className="text-3xl font-serif font-bold text-[#D4AF37]">
                                            {cartTotal.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                                        </span>
                                    </div>
                                    <Link
                                        href={cartItems.some(i => i.itemType === 'menu_fete' || i.semaineId.startsWith('menu') || i.semaineId.startsWith('fetes')) ? "/contact?type=menus_fetes" : "/contact?type=plat_prepare"}
                                        onClick={() => setIsCartOpen(false)}
                                        className="w-full bg-black hover:bg-[#D4AF37] text-white font-bold text-center py-4 px-6 rounded-xl flex justify-center items-center gap-2.5 uppercase tracking-wider text-sm transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.01]"
                                    >
                                        <span>Valider ma commande</span>
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

// --- SUB-COMPONENTS ---

function NavLink({ href, label, textColor, isActive, isFestive }: { href: string; label: string; textColor: string; isActive: boolean; isFestive?: boolean }) {
    return (
        <Link
            href={href}
            className={`relative py-1 text-xs lg:text-sm font-bold tracking-wider lg:tracking-widest uppercase whitespace-nowrap transition-all duration-300 group flex items-center gap-1.5 ${textColor} ${isActive ? "opacity-70 border-b-2 border-[#D4AF37]" : "opacity-100 hover:text-[#D4AF37]"
                }`}
        >
            {isFestive && <span className="text-[#D4AF37] animate-pulse"></span>}
            {label}
            {/* Golden Underline Animation (Only for inactive state hover) */}
            {!isActive && (
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full opacity-50"></span>
            )}
        </Link>
    );
}

function MobileLink({ href, label, onClick, isActive }: { href: string; label: string; onClick: () => void; isActive: boolean }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`text-5xl font-serif transition-colors duration-300 relative ${isActive ? "text-[#D4AF37] opacity-80" : "text-white hover:text-[#D4AF37]"
                }`}
        >
            {isActive && <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#D4AF37] rounded-full" />}
            {label}
        </Link>
    );
}

function SocialLink({ href, icon, className }: { href: string; icon: React.ReactNode; className: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${className} hover:text-[#D4AF37] transition-colors duration-300`}
        >
            {icon}
        </a>
    );
}

// --- ICONS ---

function FacebookIcon({ size = 20 }: { size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    );
}

function InstagramIcon({ size = 20 }: { size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
    );
}
