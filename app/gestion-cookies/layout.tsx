import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestion des Cookies & Préférences',
  description:
    'Gérez vos préférences relatives aux cookies et traceurs utilisés sur le site Traiteur Compère pour une expérience de navigation respectueuse.',
  alternates: {
    canonical: '/gestion-cookies',
  },
  openGraph: {
    title: 'Gestion des Cookies & Préférences | Traiteur Compère',
    description:
      'Gérez vos préférences relatives aux cookies et traceurs utilisés sur le site Traiteur Compère pour une expérience de navigation respectueuse.',
    url: 'https://traiteur-compere.be/gestion-cookies',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Traiteur Compère - Gestion des Cookies',
      },
    ],
  },
};

export default function GestionCookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
