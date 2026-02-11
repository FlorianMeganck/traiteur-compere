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
  title: "Traiteur Compère - L'Excellence du Goût",
  description: "Traiteur haut de gamme pour mariages, banquets et événements d'entreprise à Saint-Georges-sur-Meuse.",
};

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GoogleAnalytics from "./components/GoogleAnalytics";
import CookieBanner from "./components/CookieBanner";

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
      </body>
    </html>
  );
}
