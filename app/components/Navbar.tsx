"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold font-serif tracking-widest uppercase text-red-600">
                    Traiteur Compère
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-8">
                    <NavLink href="/" label="Accueil" />
                    <NavLink href="/about" label="À Propos" />
                    <NavLink href="/services" label="Services" />
                    <NavLink href="/contact" label="Contact" />
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-primary focus:outline-none p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-6 flex flex-col items-center space-y-6 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                    <MobileNavLink href="/" label="Accueil" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavLink href="/about" label="À Propos" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavLink href="/services" label="Services" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavLink href="/contact" label="Contact" onClick={() => setIsMobileMenuOpen(false)} />
                </div>
            )}
        </nav>
    );
}

function NavLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="text-sm font-medium uppercase tracking-wider hover:text-gold transition-colors duration-300 text-foreground"
        >
            {label}
        </Link>
    );
}

function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-lg font-medium uppercase tracking-wider text-primary hover:text-red-600 transition-colors duration-300"
        >
            {label}
        </Link>
    );
}
