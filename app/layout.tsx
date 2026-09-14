import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import { Suspense } from "react";
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
  metadataBase: new URL('https://traiteur-compere.be'),
  title: {
    default: 'Traiteur Compère | Traiteur Événementiel & Mariages en Province de Liège',
    template: '%s | Traiteur Compère',
  },
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
    url: 'https://traiteur-compere.be',
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
import GoogleAnalytics from "./components/GoogleAnalytics";
import CookieBanner from "./components/CookieBanner";

import ScrollToTop from "./components/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${playfair.variable} ${lato.variable} antialiased bg-white text-black font-sans`}
      >
        <Navbar />
        {children}
        <CookieBanner />
        <Suspense fallback={null}>
          <GoogleAnalytics GA_MEASUREMENT_ID='G-DM739YH09F' />
        </Suspense>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}

