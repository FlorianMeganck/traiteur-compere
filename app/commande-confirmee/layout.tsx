import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confirmation de Commande',
  description:
    'Confirmation de votre commande de plats préparés chez Traiteur Compère.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CommandeConfirmeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
