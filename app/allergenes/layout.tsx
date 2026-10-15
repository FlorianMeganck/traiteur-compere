import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guide des Allergènes & Informations Ingrédients',
  description:
    'Consultez les informations détaillées sur les 14 allergènes majeurs présents dans nos menus et préparations pour un événement en toute sécurité.',
  alternates: {
    canonical: '/allergenes',
  },
  openGraph: {
    title:
      'Guide des Allergènes & Informations Ingrédients | Traiteur Compère',
    description:
      'Consultez les informations détaillées sur les 14 allergènes majeurs présents dans nos menus et préparations pour un événement en toute sécurité.',
    url: 'https://www.traiteur-compere.be/allergenes',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Traiteur Compère - Guide des Allergènes',
      },
    ],
  },
};

export default function AllergenesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
