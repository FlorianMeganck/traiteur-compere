"use client";

import { useState, useEffect } from 'react';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie_consent");
        if (consent === null) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie_consent", "true");
        window.dispatchEvent(new Event('local-consent-update'));
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookie_consent", "false");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/95 border-t border-[#D4AF37] p-4 md:p-6 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-white font-sans text-sm md:text-base text-center md:text-left">
                    Nous utilisons des cookies pour analyser notre trafic. Vos données restent anonymes.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={handleDecline}
                        className="text-gray-300 hover:text-white underline text-sm transition-colors duration-300"
                    >
                        Refuser
                    </button>
                    <button
                        onClick={handleAccept}
                        className="bg-[#D4AF37] text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-white transition-all duration-300 uppercase tracking-wide"
                    >
                        Accepter
                    </button>
                </div>
            </div>
        </div>
    );
}
