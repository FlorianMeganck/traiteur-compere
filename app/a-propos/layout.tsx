import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maison Compère depuis 1821 | Notre Histoire & Savoir-Faire',
  description:
    "Découvrez l'histoire bicentenaire de la Maison Compère, traiteur d'excellence en Province de Liège alliant passion culinaire et tradition artisanale.",
  alternates: {
    canonical: '/a-propos',
  },
  openGraph: {
    title:
      'Maison Compère depuis 1821 | Notre Histoire & Savoir-Faire | Traiteur Compère',
    description:
      "Découvrez l'histoire bicentenaire de la Maison Compère, traiteur d'excellence en Province de Liège alliant passion culinaire et tradition artisanale.",
    url: 'https://traiteur-compere.be/a-propos',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Traiteur Compère - Maison Compère depuis 1821',
      },
    ],
  },
};

export default function AProposLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
