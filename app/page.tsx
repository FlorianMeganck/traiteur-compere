import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen w-full">
        <Image
          src="/images/hero_v3.png"
          alt="Traiteur haut de gamme presentation"
          fill
          className="object-cover brightness-[0.6]"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl md:text-7xl font-serif mb-6 tracking-wide drop-shadow-lg text-orange-500">
            L'Excellence du Goût
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-2xl mb-10 tracking-wider drop-shadow-md">
            Votre partenaire traiteur pour des moments inoubliables.
          </p>
          <Link
            href="/services"
            className="border-2 border-white text-white px-8 py-3 uppercase tracking-widest text-sm font-bold hover:bg-white hover:text-black transition-all duration-300"
          >
            Découvrir nos services
          </Link>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-gold uppercase tracking-widest text-sm font-bold">Nos Savoir-Faire</span>
            <h2 className="text-4xl font-serif mt-4 text-black">Créateurs d'Émotions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              title="Mariages"
              image="/images/wedding.png"
              desc="Une touche de magie pour le plus beau jour de votre vie."
            />
            <ServiceCard
              title="Banquets"
              image="/images/banquet.png"
              desc="Des mets raffinés pour vos grandes célébrations."
            />
            <ServiceCard
              title="Entreprises"
              image="/images/corporate.png"
              desc="L'élégance et le professionnalisme pour vos événements."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function ServiceCard({ title, image, desc }: { title: string; image: string; desc: string }) {
  return (
    <Link href="/services" className="group cursor-pointer block">
      <div className="relative h-[400px] w-full overflow-hidden mb-6">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
      </div>
      <h3 className="text-2xl font-serif mb-3 text-black group-hover:text-gold transition-colors">{title}</h3>
      <p className="text-gray-600 font-light leading-relaxed">{desc}</p>
    </Link>
  );
}
