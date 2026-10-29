import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Nos Services Traiteur | Événements & Réceptions",
  description:
    "Organisation de banquets, mariages, anniversaires et service boissons complet.",
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: "Nos Services Traiteur | Événements & Réceptions",
    description:
      "Organisation de banquets, mariages, anniversaires et service boissons complet.",
    url: 'https://www.traiteur-compere.be/services',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nos Services Traiteur | Événements & Réceptions',
      },
    ],
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
