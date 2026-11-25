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
      "name": "Menus de Fêtes",
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
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=GTM-PPZWV4GV"
          strategy="afterInteractive"
        />
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `}
        </Script>
      </head>
      <body
        className={`${playfair.variable} ${lato.variable} antialiased bg-white text-black font-sans`}
      >
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

