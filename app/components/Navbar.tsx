"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

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

    // Handlers for hover/leave interactions
    const handleMouseEnter = () => setIsMenuOpen(true);
    const handleMouseLeave = () => setIsMenuOpen(false);

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold font-serif tracking-widest uppercase text-red-600">
                    Traiteur Compère
                </Link>

                {/* Menu Container: Wrals Button & Dropdown for shared hover state */}
                <div
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Menu Button */}
                    <button
                        className="text-primary focus:outline-none p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>

                    {/* Menu Dropdown */}
                    <div
                        className={`absolute top-full right-0 w-full md:w-80 bg-white shadow-lg py-8 flex flex-col items-center space-y-6 border-t border-gray-100 md:rounded-bl-xl transition-all duration-300 ease-in-out transform origin-top-right ${isMenuOpen
                            ? "opacity-100 translate-y-0 pointer-events-auto"
                            : "opacity-0 translate-y-4 pointer-events-none"
                            }`}
                    >
                        <MenuLink href="/" label="Accueil" isOpen={isMenuOpen} delay={0} onClick={() => setIsMenuOpen(false)} />
                        <MenuLink href="/about" label="À Propos" isOpen={isMenuOpen} delay={75} onClick={() => setIsMenuOpen(false)} />
                        <MenuLink href="/services" label="Services" isOpen={isMenuOpen} delay={150} onClick={() => setIsMenuOpen(false)} />
                        <MenuLink href="/contact" label="Contact" isOpen={isMenuOpen} delay={225} onClick={() => setIsMenuOpen(false)} />
                    </div>
                </div>
            </div>
        </nav>
    );
}

function MenuLink({
    href,
    label,
    onClick,
    isOpen,
    delay
}: {
    href: string;
    label: string;
    onClick: () => void;
    isOpen: boolean;
    delay: number;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            style={{ transitionDelay: `${delay}ms` }}
            className={`text-lg font-medium uppercase tracking-wider text-primary hover:text-red-600 transition-all duration-500 transform ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
        >
            {label}
        </Link>
    );
}
