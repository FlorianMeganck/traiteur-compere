import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demande de Devis en Ligne Gratuit',
  description:
    'Composez votre formule en quelques clics et recevez votre devis personnalisé sous 24h pour vos événements en région liégeoise.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Demande de Devis en Ligne Gratuit | Traiteur Compère',
    description:
      'Composez votre formule en quelques clics et recevez votre devis personnalisé sous 24h pour vos événements en région liégeoise.',
    url: 'https://www.traiteur-compere.be/contact',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Traiteur Compère - Demande de Devis en Ligne',
      },
    ],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
