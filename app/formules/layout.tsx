import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Nos Formules | Traiteur Compère",
  description:
    "Buffets chauds et froids, barbecues, réceptions privées et événements d'entreprise.",
  alternates: {
    canonical: '/formules',
  },
  openGraph: {
    title: "Nos Formules | Traiteur Compère",
    description:
      "Buffets chauds et froids, barbecues, réceptions privées et événements d'entreprise.",
    url: 'https://www.traiteur-compere.be/formules',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nos Formules | Traiteur Compère',
      },
    ],
  },
};

export default function FormulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
