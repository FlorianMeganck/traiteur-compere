import Image from "next/image";
import Link from "next/link";

export default function About() {
    return (
        <main className="min-h-screen pt-32 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <header className="text-center mb-16">
                    <h1 className="text-5xl font-serif text-black mb-4">À Propos</h1>
                    <div className="w-24 h-1 bg-primary mx-auto" />
                </header>

                <section className="flex flex-col md:flex-row gap-12 items-center mb-24">
                    <div className="w-full md:w-1/2 relative h-[500px]">
                        <Image
                            src="/images/chef.png"
                            alt="Notre Chef"
                            fill
                            className="object-cover rounded-2xl shadow-xl"
                        />
                    </div>
                    <div className="w-full md:w-1/2 space-y-6">
                        <h2 className="text-3xl font-serif text-black">L'Art de Recevoir par Jean-Paul Compère</h2>
                        <p className="text-gray-600 leading-relaxed font-light text-lg">
                            Depuis plus de 20 ans, la Maison Compère incarne l'excellence traiteur en région liégeoise. Notre philosophie ? Une cuisine de cœur, généreuse et authentique, où le produit est roi.
                        </p>
                        <p className="text-gray-600 leading-relaxed font-light text-lg">
                            Que ce soit pour un mariage fastueux ou un repas d'association, nous mettons la même passion dans chaque assiette. Nous croyons que chaque événement mérite une attention particulière et une saveur inoubliable.
                        </p>
                    </div>
                </section>

                <section className="bg-neutral-50 p-12 rounded-2xl mb-24 border border-neutral-100">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif text-black">Nos Valeurs</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ValueCard
                            title="Passion"
                            desc="La cuisine est avant tout une histoire d'amour. Nous mettons tout notre cœur dans chaque préparation."
                        />
                        <ValueCard
                            title="Qualité"
                            desc="Aucun compromis sur la fraîcheur. Nous privilégions les circuits courts et les produits de saison."
                        />
                        <ValueCard
                            title="Excellence"
                            desc="Du service à l'assiette, nous visons l'excellence pour faire de votre événement une réussite totale."
                        />
                    </div>
                </section>

                {/* CALL TO ACTION */}
                <section className="text-center py-16 border-t border-neutral-100">
                    <h3 className="text-3xl font-serif text-black mb-6">Une idée en tête ? Discutons-en.</h3>
                    <Link
                        href="/contact"
                        className="inline-block bg-[#D4AF37] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-black transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Contactez-nous
                    </Link>
                </section>
            </div>
        </main>
    );
}

function ValueCard({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="text-center space-y-4 p-6 bg-white shadow-sm border-t-2 border-primary rounded-xl">
            <h3 className="text-xl font-serif text-black">{title}</h3>
            <p className="text-gray-600 font-light text-sm">{desc}</p>
        </div>
    );
}
