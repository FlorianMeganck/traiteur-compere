import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.traiteur-compere.be'),
  title: 'Traiteur Compère | Traiteur Événementiel & Mariages en Province de Liège',
  description: 'Traiteur artisanal en région liégeoise : barbecues gourmands, buffets chauds et froids, salad bars, formules collectivités et plats préparés sur-mesure.',
  keywords: ['traiteur liège', 'barbecue traiteur', 'buffet froid', 'saint-georges-sur-meuse', 'traiteur entreprise', 'salad bar'],
  authors: [{ name: 'Traiteur Compère' }],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/images/Logo_traiteur.png',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_BE',
    url: 'https://www.traiteur-compere.be',
    siteName: 'Traiteur Compère',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Traiteur Compère - Service Traiteur Événementiel',
      },
    ],
  },
};

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import ScrollToTop from "./components/ScrollToTop";
import StructuredData from "./components/StructuredData";

const siteNavigationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SiteNavigationElement",
      "name": "Menus de Fêtes 2026",
      "url": "https://www.traiteur-compere.be/menus-fetes"
    },
    {
      "@type": "SiteNavigationElement",
      "name": "Formules",
      "url": "https://www.traiteur-compere.be/formules"
    },
    {
      "@type": "SiteNavigationElement",
      "name": "Services",
      "url": "https://www.traiteur-compere.be/services"
    },
    {
      "@type": "SiteNavigationElement",
      "name": "Plats Préparés",
      "url": "https://www.traiteur-compere.be/plats-prepares"
    },
    {
      "@type": "SiteNavigationElement",
      "name": "Notre Histoire",
      "url": "https://www.traiteur-compere.be/a-propos"
    },
    {
      "@type": "SiteNavigationElement",
      "name": "Contact",
      "url": "https://www.traiteur-compere.be/contact"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationJsonLd) }}
        />
        <script
          id="google-consent-mode"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});
try {
  var savedPrefs = localStorage.getItem('cookie_preferences');
  if (savedPrefs) {
    var parsedPrefs = JSON.parse(savedPrefs);
    var analyticsConsent = parsedPrefs && parsedPrefs.analytical === true ? 'granted' : 'denied';
    var marketingConsent = parsedPrefs && parsedPrefs.marketing === true ? 'granted' : 'denied';
    gtag('consent', 'update', {
      'analytics_storage': analyticsConsent,
      'ad_storage': marketingConsent,
      'ad_user_data': marketingConsent,
      'ad_personalization': marketingConsent
    });
  }
} catch (e) {}`,
          }}
        />
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PPZWV4GV');`,
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${lato.variable} antialiased bg-white text-black font-sans`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PPZWV4GV"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <StructuredData />
        <Navbar />
        {children}
        <CookieBanner />
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}

