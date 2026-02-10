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

    // Chameleon Logic
    // If Home ("/") AND Scroll < 50 => Transparent
    // Else => White
    const isHome = pathname === "/";
    const isTransparent = isHome && !scrolled;

    // Derived Colors
    // If Transparent => White Elements
    // Else => Black Elements
    // EXCEPT: When Mobile Menu is OPEN, Toggle Button must be WHITE (on black overlay)
    const textColor = isTransparent ? "text-white" : "text-black";
    const burgerColor = isMenuOpen || isTransparent ? "bg-white" : "bg-black";
    const logoClass = isTransparent ? "text-white" : "text-black"; // SVG uses currentColor

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
            className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-in-out h-24 flex items-center ${!isTransparent ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
                }`}
        >
            <div className="w-full max-w-7xl mx-auto px-6 flex justify-between items-center">

                {/* LOGO */}
                <Link href="/" className={`relative z-50 transition-colors duration-500 ${logoClass}`}>
                    <Logo className="h-16 w-auto" />
                </Link>

                {/* DESKTOP MENU (Hidden on Mobile) */}
                <div className="hidden md:flex items-center gap-12">
                    <div className="flex items-center gap-8">

                        {NAV_LINKS.map((link) => (
                            <NavLink key={link.href} href={link.href} label={link.label} textColor={textColor} />
                        ))}
                    </div>

                    <div className={`w-[1px] h-6 ${isTransparent ? "bg-white/30" : "bg-black/10"}`}></div>

                    {/* Desktop Socials */}
                    <div className="flex items-center gap-4">
                        <SocialLink
                            href="https://www.facebook.com/profile.php?id=61582940090708"
                            icon={<FacebookIcon />}
                            className={textColor}
                        />
                        <SocialLink
                            href="https://www.instagram.com/traiteurcompere8/"
                            icon={<InstagramIcon />}
                            className={textColor}
                        />
                    </div>
                </div>

                {/* MOBILE BURGER (md:hidden) */}
                <div className="md:hidden relative z-50">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex flex-col justify-center items-center w-10 h-10 gap-1.5 focus:outline-none"
                    >
                        {/* Top Line */}
                        <motion.span
                            animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                            className={`block w-8 h-[2px] rounded-full transition-colors duration-300 ${burgerColor}`}
                        />
                        {/* Middle Line */}
                        <motion.span
                            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                            className={`block w-8 h-[2px] rounded-full transition-colors duration-300 ${burgerColor}`}
                        />
                        {/* Bottom Line */}
                        <motion.span
                            animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                            className={`block w-8 h-[2px] rounded-full transition-colors duration-300 ${burgerColor}`}
                        />
                    </button>
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
                                    href="https://www.facebook.com/profile.php?id=100057328099329"
                                    icon={<FacebookIcon size={32} />}
                                    className="text-white"
                                />
                                <SocialLink
                                    href="https://www.instagram.com"
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
