import type { Metadata } from 'next';
import HomeClient from './components/HomeClient';

export const metadata: Metadata = {
  title: 'Traiteur Artisanal & Événements à Liège | Traiteur Compère',
  description:
    "Découvrez la cuisine authentique de la Maison Compère. Formules barbecues, buffets et événements privés ou d'entreprise en Wallonie.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Traiteur Artisanal & Événements à Liège | Traiteur Compère',
    description:
      "Découvrez la cuisine authentique de la Maison Compère. Formules barbecues, buffets et événements privés ou d'entreprise en Wallonie.",
    url: 'https://traiteur-compere.be',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Traiteur Compère - Traiteur Artisanal & Événements à Liège',
      },
    ],
  },
};

export default function Home() {
  return <HomeClient />;
}
