"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Check if preferences are already set
        const preferences = localStorage.getItem("cookie_preferences");
        if (!preferences) {
            setIsVisible(true);
        }
    }, []);

    const handleRefuseAll = () => {
        const preferences = {
            essential: true,
            analytical: false,
            marketing: false
        };
        localStorage.setItem("cookie_preferences", JSON.stringify(preferences));
        setIsVisible(false);
    };

    const handleAcceptAll = () => {
        const preferences = {
            essential: true,
            analytical: true,
            marketing: true
        };
        localStorage.setItem("cookie_preferences", JSON.stringify(preferences));
        // Dispatch event if needed for analytics scripts to pick up immediately
        window.dispatchEvent(new Event('cookie-preferences-updated'));
        setIsVisible(false);
    };

    // Don't show banner if user is on the management page or if not visible
    if (!isVisible || pathname === '/gestion-cookies') return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/95 border-t border-[#D4AF37] p-4 md:p-6 backdrop-blur-sm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Text Content */}
                <p className="text-white font-sans text-sm md:text-base text-center md:text-left flex-1">
                    Nous utilisons des cookies pour optimiser votre expérience et analyser notre trafic. <br className="hidden md:block" />
                    Vous pouvez modifier vos choix à tout moment via le lien "Gestion des cookies" en bas de page.
                </p>

                {/* Buttons Container */}
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">

                    {/* Button 1: Refuse All */}
                    <button
                        onClick={handleRefuseAll}
                        className="px-4 py-2 text-gray-400 hover:text-white underline text-sm transition-colors duration-300 whitespace-nowrap"
                    >
                        Tout refuser
                    </button>

                    {/* Button 2: Customize */}
                    <Link
                        href="/gestion-cookies"
                        className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-all duration-300 text-center whitespace-nowrap"
                    >
                        Personnaliser
                    </Link>

                    {/* Button 3: Accept All */}
                    <button
                        onClick={handleAcceptAll}
                        className="px-6 py-2 bg-[#D4AF37] text-black rounded-full font-bold text-sm hover:bg-[#b08d2b] transition-all duration-300 uppercase tracking-wide shadow-lg hover:shadow-[#D4AF37]/20 whitespace-nowrap"
                    >
                        Tout accepter
                    </button>
                </div>
            </div>
        </div>
    );
}
