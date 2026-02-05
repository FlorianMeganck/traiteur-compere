import Image from "next/image";

export default function Services() {
    return (
        <main className="min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <header className="text-center mb-16">
                    <h1 className="text-5xl font-serif text-black mb-4">Nos Services</h1>
                    <div className="w-24 h-1 bg-gold mx-auto" />
                    <p className="mt-6 text-gray-600 max-w-2xl mx-auto font-light">
                        Découvrez nos prestations sur mesure, conçues pour sublimer chaque instant de vos événements.
                    </p>
                </header>

                <div className="space-y-24">
                    <ServiceSection
                        title="Mariages"
                        image="/images/wedding.png"
                        reverse={false}
                        desc="Parce que ce jour est unique, nous mettons tout en œuvre pour qu'il soit inoubliable. Du vin d'honneur au gâteau, chaque détail est pensé pour ravir vos convives."
                        details={[
                            "Vin d'honneur personnalisé",
                            "Menus gastronomiques sur mesure",
                            "Service en salle impeccable",
                            "Ateliers culinaires live"
                        ]}
                    />

                    <ServiceSection
                        title="Banquets"
                        image="/images/banquet.png"
                        reverse={true}
                        desc="Anniversaires, communions, repas de famille... Nous transformons vos réunions en moments de partage gourmand et convivial."
                        details={[
                            "Buffets froids et chauds",
                            "Service à l'assiette",
                            "Décoration de table soignée",
                            "Adaptation aux régimes alimentaires"
                        ]}
                    />

                    <ServiceSection
                        title="Entreprises"
                        image="/images/corporate.png"
                        reverse={false}
                        desc="Impressionnez vos collaborateurs et clients avec une cuisine raffinée. Séminaires, lancements de produits ou fêtes de fin d'année, nous vous accompagnons."
                        details={[
                            "Petits-déjeuners d'affaires",
                            "Plateaux repas haut de gamme",
                            "Cocktails dînatoires",
                            "Gala de charité"
                        ]}
                    />
                </div>
            </div>
        </main>
    );
}

function ServiceSection({ title, image, desc, details, reverse }: { title: string; image: string; desc: string; details: string[]; reverse: boolean }) {
    return (
        <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
            <div className="w-full md:w-1/2 h-[400px] relative">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover rounded-sm shadow-xl"
                />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-3xl font-serif text-black">{title}</h2>
                <p className="text-gray-600 leading-relaxed font-light">
                    {desc}
                </p>
                <ul className="space-y-2">
                    {details.map((item, idx) => (
                        <li key={idx} className="flex items-center text-gray-700">
                            <span className="w-2 h-2 bg-gold rounded-full mr-3" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
