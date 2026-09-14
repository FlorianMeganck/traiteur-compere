import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formules & Menus (BBQ, Buffets, Plats Uniques)',
  description:
    "Consultez notre carte complète : barbecues au feu de bois, buffets froids d'exception, salad bar et formules pour grandes tablées.",
  alternates: {
    canonical: '/formules',
  },
  openGraph: {
    title: 'Formules & Menus (BBQ, Buffets, Plats Uniques) | Traiteur Compère',
    description:
      "Consultez notre carte complète : barbecues au feu de bois, buffets froids d'exception, salad bar et formules pour grandes tablées.",
    url: 'https://traiteur-compere.be/formules',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Traiteur Compère - Formules & Menus',
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
