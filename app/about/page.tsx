import Image from "next/image";

export default function About() {
    return (
        <main className="min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <header className="text-center mb-16">
                    <h1 className="text-5xl font-serif text-black mb-4">À Propos</h1>
                    <div className="w-24 h-1 bg-gold mx-auto" />
                </header>

                <section className="flex flex-col md:flex-row gap-12 items-center mb-24">
                    <div className="w-full md:w-1/2 relative h-[500px]">
                        <Image
                            src="/images/chef.png"
                            alt="Notre Chef"
                            fill
                            className="object-cover rounded-sm shadow-xl"
                        />
                    </div>
                    <div className="w-full md:w-1/2 space-y-6">
                        <h2 className="text-3xl font-serif text-black">Notre Histoire</h2>
                        <p className="text-gray-600 leading-relaxed font-light">
                            Fondé sur une passion inébranlable pour la gastronomie, Traiteur Compère est né de l'envie de partager des moments d'exception. Depuis nos débuts à Saint-Georges-sur-Meuse, nous avons su allier tradition culinaire et créativité moderne.
                        </p>
                        <p className="text-gray-600 leading-relaxed font-light">
                            Chaque plat que nous servons raconte une histoire : celle de produits locaux sélectionnés avec soin, d'un savoir-faire artisanal et d'une quête perpétuelle de perfection.
                        </p>
                    </div>
                </section>

                <section className="bg-gray-50 p-12 rounded-sm mb-24">
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
            </div>
        </main>
    );
}

function ValueCard({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="text-center space-y-4 p-6 bg-white shadow-sm border-t-2 border-gold">
            <h3 className="text-xl font-serif text-black">{title}</h3>
            <p className="text-gray-600 font-light text-sm">{desc}</p>
        </div>
    );
}
