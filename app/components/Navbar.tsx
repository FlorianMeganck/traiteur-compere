"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Trash2, Plus, Minus } from "lucide-react";
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
                            className="fixed top-0 right-0 h-[100dvh] w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                                <h2 className="text-2xl font-serif text-black flex items-center gap-3">
                                    <ShoppingCart className="text-[#D4AF37]" />
                                    Votre Panier
                                </h2>
                                <button onClick={() => setIsCartOpen(false)} className="text-neutral-400 hover:text-black transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto overscroll-y-contain p-6 pb-12 space-y-4">
                                {cartItems.length === 0 ? (
                                    <div className="text-center text-neutral-500 py-12">
                                        <ShoppingCart className="mx-auto mb-4 opacity-50" size={48} />
                                        <p>Votre panier est vide.</p>
                                    </div>
                                ) : (
                                    cartItems.map((item) => {
                                        const isFestive = item.itemType === 'menu_fete' || item.semaineId.startsWith('menu') || item.semaineId.startsWith('fetes');
                                        const weekData = MENU_DATA.find(m => m.id === item.semaineId);

                                        return (
                                            <div key={item.id} className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm relative">
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="absolute top-4 right-4 text-neutral-300 hover:text-red-500 transition-colors p-1"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <div className="pr-8">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {isFestive && <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Fêtes</span>}
                                                        <h4 className="font-bold text-neutral-900 leading-tight">{item.nomPlat}</h4>
                                                    </div>
                                                    <p className="text-xs md:text-sm text-[#D4AF37] font-medium capitalize mb-2">
                                                        {item.badge || (weekData ? `${item.jour} (${weekData.week.split(' :')[0]})` : item.jour)}
                                                    </p>

                                                    {/* Composition détaillée du Menu de Fêtes */}
                                                    {isFestive && item.coursesSummary && item.coursesSummary.length > 0 && (
                                                        <div className="bg-[#FAF9F6] border border-neutral-200/80 rounded-xl p-2.5 mb-3 space-y-1 text-xs text-neutral-700">
                                                            {item.coursesSummary.map((course, cIdx) => (
                                                                <div key={cIdx} className="flex items-start gap-1.5 leading-snug">
                                                                    <span className="text-[#D4AF37] font-bold shrink-0">•</span>
                                                                    <span>
                                                                        <strong className="text-neutral-900 font-semibold">{course.split(':')[0]} :</strong> {course.split(':').slice(1).join(':')}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Quantity Selector +/- */}
                                                    <div className="flex justify-between items-center bg-neutral-50 p-2 rounded-xl border border-neutral-200/70 mb-3">
                                                        <span className="text-xs text-neutral-600 font-medium">Quantité :</span>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, -1)}
                                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:text-black hover:border-black shadow-sm disabled:opacity-40"
                                                                disabled={item.quantitePlat <= 1}
                                                            >
                                                                <Minus size={13} />
                                                            </button>
                                                            <span className="w-6 text-center font-bold text-sm text-black">{item.quantitePlat}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, 1)}
                                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:text-black hover:border-black shadow-sm"
                                                            >
                                                                <Plus size={13} />
                                                            </button>
                                                        </div>
                                                        <span className="font-semibold text-sm text-neutral-900">{item.prixUnitairePlat * item.quantitePlat} €</span>
                                                    </div>

                                                    {item.soupes && Object.entries(item.soupes).map(([soupe, qty]) => qty > 0 && (
                                                        <div key={soupe} className="flex justify-between items-center text-xs text-neutral-500 mb-1 pl-3 border-l-2 border-[#D4AF37]/30">
                                                            <span>+ {qty}x {soupe}</span>
                                                            <span>{qty * (item.prixUnitaireSoupe || 0)} €</span>
                                                        </div>
                                                    ))}

                                                    <div className="mt-3 pt-2 border-t border-neutral-100 flex justify-between items-center">
                                                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium">Total</span>
                                                        <span className="font-bold text-base text-black">{item.prixTotalLigne} €</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {cartItems.length > 0 && (
                                <div className="p-6 pb-10 md:pb-6 border-t border-neutral-100 bg-neutral-50">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-lg text-neutral-600 uppercase tracking-widest">Total</span>
                                        <span className="text-3xl font-serif text-[#D4AF37]">{cartTotal.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</span>
                                    </div>
                                    <Link
                                        href={cartItems.some(i => i.itemType === 'menu_fete' || i.semaineId.startsWith('menu') || i.semaineId.startsWith('fetes')) ? "/contact?type=menus_fetes" : "/contact?type=plat_prepare"}
                                        onClick={() => setIsCartOpen(false)}
                                        className="w-full bg-black text-white font-bold text-center py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-[#D4AF37] transition-colors"
                                    >
                                        Passer commande
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
