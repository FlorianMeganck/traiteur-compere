"use client";
import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function Analytics() {
    const [consentGiven, setConsentGiven] = useState<boolean | null>(null);

    // Vérifie si l'utilisateur a déjà fait un choix dans le passé
    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (consent === 'accepted') {
            setConsentGiven(true);
        } else if (consent === 'declined') {
            setConsentGiven(false);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setConsentGiven(true);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setConsentGiven(false);
    };

    return (
        <>
            {/* Le script GA n'est injecté que si consentGiven est TRUE */}
            {consentGiven && (
                <>
                    <Script 
                        strategy="afterInteractive" 
                        src={`https://www.googletagmanager.com/gtag/js?id=G-DM739YH09F`} 
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-DM739YH09F');
                        `}
                    </Script>
                </>
            )}

            {/* Le bandeau RGPD ne s'affiche que si aucun choix n'a été fait */}
            {consentGiven === null && (
                <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 text-white p-5 z-[9999] shadow-2xl border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in-up">
                    <div className="text-sm text-neutral-300 max-w-4xl">
                        <p className="font-bold text-white mb-1 text-base">🍪 À propos de votre vie privée</p>
                        <p>
                            Nous utilisons des cookies pour analyser le trafic de notre site (Google Analytics) et améliorer votre expérience de navigation. Aucune donnée à des fins publicitaires n'est collectée. Vous pouvez accepter ou refuser ces cookies à tout moment.
                        </p>
                    </div>
                    <div className="flex gap-3 shrink-0 w-full md:w-auto">
                        <button 
                            onClick={handleDecline} 
                            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl border border-neutral-600 text-neutral-300 hover:bg-neutral-800 transition-colors text-sm font-medium"
                        >
                            Refuser
                        </button>
                        <button 
                            onClick={handleAccept} 
                            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black hover:bg-[#C5A030] transition-colors text-sm font-bold shadow-lg"
                        >
                            Accepter
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
