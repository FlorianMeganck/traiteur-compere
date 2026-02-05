"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

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

                <div className="hidden md:flex space-x-8">
                    <NavLink href="/" label="Accueil" />
                    <NavLink href="/about" label="À Propos" />
                    <NavLink href="/services" label="Services" />
                    <NavLink href="/contact" label="Contact" />
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="text-sm font-medium uppercase tracking-wider hover:text-gold transition-colors duration-300"
        >
            {label}
        </Link>
    );
}
