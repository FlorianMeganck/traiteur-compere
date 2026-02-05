
export default function Footer() {
    return (
        <footer className="bg-black text-white py-12 border-t border-gold/20">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">
                <h3 className="text-2xl font-serif text-gold mb-4">Traiteur Compère</h3>
                <p className="mb-6 font-light text-gray-300">
                    L'Excellence du Goût à votre service.
                </p>
                <div className="text-sm tracking-mid font-light">
                    <p>Rue de la Paix 12</p>
                    <p>4470 Saint-Georges-sur-Meuse</p>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-900 w-full max-w-xs mx-auto">
                    <p className="text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} Traiteur Compère. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
}
