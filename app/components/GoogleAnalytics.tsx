"use client";

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [consent, setConsent] = useState(false);

    useEffect(() => {
        const checkConsent = () => {
            const preferencesStr = localStorage.getItem("cookie_preferences");
            if (preferencesStr) {
                try {
                    const preferences = JSON.parse(preferencesStr);
                    setConsent(preferences.analytical === true);
                } catch (e) {
                    setConsent(false);
                }
            } else {
                setConsent(false);
            }
        };

        // Vérifie au démarrage
        checkConsent();

        // Écoute les changements
        window.addEventListener('storage', checkConsent);
        window.addEventListener('cookie-preferences-updated', checkConsent);

        return () => {
            window.removeEventListener('storage', checkConsent);
            window.removeEventListener('cookie-preferences-updated', checkConsent);
        };
    }, []);

    useEffect(() => {
        if (consent && GA_MEASUREMENT_ID) {
            // Envoie la page vue à Google quand l'URL change
            if ((window as any).gtag) {
                (window as any).gtag('config', GA_MEASUREMENT_ID, {
                    page_path: pathname,
                });
            }
        }
    }, [pathname, searchParams, consent, GA_MEASUREMENT_ID]);

    // Si pas de consentement, on ne charge AUCUN script
    if (!consent) return null;

    return (
        <>
            <Script 
                strategy="afterInteractive" 
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} 
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_MEASUREMENT_ID}');
                `}
            </Script>
        </>
    );
}
