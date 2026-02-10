import Link from "next/link";

export default function CGV() {
    return (
        <main className="min-h-screen pt-32 pb-20 bg-white">
            <div className="max-w-3xl mx-auto px-6">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-serif text-black mb-4">Conditions Générales de Vente (CGV)</h1>
                    <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
                </header>

                <div className="space-y-8 text-gray-700 leading-relaxed font-light">
                    <p className="italic text-lg">
                        Les présentes conditions générales régissent toutes les relations contractuelles entre le client et Traiteur Compère (Jean-Paul Compère), dont le siège est établi en région de Liège.
                    </p>

                    <section>
                        <h2 className="text-2xl font-serif text-black mb-3">Article 1 : Devis et Validité</h2>
                        <p>
                            Nos offres de prix sont valables pour une durée de 30 jours à dater de leur émission. Passé ce délai, Traiteur Compère se réserve le droit de modifier ses tarifs en fonction de l&apos;évolution du coût des denrées alimentaires.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-black mb-3">Article 2 : Commande et Acompte</h2>
                        <p>
                            La réservation ne devient définitive qu&apos;après réception du devis signé et du paiement d&apos;un acompte de 30% du montant total estimé. Le paiement de l&apos;acompte vaut acceptation pleine et entière des présentes conditions générales.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-black mb-3">Article 3 : Modification du nombre de convives</h2>
                        <p>Le nombre exact de convives doit nous être communiqué par écrit au plus tard 7 jours ouvrables avant la date de l&apos;événement.</p>
                        <p className="mt-2">Ce nombre sera considéré comme le minimum facturable, même si le nombre de présents est inférieur le jour J.</p>
                        <p className="mt-2">Toute augmentation de dernière minute fera l&apos;objet d&apos;une facturation complémentaire, sous réserve de faisabilité.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-black mb-3">Article 4 : Annulation par le client</h2>
                        <p>En cas d&apos;annulation de la commande par le client :</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Plus de 30 jours avant l&apos;événement :</strong> L&apos;acompte versé reste acquis à titre d&apos;indemnité forfaitaire.</li>
                            <li><strong>Moins de 7 jours avant l&apos;événement :</strong> La totalité du montant de la commande (100%) est due à titre d&apos;indemnité pour couverture des frais engagés et manque à gagner.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-black mb-3">Article 5 : Modalités de Paiement</h2>
                        <p>
                            Sauf convention contraire écrite, le solde de la facture est payable au comptant le jour de la prestation ou à réception de facture. Tout retard de paiement entraînera de plein droit et sans mise en demeure l&apos;application d&apos;intérêts de retard au taux légal en vigueur majoré de 10%.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-black mb-3">Article 6 : Réclamations</h2>
                        <p>
                            Toute réclamation concernant la prestation doit être formulée le jour même de l&apos;événement auprès du responsable présent, afin de nous permettre d&apos;y remédier immédiatement. Aucune plainte ultérieure ne sera prise en compte.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-black mb-3">Article 7 : Juridiction</h2>
                        <p>
                            En cas de litige, seuls les tribunaux de l&apos;arrondissement judiciaire de Liège sont compétents. Le droit belge est seul applicable.
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
