import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Espace Gestion de Commande | Traiteur Compère',
    description: 'Consultez votre réservation, ajoutez des convives et réglez votre solde en ligne en toute sécurité.',
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false
        }
    }
};

export default function GestionCommandeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
