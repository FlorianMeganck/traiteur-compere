import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Nos Services Traiteur | Événements & Réceptions",
  description:
    "Organisation de banquets, mariages, anniversaires et service boissons complet. Traiteur mariage à Liège, événements d'entreprise en Wallonie et formule bar brasseur clé en main (Huy-Waremme).",
  keywords: [
    "traiteur mariage liège",
    "traiteur événementiel entreprise wallonie",
    "location matériel bar brasseur huy waremme",
    "service boissons traiteur",
    "traiteur saint-georges-sur-meuse",
    "organisation banquets réceptions liège"
  ],
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: "Nos Services Traiteur | Événements & Réceptions",
    description:
      "Organisation de banquets, mariages, anniversaires et service boissons complet. Traiteur mariage à Liège, événements d'entreprise en Wallonie et formule bar brasseur clé en main.",
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
