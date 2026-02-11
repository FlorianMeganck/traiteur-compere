"use client";

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [consent, setConsent] = useState(false);

    useEffect(() => {
        // Vérifie le consentement au démarrage
        const consentGiven = localStorage.getItem("cookie_consent");
        if (consentGiven === 'true') {
            setConsent(true);
        }

        // Écoute l'événement personnalisé déclenché par la bannière
        const handleConsentUpdate = () => {
            setConsent(localStorage.getItem("cookie_consent") === 'true');
        };

        window.addEventListener('storage', handleConsentUpdate); // Pour les autres onglets
        window.addEventListener('local-consent-update', handleConsentUpdate); // Pour l'onglet actif

        return () => {
            window.removeEventListener('storage', handleConsentUpdate);
            window.removeEventListener('local-consent-update', handleConsentUpdate);
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
                gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                    anonymize_ip: true
                });
                `}
            </Script>
        </>
    );
}
