"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Logo from "./Logo";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
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

    const menuVars: Variants = {
        initial: {
            scaleY: 0,
        },
        animate: {
            scaleY: 1,
            transition: {
                duration: 0.5,
                ease: [0.12, 0, 0.39, 0],
            },
        },
        exit: {
            scaleY: 0,
            transition: {
                delay: 0.5,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const containerVars: Variants = {
        initial: {
            transition: {
                staggerChildren: 0.09,
                staggerDirection: -1,
            },
        },
        open: {
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.09,
                staggerDirection: 1,
            },
        },
    };

    const mobileLinkVars: Variants = {
        initial: {
            y: "30vh",
            transition: {
                duration: 0.5,
                ease: [0.37, 0, 0.63, 1],
            },
        },
        open: {
            y: 0,
            transition: {
                ease: [0, 0.55, 0.45, 1],
                duration: 0.7,
            },
        },
    };

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group z-50">
                    <Logo className={`h-12 w-auto transition-transform duration-300 group-hover:scale-105 ${isMenuOpen ? "brightness-0 invert" : ""}`} />
                    <span className="sr-only">Traiteur Compère</span>
                </Link>

                {/* Mobile Menu Button */}
                <div className="md:hidden z-50">
                    <button
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="text-white focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        <div className="w-8 h-8 flex flex-col justify-center items-center gap-[6px]">
                            <motion.span
                                animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                                className={`block w-8 h-[2px] bg-white transition-colors duration-300 ${!isMenuOpen && scrolled ? "bg-black" : "bg-white"}`}
                            ></motion.span>
                            <motion.span
                                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                className={`block w-8 h-[2px] bg-white transition-colors duration-300 ${!isMenuOpen && scrolled ? "bg-black" : "bg-white"}`}
                            ></motion.span>
                            <motion.span
                                animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                                className={`block w-8 h-[2px] bg-white transition-colors duration-300 ${!isMenuOpen && scrolled ? "bg-black" : "bg-white"}`}
                            ></motion.span>
                        </div>
                    </button>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-12">
                    <DesktopLink href="/" label="Accueil" />
                    <DesktopLink href="/about" label="À Propos" />
                    <DesktopLink href="/services" label="Services" />
                    <DesktopLink href="/contact" label="Contact" />
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            variants={menuVars}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="fixed inset-0 bg-black/95 backdrop-blur-md origin-top flex flex-col justify-center items-center z-40"
                        >
                            <motion.div
                                variants={containerVars}
                                initial="initial"
                                animate="open"
                                exit="initial"
                                className="flex flex-col items-center gap-8"
                            >
                                <MobileLink href="/" label="Accueil" onClick={() => setIsMenuOpen(false)} variants={mobileLinkVars} />
                                <MobileLink href="/about" label="À Propos" onClick={() => setIsMenuOpen(false)} variants={mobileLinkVars} />
                                <MobileLink href="/services" label="Services" onClick={() => setIsMenuOpen(false)} variants={mobileLinkVars} />
                                <MobileLink href="/contact" label="Contact" onClick={() => setIsMenuOpen(false)} variants={mobileLinkVars} />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}

function DesktopLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="text-sm font-bold uppercase tracking-widest text-black hover:text-[#D4AF37] transition-colors duration-300 relative group"
        >
            {label}
            <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
        </Link>
    );
}

function MobileLink({ href, label, onClick, variants }: { href: string; label: string; onClick: () => void; variants: Variants }) {
    return (
        <motion.div variants={variants} className="overflow-hidden">
            <Link
                href={href}
                onClick={onClick}
                className="text-5xl font-serif text-white hover:text-[#D4AF37] transition-colors duration-300"
            >
                {label}
            </Link>
        </motion.div>
    );
}
