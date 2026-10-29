import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact & Devis | Traiteur Compère",
  description:
    "Contactez la Maison Compère pour une demande de devis personnalisé ou pour commander vos repas traiteur.",
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: "Contact & Devis | Traiteur Compère",
    description:
      "Contactez la Maison Compère pour une demande de devis personnalisé ou pour commander vos repas traiteur.",
    url: 'https://www.traiteur-compere.be/contact',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact & Devis | Traiteur Compère',
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
