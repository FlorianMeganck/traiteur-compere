import Link from "next/link";

export default function Confidentialite() {
    return (
        <main className="min-h-screen pt-32 pb-20 bg-white">
            <div className="max-w-3xl mx-auto px-6">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-serif text-black mb-4">Politique de Confidentialité & Protection des Données</h1>
                    <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
                </header>

                <div className="space-y-8 text-gray-700 leading-relaxed font-light">
                    <p className="italic text-lg">
                        Traiteur Compère accorde une importance majeure à la confidentialité de vos données. Cette politique vise à vous informer en toute transparence sur la manière dont nous collectons, utilisons et protégeons vos informations personnelles, conformément au RGPD et à la législation belge.
                    </p>

                    <section>
                        <h2 className="text-2xl font-serif text-black mb-3">1. Responsable du Traitement</h2>
                        <p>
                            Le responsable du traitement des données est Traiteur Compère, représenté par Monsieur Jean-Paul Compère. <br />
                            Pour toute question : <a href="mailto:traiteurcompere@gmail.com" className="text-[#D4AF37] hover:underline">traiteurcompere@gmail.com</a> <br />
                            Adresse administrative : Région de Liège, Belgique.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-black mb-3">2. Données Collectées</h2>
                        <p>
                            Nous collectons uniquement les données strictement nécessaires via notre formulaire de contact ou par téléphone : Nom, Prénom, Adresse E-mail, Numéro de téléphone, ainsi que les détails liés à votre événement (date, lieu, type de menu). Aucune donnée sensible (opinions politiques, religieuses, etc.) n&apos;est demandée.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-black mb-3">3. Utilisation des Données</h2>
                        <p>Vos données sont traitées pour les finalités suivantes :</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Répondre à vos demandes de devis et de contact.</li>
                            <li>Exécuter le contrat de prestation traiteur (organisation, livraison, service).</li>
                            <li>Respecter nos obligations légales (comptabilité et facturation).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-black mb-3">4. Durée de Conservation (Suppression des données)</h2>
                        <p>Vos données ne sont pas conservées au-delà de la durée nécessaire :</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Données des prospects (devis sans suite) :</strong> Supprimées automatiquement 3 ans après le dernier contact.</li>
                            <li><strong>Données des clients (facturation) :</strong> Conservées 7 ans conformément aux obligations fiscales belges. Passé ces délais, vos données sont soit supprimées, soit anonymisées.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-black mb-3">5. Partage des Données</h2>
                        <p>
                            Nous ne vendons jamais vos données. Elles ne sont transmises qu&apos;aux tiers indispensables à la bonne exécution de la prestation (ex : comptable pour la facturation) et uniquement dans la limite de leurs missions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-black mb-3">6. Vos Droits</h2>
                        <p>
                            Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement (« droit à l&apos;oubli ») et de portabilité de vos données. Pour exercer ce droit, envoyez simplement un e-mail à <a href="mailto:traiteurcompere@gmail.com" className="text-[#D4AF37] hover:underline">traiteurcompere@gmail.com</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-black mb-3">7. Cookies</h2>
                        <p>
                            Ce site utilise uniquement des cookies techniques essentiels au fonctionnement. Aucun traçage publicitaire n&apos;est effectué sans votre consentement explicite.
                        </p>
                    </section>
                </div>

                <div className="mt-16 text-center border-t py-8">
                    <Link href="/" className="text-gray-500 hover:text-[#D4AF37] transition-colors text-sm uppercase tracking-widest">
                        ← Retour à l&apos;accueil
                    </Link>
                </div>
            </div>
        </main>
    );
}
