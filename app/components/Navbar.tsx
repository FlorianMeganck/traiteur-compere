"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const NAV_LINKS = [
    { href: "/", label: "Accueil" },
    { href: "/about", label: "À Propos" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    return (
        <nav
            className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-in-out h-24 flex items-center ${!isTransparent && !isMenuOpen ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
                }`}
        >
            {/* 
               background logic: 
               - transparent => transparent
               - NOT transparent => white
               - BUT if Menu is Open => transparent (because overlay is black/95, we don't want white bar on top)
               Actually, usually the overlay is fixed inset-0 z-40, and navbar is z-50.
               If navbar is white z-50, it covers the top of the black overlay.
               Let's make navbar transparent if menu is open, so black overlay shines through.
            */}

            <div className="w-full max-w-7xl mx-auto px-6 relative">

                {/* --- DESKTOP LAYOUT (Grid 3 Cols) --- */}
                <div className="hidden md:grid grid-cols-3 items-center w-full relative">

                    {/* LEFT ZONE: Accueil & À Propos (Aligned Right -> Center) */}
                    <div className="flex justify-end items-center gap-12 pr-12">
                        <NavLink href={NAV_LINKS[0].href} label={NAV_LINKS[0].label} textColor={desktopTextColor} />
                        <NavLink href={NAV_LINKS[1].href} label={NAV_LINKS[1].label} textColor={desktopTextColor} />
                    </div>

                    {/* CENTER ZONE: Logo */}
                    <div className="flex justify-center items-center">
                        <Link href="/" className={`relative z-50 transition-colors duration-500 ${finalLogoColor} hover:scale-105 transition-transform duration-300`}>
                            <Logo className="h-20 w-auto" />
                        </Link>
                    </div>

                    {/* RIGHT ZONE: Services & Contact (Aligned Left -> Center) */}
                    <div className="flex justify-start items-center gap-12 pl-12">
                        <NavLink href={NAV_LINKS[2].href} label={NAV_LINKS[2].label} textColor={desktopTextColor} />
                        <NavLink href={NAV_LINKS[3].href} label={NAV_LINKS[3].label} textColor={desktopTextColor} />
                    </div>

                    {/* SOCIALS (Absolute Right) */}
                    <div className="absolute right-0 flex items-center gap-4">
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
                </div>

                {/* --- MOBILE LAYOUT (Flex Between) --- */}
                <div className="md:hidden flex justify-between items-center w-full">
                    {/* LOGO */}
                    <Link href="/" className={`relative z-50 transition-colors duration-500 ${finalLogoColor}`}>
                        <Logo className="h-14 w-auto" />
                    </Link>

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
    );
}

// --- SUB-COMPONENTS ---

function NavLink({ href, label, textColor }: { href: string; label: string; textColor: string }) {
    return (
        <Link
            href={href}
            className={`relative py-1 text-sm font-bold tracking-widest uppercase transition-colors duration-300 group ${textColor} hover:text-[#D4AF37]`}
        >
            {label}
            {/* Golden Underline Animation */}
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
        </Link>
    );
}

function MobileLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-5xl font-serif text-white hover:text-[#D4AF37] transition-colors duration-300"
        >
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
