import Link from "next/link";

export default function MentionsLegales() {
    return (
        <main className="min-h-screen pt-32 pb-20 bg-white">
            <div className="max-w-3xl mx-auto px-6">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-serif text-black mb-4">Mentions Légales</h1>
                    <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
                </header>

                <div className="bg-white p-8 md:p-12 shadow-2xl rounded-2xl space-y-8 text-gray-700 leading-relaxed font-light">

                    <section className="bg-neutral-50 p-8 rounded-2xl border border-neutral-100">
                        <h2 className="text-2xl font-serif text-black mb-6 border-b border-gray-200 pb-2">1. Éditeur du Site</h2>
                        <ul className="space-y-3">
                            <li><strong>Dénomination sociale :</strong> Maison Compère SRL</li>
                            <li><strong>Nom commercial :</strong> Traiteur Compère</li>
                            <li><strong>Siège social :</strong> Rue Potay 3, 4470 Saint-Georges-sur-Meuse</li>
                            <li><strong>Numéro d&apos;entreprise (BCE) :</strong> 0457.043.709</li>
                            <li><strong>Tribunal de l&apos;entreprise :</strong> Liège</li>
                            <li><strong>Email :</strong> <a href="mailto:traiteurcompere@gmail.com" className="text-[#D4AF37] hover:underline">traiteurcompere@gmail.com</a></li>
                            <li><strong>Responsable de la publication :</strong> Jean-Paul Compère (Gérant)</li>
                        </ul>
                    </section>

                    <section className="bg-neutral-50 p-8 rounded-2xl border border-neutral-100">
                        <h2 className="text-2xl font-serif text-black mb-6 border-b border-gray-200 pb-2">2. Hébergement</h2>
                        <p>
                            Ce site est hébergé par : <br />
                            <strong>Vercel Inc.</strong> <br />
                            440 N Barranca Ave #4133 <br />
                            Covina, CA 91723 <br />
                            États-Unis
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-black mb-4">3. Propriété Intellectuelle</h2>
                        <p>
                            L&apos;ensemble de ce site relève de la législation belge et internationale sur le droit d&apos;auteur et la propriété intellectuelle.
                            Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                            La reproduction de tout ou partie de ce site sur un support électronique quel qu&apos;il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-black mb-4">4. Protection des Données (RGPD)</h2>
                        <p>
                            Les informations recueillies via le formulaire de contact sont enregistrées dans un fichier informatisé par <strong>Maison Compère SRL</strong> pour l&apos;établissement de devis et la gestion de la relation client.
                        </p>
                        <p className="mt-4">
                            Elles sont conservées pendant la durée nécessaire à la gestion commerciale et sont destinées uniquement à l&apos;usage interne de l&apos;entreprise.
                            Conformément à la loi « informatique et libertés » et au RGPD, vous pouvez exercer votre droit d&apos;accès aux données vous concernant et les faire rectifier en contactant : <a href="mailto:traiteurcompere@gmail.com" className="text-[#D4AF37] hover:underline">traiteurcompere@gmail.com</a>.
                        </p>
                    </section>

                </div>

                <div className="mt-16 text-center border-t py-8">
                    <Link href="/" className="text-gray-500 hover:text-[#D4AF37] transition-colors text-sm uppercase tracking-widest">
                        ← Retour à l&apos;accueil
                    </Link>
                </div>
            </div>
        </main >
    );
}
